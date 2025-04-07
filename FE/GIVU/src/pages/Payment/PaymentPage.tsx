import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { makeFundingPayment } from '../../services/funding.service';

interface PaymentState {
  amount: number;
  title: string;
  creatorName: string;
  fundingId?: number | string;
}

// 비밀번호 모달 컴포넌트 추가
const PasswordModal = ({ isOpen, onClose, onSubmit, loading }: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (password: string) => void;
  loading: boolean;
}) => {
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 숫자만 입력 가능하고 6자리로 제한
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
    setPassword(value);
  };

  const handleSubmit = () => {
    if (password.length !== 6) {
      setError('비밀번호는 6자리 숫자여야 합니다.');
      return;
    }
    setError(null);
    onSubmit(password);
  };

  useEffect(() => {
    if (!isOpen) {
      setPassword('');
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">2차 비밀번호 확인</h2>
        <p className="text-gray-600 mb-4">결제를 완료하려면 2차 비밀번호를 입력해주세요.</p>
        
        <div className="flex justify-center mb-4">
          <div className="flex gap-2">
            {[...Array(6)].map((_, i) => (
              <div 
                key={i} 
                className="w-10 h-12 border-2 border-gray-300 rounded-md flex items-center justify-center text-xl font-bold"
              >
                {password[i] ? '•' : ''}
              </div>
            ))}
          </div>
        </div>
        
        <input
          type="password"
          value={password}
          onChange={handlePasswordChange}
          placeholder="6자리 비밀번호 입력"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-xl tracking-widest mb-4"
          maxLength={6}
          autoFocus
        />
        
        {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}
        
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            disabled={loading}
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={password.length !== 6 || loading}
            className={`flex-1 py-2 rounded-lg text-white ${
              password.length !== 6 || loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-black hover:bg-gray-800'
            }`}
          >
            {loading ? '처리 중...' : '확인'}
          </button>
        </div>
      </div>
    </div>
  );
};

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { fundingId: urlFundingId } = useParams<{ fundingId: string }>();
  
  // location.state가 없을 경우 기본값 설정
  const paymentData = location.state as PaymentState || {
    amount: 10000,
    title: "테스트 펀딩",
    creatorName: "테스트 사용자"
  };
  
  // URL에서 fundingId를 가져오거나 state에서 가져옴
  const fundingId = urlFundingId || paymentData.fundingId;
  const { amount, title } = paymentData;
  const [balance, setBalance] = useState<number>(0); // 기본값을 0으로 설정
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  useEffect(() => {
    // 실제 API를 사용하여 잔액 조회
    const fetchBalance = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || 
                      localStorage.getItem('access_token') || 
                      localStorage.getItem('token');
                      
        if (!token) {
          alert('로그인이 필요한 서비스입니다.');
          navigate('/login');
          return;
        }

        const baseUrl = import.meta.env.VITE_BASE_URL || import.meta.env.VITE_API_BASE_URL || 'https://j12d107.p.ssafy.io/api';
        
        console.log('GIVU Pay 잔액 조회 시작');
        
        // 1. /users/info API에서 기뷰페이 잔액 조회 (가장 우선)
        try {
          const userInfoResponse = await axios.get(
            `${baseUrl}/users/info`,
            {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
          );
          
          console.log('/users/info API 응답:', userInfoResponse.data);
          
          // 이 API에서 주는 balance가 기뷰페이 잔액임
          if (userInfoResponse.data && userInfoResponse.data.balance !== undefined) {
            const givupayBalance = Number(userInfoResponse.data.balance);
            console.log('기뷰페이 잔액 (/users/info에서 확인):', givupayBalance);
            setBalance(givupayBalance);
          } else {
            console.log('/users/info API에 balance 필드가 없음, 대체 API 호출 시도');
            await fetchBalanceFromAlternativeAPIs(token, baseUrl);
          }
        } catch (error) {
          console.error('/users/info API 호출 오류:', error);
          await fetchBalanceFromAlternativeAPIs(token, baseUrl);
        }
      } catch (err) {
        setError('잔액 조회에 실패했습니다.');
        console.error('Error fetching balance:', err);
      } finally {
        setLoading(false);
      }
    };
    
    // 대체 API를 사용한 잔액 조회 함수
    const fetchBalanceFromAlternativeAPIs = async (token: string, baseUrl: string) => {
      // 1. 첫 번째 대체 API - getUserBalance
      try {
        const givupayResponse = await axios.get(
          `${baseUrl}/mypage/getUserBalance`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        console.log('기뷰페이 잔액 조회 응답 (getUserBalance):', givupayResponse.data);
        
        if (givupayResponse.data && givupayResponse.data.code === 'SUCCESS' &&
            givupayResponse.data.data && givupayResponse.data.data.balance !== undefined) {
          const balance = Number(givupayResponse.data.data.balance);
          console.log('기뷰페이 잔액 새로고침 (getUserBalance):', balance);
          setBalance(balance);
          return true; // 이 API로 성공했으면 다음 API는 호출 안함
        } else {
          console.log('getUserBalance API에 balance 필드가 없음, 다음 API 시도');
        }
      } catch (error) {
        console.error('기뷰페이 잔액 조회 API (getUserBalance) 오류:', error);
      }
      
      // 2. 두 번째 대체 API - mypage/balance
      try {
        const balanceResponse = await axios.get(
          `${baseUrl}/mypage/balance`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        console.log('기뷰페이 잔액 조회 응답 (mypage/balance):', balanceResponse.data);
        
        if (balanceResponse.data && balanceResponse.data.code === 'SUCCESS') {
          let givupayBalance = null;
          
          // 다양한 필드 이름 조회
          if (balanceResponse.data.data) {
            if (balanceResponse.data.data.givupayBalance !== undefined) {
              givupayBalance = balanceResponse.data.data.givupayBalance;
            } else if (balanceResponse.data.data.balance !== undefined) {
              givupayBalance = balanceResponse.data.data.balance;
            } else if (balanceResponse.data.data.userBalance !== undefined) {
              givupayBalance = balanceResponse.data.data.userBalance;
            }
          }
          
          if (givupayBalance !== null) {
            console.log('기뷰페이 잔액 업데이트 (mypage/balance):', givupayBalance);
            setBalance(Number(givupayBalance));
            return true;
          }
        }
      } catch (error) {
        console.error('기뷰페이 잔액 조회 API (mypage/balance) 오류:', error);
      }
      
      return false;
    };
    
    fetchBalance();
  }, [navigate]);

  // 2차 비밀번호 검증 함수
  const verifyAccountPassword = async (inputPassword: string): Promise<boolean> => {
    try {
      const token = localStorage.getItem('auth_token') || 
                    localStorage.getItem('access_token') || 
                    localStorage.getItem('token');
      if (!token) {
        alert('로그인이 필요합니다.');
        return false;
      }
      
      const baseUrl = import.meta.env.VITE_BASE_URL || import.meta.env.VITE_API_BASE_URL || 'https://j12d107.p.ssafy.io/api';
      
      console.log('[비밀번호 검증] 입력된 비밀번호 길이:', inputPassword.length);
      console.log('[비밀번호 검증] 요청 URL:', `${baseUrl}/users/checkPassword`);
      
      try {
        // 2차 비밀번호 확인 API 호출
        const response = await axios.post(
          `${baseUrl}/users/checkPassword`,
          { password: inputPassword },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        console.log('[비밀번호 검증] 응답 성공:', response.status);
        console.log('[비밀번호 검증] 응답 데이터:', response.data);
        
        // 성공 코드인 경우 비밀번호 일치
        return response.data && response.data.code === 'SUCCESS';
      } catch (apiError: any) {
        console.error('[비밀번호 검증] API 오류:', apiError.message);
        
        if (apiError.response) {
          console.error('[비밀번호 검증] 응답 상태:', apiError.response.status);
          console.error('[비밀번호 검증] 응답 데이터:', apiError.response.data);
          
          // 400 오류의 경우 (비밀번호가 설정되지 않았거나 서버에 없는 경우)
          if (apiError.response.status === 400) {
            console.log('[비밀번호 검증] 400 오류 발생, 로컬 저장소에서 비밀번호 확인 시도');
            
            // 로컬 스토리지에서 계좌 비밀번호 확인 시도 (MyPage.tsx에서 사용하는 방식과 동일)
            const encodedPassword = localStorage.getItem('account_password');
            if (encodedPassword) {
              try {
                const storedPassword = atob(encodedPassword);
                const isMatch = inputPassword === storedPassword;
                console.log(`[비밀번호 검증] 로컬 스토리지 검증 결과: ${isMatch ? '일치' : '불일치'}`);
                
                if (isMatch) {
                  console.log('[비밀번호 검증] 로컬 스토리지 확인으로 비밀번호 인증 성공');
                  return true; // 로컬에 저장된 비밀번호와 일치하면 true 반환
                }
              } catch (decodeError) {
                console.error('[비밀번호 검증] 로컬 비밀번호 디코딩 오류:', decodeError);
              }
            } else {
              console.log('[비밀번호 검증] 로컬에 저장된 계좌 비밀번호가 없음');
            }
          }
        }
        
        // 오류 발생 시 false 반환
        return false;
      }
    } catch (error) {
      console.error('[비밀번호 검증] 일반 오류:', error);
      return false;
    }
  };

  const handlePasswordSubmit = async (password: string) => {
    setLoading(true);
    
    try {
      // 비밀번호 검증
      const isPasswordValid = await verifyAccountPassword(password);
      if (!isPasswordValid) {
        alert('2차 비밀번호가 일치하지 않습니다.');
        setLoading(false);
        return;
      }
      
      // 비밀번호 확인 완료 후 결제 진행
      processPayment();
    } catch (err) {
      console.error('비밀번호 확인 오류:', err);
      setError('비밀번호 확인 중 오류가 발생했습니다.');
      setLoading(false);
    }
  };

  const processPayment = async () => {
    try {
      setLoading(true);
      
      const token = localStorage.getItem('auth_token') || 
                    localStorage.getItem('access_token') || 
                    localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      if (!fundingId) {
        setError('펀딩 정보가 없습니다.');
        setLoading(false);
        return;
      }

      // 결제 금액 유효성 검사
      if (!amount || amount <= 0) {
        setError('유효한 결제 금액을 입력해주세요.');
        setLoading(false);
        return;
      }

      // 금액을 정수로 변환 (소수점 제거)
      const amountInt = Math.floor(amount);
      console.log('결제 요청 정보:', { fundingId, amount: amountInt });
      
      try {
        // 직접 API 호출로 변경
        const baseUrl = import.meta.env.VITE_BASE_URL || import.meta.env.VITE_API_BASE_URL || 'https://j12d107.p.ssafy.io/api';
        const apiUrl = `${baseUrl}/fundings/${fundingId}/transfer`;
        
        console.log('직접 API 요청 URL:', apiUrl);
        
        // 다양한 필드명을 포함하여 시도
        const requestData = {
          amount: amountInt,
          transactionAmount: amountInt,
          transfer_amount: amountInt,
          funding_amount: amountInt,
          value: amountInt
        };
        
        console.log('직접 API 요청 데이터:', JSON.stringify(requestData));
        
        const response = await axios.post(
          apiUrl,
          requestData,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        console.log('결제 응답 데이터:', response.data);
        
        // 결제 성공 시
        if (response.data && (response.data.code === 'SUCCESS' || response.status === 200)) {
          // 잔액 재조회
          try {
            const userInfoResponse = await axios.get(
              `${baseUrl}/users/info`,
              {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              }
            );
            
            if (userInfoResponse.data && userInfoResponse.data.balance !== undefined) {
              const newBalance = Number(userInfoResponse.data.balance);
              console.log('결제 후 업데이트된 기뷰페이 잔액:', newBalance);
              setBalance(newBalance);
            }
          } catch (balanceError) {
            console.error('결제 후 잔액 조회 오류:', balanceError);
          }
          
          // 성공 메시지 표시
          alert('펀딩 참여가 완료되었습니다!');
          
          // 비밀번호 모달 닫기
          setIsPasswordModalOpen(false);
          
          // 펀딩 상세 페이지로 리다이렉트
          navigate(`/funding/${fundingId}`);
        } else {
          // 에러 처리
          setError(response.data?.message || '결제 처리 중 오류가 발생했습니다.');
        }
      } catch (paymentError: any) {
        // API 호출 오류 처리
        console.error('결제 API 오류:', paymentError);
        
        // 응답 데이터가 있는 경우 자세히 로깅
        if (paymentError.response) {
          console.error('응답 상태:', paymentError.response.status);
          console.error('응답 데이터:', typeof paymentError.response.data === 'object' ? 
            JSON.stringify(paymentError.response.data) : paymentError.response.data);
          
          // Spring Boot 오류 형식 확인
          const responseData = paymentError.response.data;
          if (typeof responseData === 'object') {
            console.error('응답 데이터 키:', Object.keys(responseData).join(', '));
            
            // Spring 오류 형식 처리
            if (responseData.timestamp && responseData.status && responseData.error) {
              console.error('Spring 오류 응답:', {
                timestamp: responseData.timestamp,
                status: responseData.status,
                error: responseData.error,
                path: responseData.path
              });
            }
            
            // 오류 메시지 설정
            if (responseData.message) {
              setError(responseData.message);
              return;
            }
            
            if (responseData.error) {
              setError(responseData.error);
              return;
            }
          }
        }
        
        setError(paymentError.message || '결제 처리 중 오류가 발생했습니다.');
      }
    } catch (err: any) {
      // 전반적인 오류 처리
      console.error('Error processing payment:', err);
      setError(err.message || '결제 처리 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = () => {
    if (balance < amount) {
      alert('잔액이 부족합니다. GIVU 페이를 충전해주세요.');
      return;
    }

    // 비밀번호 모달 열기
    setIsPasswordModalOpen(true);
  };

  if (loading && !isPasswordModalOpen) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-8">결제하기</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">결제 정보</h2>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-600">펀딩 제목</span>
            <span className="font-medium">{title}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">선물 금액</span>
            <span className="font-medium">{amount.toLocaleString()}원</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">현재 GIVU 페이 잔액</span>
            <div className="flex items-center gap-2">
              <span className="font-medium">{balance.toLocaleString()}원</span>
              <button
                onClick={() => {
                  setLoading(true);
                  const fetchBalanceFn = async () => {
                    try {
                      const token = localStorage.getItem('auth_token') || 
                                    localStorage.getItem('access_token') || 
                                    localStorage.getItem('token');
                      if (!token) return;
                      
                      const baseUrl = import.meta.env.VITE_BASE_URL || import.meta.env.VITE_API_BASE_URL || 'https://j12d107.p.ssafy.io/api';
                      
                      const userInfoResponse = await axios.get(`${baseUrl}/users/info`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                      });
                      
                      if (userInfoResponse.data && userInfoResponse.data.balance !== undefined) {
                        setBalance(Number(userInfoResponse.data.balance));
                      }
                    } catch (error) {
                      console.error('잔액 갱신 오류:', error);
                    } finally {
                      setLoading(false);
                    }
                  };
                  
                  fetchBalanceFn();
                }}
                className="text-xs py-1 px-2 bg-gray-100 hover:bg-gray-200 rounded text-gray-600"
                disabled={loading}
              >
                {loading ? '로딩 중...' : '잔액 새로고침'}
              </button>
            </div>
          </div>
          <div className="flex justify-between text-lg font-bold">
            <span>결제 후 잔액</span>
            <span className={balance - amount < 0 ? 'text-red-500' : ''}>
              {(balance - amount).toLocaleString()}원
            </span>
          </div>
          
          {balance < amount && (
            <div className="mt-4 bg-red-50 border border-red-100 p-3 rounded-md text-sm text-red-600">
              <p className="font-semibold mb-1">잔액이 부족합니다!</p>
              <p>마이페이지에서 GIVU Pay를 충전해주세요.</p>
              <button 
                onClick={() => navigate('/mypage')}
                className="mt-2 w-full py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
              >
                GIVU Pay 충전하러 가기
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h3 className="font-semibold mb-2">결제 안내</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• 결제는 GIVU 페이를 통해 진행됩니다.</li>
          <li>• 결제 후에는 취소가 불가능합니다.</li>
          <li>• 결제가 완료되면 펀딩 목록으로 이동합니다.</li>
        </ul>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex-1 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          취소
        </button>
        <button
          onClick={handlePayment}
          disabled={balance < amount}
          className={`flex-1 py-3 rounded-lg text-white font-medium ${
            balance < amount
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-black hover:bg-gray-800'
          }`}
        >
          결제하기
        </button>
      </div>
      
      {/* 비밀번호 모달 */}
      <PasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSubmit={handlePasswordSubmit}
        loading={loading}
      />
    </div>
  );
};

export default PaymentPage; 