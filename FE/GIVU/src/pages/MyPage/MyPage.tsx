import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

// 임시 데이터 - 나중에 API에서 가져오도록 수정 예정


// 임시 펀딩 데이터
// const MY_FUNDINGS = [
//   {
//     id: 1,
//     title: "도현이 점심 펀딩",
//     progress: 45, // 달성률 수정
//     tag: "45% 달성",
//     imageUrl: "https://via.placeholder.com/300x200?text=펀딩이미지1",
//   },
//   {
//     id: 2,
//     title: "도현이 아침 펀딩",
//     progress: 28,
//     tag: "28% 달성",
//     imageUrl: "https://via.placeholder.com/300x200?text=펀딩이미지2",
//   },
//   {
//     id: 3,
//     title: "도현이 저녁 펀딩",
//     progress: 72,
//     tag: "72% 달성",
//     imageUrl: "https://via.placeholder.com/300x200?text=펀딩이미지3",
//   },
// ];

// const PARTICIPATED_FUNDINGS = [
//   {
//     id: 4,
//     title: "오늘 도현이의 패션",
//     progress: 66,
//     tag: "66% 달성",
//     imageUrl: "https://via.placeholder.com/300x200?text=패션이미지",
//   },
//   {
//     id: 5,
//     title: "도현이 팬티 펀딩",
//     progress: 89,
//     tag: "89% 달성",
//     imageUrl: "https://via.placeholder.com/300x200?text=팬티이미지",
//   },
// ];

// 임시 후기 데이터 - 더 많은 데이터 추가 (페이지네이션 테스트용)
// const MY_REVIEWS = [
//   {
//     id: 1,
//     title: "노란색이 된 도현이의 속옷을 사주세요 !!!",
//     date: "2025.03.10",
//     author: "닉네임",
//     views: 235,
//     image: "https://via.placeholder.com/150x100?text=속옷이미지"
//   },
//   {
//     id: 2,
//     title: "제 워너비 복장입니다 사주세요 !!!",
//     date: "2025.03.01",
//     author: "정도현",
//     views: 124,
//     image: "https://via.placeholder.com/150x100?text=복장이미지"
//   },
//   // 추가 데이터는 실제 구현 시 API에서 가져올 것입니다
// ];

// 임시 찜 목록 데이터
// const WISHLIST_ITEMS = [
//   { 
//     id: 5, 
//     name: "에어팟 프로 2", 
//     price: 359000, 
//     category: "가전/디지털", 
//     imageUrl: "https://via.placeholder.com/200x200?text=에어팟+프로", 
//     discount: 10 
//   },
//   { 
//     id: 11, 
//     name: "애플 맥북 프로", 
//     price: 2490000, 
//     category: "가전/디지털", 
//     imageUrl: "https://via.placeholder.com/200x200?text=맥북+프로", 
//     discount: 5 
//   }
// ];

// 탭 메뉴 타입 정의
type TabType = "created" | "participated" | "wishlist" | "purchased";

// Funding 타입을 먼저 정의
type Funding = {
  id: number;
  title: string;
  progress: number;
  tag: string;
  imageUrl: string;
  createdAt?: string; // 생성일 추가
  updatedAt?: string; // 업데이트일 추가
};

// 구매 상품 타입 정의
type PurchasedProduct = {
  id: number;
  productName: string;
  category: string;
  price: number;
  image: string;
  star: number;
  createdAt: string;
  description: string;
};

// 그 다음 FundingProps 인터페이스 정의
interface FundingProps {
  funding: Funding;
}

// 거래 타입 정의
type TransactionType = 'deposit' | 'withdrawal';

// 거래 인터페이스 정의
// interface Transaction {
//   transactionBalance: number;
//   accountNo: string;
// }

// 기존 타입 정의들 위에 추가
interface UserData {
  kakaoId: number;
  nickname: string;
  email: string;
  profileImage: string;
  balance?: number; // 잔액은 선택적 필드로 변경
}

// 모달 컴포넌트 추가
const TransactionModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  type: TransactionType;
  updateUserData?: (data: UserData) => void;
  onTransactionSuccess?: (responseData: any) => void;
}> = ({ isOpen, onClose, type, onTransactionSuccess }) => {
  const [amount, setAmount] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<number>(1); // 1: 금액 입력, 2: 비밀번호 입력

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 숫자만 입력 가능
    const value = e.target.value.replace(/[^0-9]/g, '');
    setAmount(value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 숫자만 입력 가능하고 6자리로 제한
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
    setPassword(value);
  };

  const handleNextStep = () => {
    if (!amount || Number(amount) <= 0) {
      setError('유효한 금액을 입력해주세요.');
      return;
    }
    setError(null);
    setStep(2);
  };

  // 로컬에 저장된 계좌 비밀번호 검증 함수
  const verifyAccountPassword = async (inputPassword: string): Promise<boolean> => {
    console.log('[verifyAccountPassword] 계좌 비밀번호 검증 시작');
    
    // 입력 비밀번호 유효성 확인
    if (!inputPassword || inputPassword.length !== 6 || !/^\d+$/.test(inputPassword)) {
      console.error('[verifyAccountPassword] 유효하지 않은 비밀번호 형식');
      return false;
    }
    
    try {
      // 토큰 가져오기
      const token = localStorage.getItem('auth_token');
      if (!token) {
        console.error('[verifyAccountPassword] 인증 토큰이 없습니다.');
        return false;
      }
      
      // API 호출로 비밀번호 확인
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/users/checkPassword`,
        { password: inputPassword },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('[verifyAccountPassword] API 응답:', response.data);
      
      // API 응답에 따라 검증 결과 판단
      const isMatch = response.data.code === 'SUCCESS' || response.data.success === true;
      
      // 결과 로깅 (실제 비밀번호는 로깅하지 않음)
      console.log(`[verifyAccountPassword] 비밀번호 검증 결과: ${isMatch ? '일치' : '불일치'}`);
      
      return isMatch;
      
    } catch (error: any) {
      console.error('[verifyAccountPassword] API 오류:', error);
      
      // 응답 오류 상세 로깅
      if (error.response) {
        console.error('응답 상태:', error.response.status);
        console.error('응답 데이터:', error.response.data);
      }
      
      return false;
    }
  };

  const handleSubmit = async () => {
    if (password.length !== 6) {
      setError('비밀번호는 6자리 숫자여야 합니다.');
      return;
    }

    setLoading(true);
    
    try {
      // API를 통한 계좌 비밀번호 검증
      const isPasswordValid = await verifyAccountPassword(password);
      
      if (!isPasswordValid) {
        setError('계좌 비밀번호가 일치하지 않습니다.');
        setLoading(false);
        return;
      }
      
      setError(null);

      // 토큰 가져오기
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('로그인이 필요합니다.');
      }

      // 금액을 반드시 숫자형으로 변환
      const numericAmount = Number(amount);
      if (isNaN(numericAmount) || numericAmount <= 0) {
        throw new Error('유효하지 않은 금액입니다.');
      }

      console.log(`${type === 'deposit' ? '충전' : '출금'} 금액: ${numericAmount}`);

      // 실제 API 호출
      // 충전(기뷰페이로 돈을 넣는 것) -> 연동계좌 출금 API 사용
      // 출금(기뷰페이에서 돈을 빼는 것) -> 연동계좌 입금 API 사용
      const endpoint = type === 'deposit' 
        ? `${import.meta.env.VITE_API_BASE_URL}/mypage/account/withdrawal` // 충전: 계좌→기뷰페이
        : `${import.meta.env.VITE_API_BASE_URL}/mypage/account/deposit`; // 출금: 기뷰페이→계좌
      
      console.log(`거래 요청 시작: ${type}`);
      console.log(`거래 엔드포인트: ${endpoint}`);
      
      // 요청 데이터 구성 - 원래 API 명세에 맞게 password 필드 사용
      const requestData = {
        amount: numericAmount,
        password: password // 비밀번호 필드명 확인
      };
      
      console.log('요청 데이터 구조:', JSON.stringify({
        amount: numericAmount,
        password: '******' // 실제 비밀번호는 로그에 남기지 않음
      }));
      
      // 계좌 비밀번호와 금액을 함께 서버로 전송
      // 서버에서 비밀번호 검증 후 처리
      const response = await axios.post(
        endpoint,
        requestData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log(`거래 응답 수신`);
      console.log('응답 상태:', response.status);
      console.log('응답 데이터:', response.data);
      
      if (response.data.code === 'SUCCESS' || response.data.success === true) {
        // 트랜잭션 성공 콜백 호출 - 가장 먼저 호출
        if (onTransactionSuccess) {
          console.log('트랜잭션 성공 콜백 호출');
          await onTransactionSuccess(response.data);
        }
        
        // 성공 시 UI 업데이트와 사용자 알림은 콜백 이후에 수행
        alert(type === 'deposit' ? '기뷰페이 충전이 완료되었습니다.' : '기뷰페이 출금이 완료되었습니다.');
      resetModal();
      onClose();
      } else {
        // 오류 응답 처리
        throw new Error(response.data.message || '처리 중 오류가 발생했습니다.');
      }
    } catch (err: any) {
      console.error(`거래 오류:`, err);
      
      // 응답 오류 상세 로깅
      if (err.response) {
        console.error('응답 상태:', err.response.status);
        console.error('응답 데이터:', err.response.data);
        // 오류 응답 구조 파악
        if (typeof err.response.data === 'object') {
          console.error('오류 응답 데이터 키:', Object.keys(err.response.data));
          if (err.response.data.message) {
            console.error('오류 메시지:', err.response.data.message);
          }
          if (err.response.data.error) {
            console.error('오류 코드:', err.response.data.error);
          }
        }
      }
      
      // 비밀번호 오류 메시지를 더 명확하게 사용자에게 안내
      if (err.response && err.response.data && err.response.data.message) {
        if (err.response.data.message.includes('비밀번호') || 
            err.response.data.message.includes('password')) {
          setError('계좌 비밀번호가 일치하지 않습니다.');
        } else {
          setError(err.response.data.message);
        }
      } else {
      setError(err.message || '거래 중 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  const resetModal = () => {
    setAmount('');
    setPassword('');
    setError(null);
    setStep(1);
  };

  useEffect(() => {
    if (!isOpen) {
      resetModal();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-cusBlack">
          {type === 'deposit' ? '기뷰페이 충전하기' : '기뷰페이 출금하기'}
        </h2>
        
        {step === 1 ? (
          // 금액 입력 단계
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-cusBlack-light mb-1">
                {type === 'deposit' ? '충전 금액' : '출금 금액'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={amount}
                  onChange={handleAmountChange}
                  placeholder="금액을 입력하세요"
                  className="w-full px-4 py-2 border border-cusGray rounded-lg focus:outline-none focus:ring-2 focus:ring-cusBlue"
                  autoFocus
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-cusBlack-light">
                  원
                </span>
              </div>
            </div>

            {error && (
              <div className="text-cusRed text-sm py-2">
                {error}
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-cusGray rounded-lg text-cusBlack-light hover:bg-cusGray-light transition-colors"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                disabled={!amount || Number(amount) <= 0}
                className={`flex-1 px-4 py-2 rounded-lg text-white ${
                  !amount || Number(amount) <= 0
                    ? 'bg-cusBlue-light cursor-not-allowed' 
                    : 'bg-cusBlue hover:bg-cusBlue-dark'
                } transition-colors`}
              >
                다음
              </button>
            </div>
          </div>
        ) : (
          // 비밀번호 입력 단계
          <div className="space-y-4">
            <div>
              <p className="text-lg font-medium text-cusBlack mb-2">
                {type === 'deposit' ? '연동 계좌에서 기뷰페이로 충전' : '기뷰페이에서 연동 계좌로 출금'}을 위해 계좌 비밀번호를 입력해주세요.
              </p>
              <p className="text-cusBlack-light mb-4">
                금액: <span className="font-bold text-cusBlack">{Number(amount).toLocaleString()}원</span>
              </p>
              
              <div className="flex justify-center mb-3">
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
                className="w-full px-4 py-3 border border-cusGray rounded-lg text-center text-xl tracking-widest"
                maxLength={6}
                autoFocus
              />
              <p className="text-xs text-gray-500 mt-2 text-center">
                계좌 비밀번호는 서버에 안전하게 저장되어 있으며, 거래 시 검증을 위해서만 사용됩니다.
              </p>
            </div>

            {error && (
              <div className="text-cusRed text-sm py-2 text-center">
                {error}
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 px-4 py-2 border border-cusGray rounded-lg text-cusBlack-light hover:bg-cusGray-light transition-colors"
              >
                이전
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={password.length !== 6 || loading}
                className={`flex-1 px-4 py-2 rounded-lg text-white ${
                  password.length !== 6 || loading
                    ? 'bg-cusBlue-light cursor-not-allowed' 
                    : 'bg-cusBlue hover:bg-cusBlue-dark'
                } transition-colors`}
              >
                {loading ? '처리중...' : type === 'deposit' ? '충전하기' : '출금하기'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// 계좌 생성 모달 컴포넌트 추가
const AccountCreationModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (password: string) => void;
}> = ({ isOpen, onClose, onSubmit }) => {
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<number>(1); // 1: 비밀번호 입력, 2: 비밀번호 확인
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
    setPassword(value);
    // 비밀번호 변경 시 에러 초기화
    if (error) setError(null);
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
    setConfirmPassword(value);
    // 확인 비밀번호 변경 시 에러 초기화
    if (error) setError(null);
  };

  const handleNextStep = () => {
    if (password.length !== 6) {
      setError('비밀번호는 6자리 숫자여야 합니다.');
      return;
    }
    setError(null);
    setStep(2);
  };

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      // 비밀번호 전송 전 로깅 (실제 비밀번호는 로깅하지 않음)
      console.log('계좌 생성 비밀번호 제출 준비 완료:', {
        length: password.length,
        isNumeric: /^\d+$/.test(password),
        matches: password === confirmPassword
      });
      
      // onSubmit은 비동기 함수일 수 있으므로 await 추가
      await onSubmit(password);
    } catch (err: any) {
      console.error('계좌 생성 제출 오류:', err);
      setError(err.message || '계좌 생성 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetModal = () => {
    setPassword('');
    setConfirmPassword('');
    setError(null);
    setStep(1);
    setIsSubmitting(false);
  };

  useEffect(() => {
    if (!isOpen) {
      resetModal();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {step === 1 ? '기뷰페이 계좌 생성' : '비밀번호 확인'}
        </h2>
        
        <div className="mb-6">
          <p className="text-gray-600 text-center mb-4">
            {step === 1 
              ? '계좌 이용을 위한 6자리 비밀번호를 입력해주세요.' 
              : '비밀번호를 한번 더 입력해주세요.'}
          </p>
          
          {step === 1 ? (
            <div className="flex justify-center mb-3">
              <div className="flex gap-2">
                {[...Array(6)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-10 h-12 border-2 ${
                      password[i] ? 'border-cusBlue' : 'border-gray-300'
                    } rounded-md flex items-center justify-center text-xl font-bold`}
                  >
                    {password[i] ? '•' : ''}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex justify-center mb-3">
              <div className="flex gap-2">
                {[...Array(6)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-10 h-12 border-2 ${
                      confirmPassword[i] ? 'border-cusBlue' : 'border-gray-300'
                    } rounded-md flex items-center justify-center text-xl font-bold`}
                  >
                    {confirmPassword[i] ? '•' : ''}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {step === 1 ? (
            <div>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="6자리 비밀번호 입력"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-xl tracking-widest"
              maxLength={6}
              autoFocus
            />
              <p className="text-xs text-gray-500 mt-2 text-center">
                비밀번호는 숫자 6자리로 설정해주세요. 이 비밀번호는 기뷰페이 충전/출금 시 필요합니다.
              </p>
            </div>
          ) : (
            <div>
            <input
              type="password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              placeholder="비밀번호 확인"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-xl tracking-widest"
              maxLength={6}
              autoFocus
            />
              <p className="text-xs text-gray-500 mt-2 text-center">
                입력한 비밀번호를 한번 더 입력해주세요.
              </p>
            </div>
          )}
          
          {error && (
            <p className="text-red-500 text-sm mt-3 text-center font-medium">{error}</p>
          )}
        </div>
        
        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50"
          >
            취소
          </button>
          
          {step === 1 ? (
            <button
              onClick={handleNextStep}
              disabled={password.length !== 6}
              className={`px-6 py-2 ${
                password.length === 6 
                  ? 'bg-cusBlue hover:bg-cusBlue-dark text-white' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              } rounded-md transition-colors`}
            >
              다음
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={confirmPassword.length !== 6 || isSubmitting}
              className={`px-6 py-2 ${
                confirmPassword.length === 6 && !isSubmitting
                  ? 'bg-cusBlue hover:bg-cusBlue-dark text-white' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              } rounded-md transition-colors`}
            >
              {isSubmitting ? '계좌 생성 중...' : '계좌 생성'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const MyPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("created");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [wishlistProducts, setWishlistProducts] = useState<any[]>([]);
  const [loadingWishlist, setLoadingWishlist] = useState(false);
  
  // 구매한 상품 상태 추가
  const [purchasedProducts, setPurchasedProducts] = useState<PurchasedProduct[]>([]);
  const [loadingPurchasedProducts, setLoadingPurchasedProducts] = useState(false);
  
  // 방법 1: HTMLDivElement | null 타입으로 명시적 정의
  const createdFundingsRef = useRef<HTMLDivElement | null>(null);
  const participatedFundingsRef = useRef<HTMLDivElement | null>(null);
  const purchasedProductsRef = useRef<HTMLDivElement | null>(null);
  
  // 내가 만든 펀딩, 참여한 펀딩 상태 추가
  const [myFundings, setMyFundings] = useState<Funding[]>([]);
  const [participatedFundings, setParticipatedFundings] = useState<Funding[]>([]);
  const [loadingMyFundings, setLoadingMyFundings] = useState(false);
  const [loadingParticipatedFundings, setLoadingParticipatedFundings] = useState(false);
  
  // CSS 애니메이션 속성을 담은 스타일 객체
  const scrollbarStyle = {
    scrollbarWidth: 'none' as const,
    msOverflowStyle: 'none' as const,
    WebkitOverflowScrolling: 'touch' as const, // 부드러운 스크롤을 위한 속성
    transition: 'all 0.3s ease-in-out'
  };

  // 스크롤 함수 수정
  const scrollHorizontally = (ref: React.RefObject<HTMLDivElement> | any, direction: 'left' | 'right') => {
    if (ref && ref.current) {
      // 스크롤 양을 화면 너비의 80%로 설정하여 더 자연스럽게 이동
      const scrollAmount = window.innerWidth * 0.8;
      const scrollLeft = direction === 'left' 
        ? ref.current.scrollLeft - scrollAmount 
        : ref.current.scrollLeft + scrollAmount;
      
      ref.current.scrollTo({
        left: scrollLeft,
        behavior: 'smooth' // CSS 스크롤 동작 설정
      });
    }
  };

  // 페이지 변경 함수
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  
  // 스크롤 버튼 클릭 핸들러 분리
  const handleScrollLeft = (refObject: React.RefObject<HTMLDivElement> | any) => {
    scrollHorizontally(refObject, 'left');
  };
  
  const handleScrollRight = (refObject: React.RefObject<HTMLDivElement> | any) => {
    scrollHorizontally(refObject, 'right');
  };
  
  // 페이지네이션 컴포넌트
  const Pagination: React.FC<{
    totalItems: number;
    itemsPerPage: number;
    currentPage: number;
    onPageChange: (page: number) => void;
  }> = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    if (totalPages <= 1) return null; // 페이지가 1개 이하면 표시하지 않음
    
    // 페이지 버튼 생성 (최대 5개)
    const pageNumbers = [];
    const maxPageButtons = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);
    
    if (endPage - startPage + 1 < maxPageButtons) {
      startPage = Math.max(1, endPage - maxPageButtons + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return (
      <div className="flex justify-center items-center mt-6 space-x-2">
        {/* 이전 페이지 버튼 */}
        <button 
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            currentPage === 1 
              ? 'bg-cusGray text-cusBlack-light cursor-not-allowed' 
              : 'bg-cusLightBlue text-cusBlue hover:bg-cusBlue hover:text-white'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        {/* 첫 페이지로 이동 버튼 (1페이지가 아닐 때만 표시) */}
        {startPage > 1 && (
          <>
            <button 
              onClick={() => onPageChange(1)} 
              className="w-8 h-8 rounded-full flex items-center justify-center bg-cusGray-light text-cusBlack-light hover:bg-cusLightBlue hover:text-cusBlue"
            >
              1
            </button>
            {startPage > 2 && (
              <span className="text-cusBlack-light">...</span>
            )}
          </>
        )}
        
        {/* 페이지 번호 버튼 */}
        {pageNumbers.map(number => (
          <button
            key={number}
            onClick={() => onPageChange(number)}
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentPage === number
                ? 'bg-cusBlue text-white font-bold'
                : 'bg-cusGray-light text-cusBlack-light hover:bg-cusLightBlue hover:text-cusBlue'
            }`}
          >
            {number}
          </button>
        ))}
        
        {/* 마지막 페이지로 이동 버튼 (마지막 페이지가 아닐 때만 표시) */}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <span className="text-cusBlack-light">...</span>
            )}
            <button 
              onClick={() => onPageChange(totalPages)} 
              className="w-8 h-8 rounded-full flex items-center justify-center bg-cusGray-light text-cusBlack-light hover:bg-cusLightBlue hover:text-cusBlue"
            >
              {totalPages}
            </button>
          </>
        )}
        
        {/* 다음 페이지 버튼 */}
        <button 
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            currentPage === totalPages 
              ? 'bg-cusGray text-cusBlack-light cursor-not-allowed' 
              : 'bg-cusLightBlue text-cusBlue hover:bg-cusBlue hover:text-white'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    );
  };
  
  // 페이지네이션에 맞게 아이템 필터링
  const getPaginatedItems = (items: any[], page: number, perPage: number) => {
    const startIndex = (page - 1) * perPage;
    return items.slice(startIndex, startIndex + perPage);
  };
  
  // 찜 목록 데이터 가져오기
  const fetchWishlistProducts = async () => {
    try {
      setLoadingWishlist(true);
      // 로컬 스토리지에서 좋아요한 상품 ID 가져오기
      const favoriteProducts = JSON.parse(localStorage.getItem('favoriteProducts') || '{}') as Record<string, boolean>;
      
      // true로 표시된 상품 ID만 필터링
      const favoriteProductIds = Object.entries(favoriteProducts)
        .filter(([_, isFavorite]) => isFavorite)
        .map(([id, _]) => id);
      
      if (favoriteProductIds.length === 0) {
        setWishlistProducts([]);
        return;
      }
      
      // 상품 정보를 가져오기 위한 API 호출
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/products/list`);
      
      if (response.data && Array.isArray(response.data)) {
        // 찜한 상품만 필터링
        const wishlist = response.data
          .filter((product: any) => favoriteProductIds.includes(String(product.id)))
          // 최신순 정렬 (createdAt 기준 내림차순)
          .sort((a: { createdAt?: string }, b: { createdAt?: string }) => {
            const dateA = new Date(a.createdAt || 0).getTime();
            const dateB = new Date(b.createdAt || 0).getTime();
            return dateB - dateA;
          });
          
        setWishlistProducts(wishlist);
      }
    } catch (error) {
      console.error('찜 목록을 불러오는 중 오류가 발생했습니다:', error);
    } finally {
      setLoadingWishlist(false);
    }
  };
  
  // 내가 구매한 상품 데이터 가져오기
  const fetchPurchasedProducts = async () => {
    try {
      setLoadingPurchasedProducts(true);
      const token = localStorage.getItem('auth_token');
      if (!token) {
        console.error('로그인이 필요합니다.');
        return;
      }
      
      console.log('구매한 상품 API 호출 시작');
      
      // API 호출 - Swagger 성공 예시와 동일하게 URL 끝에 슬래시(/) 추가
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/mypage/myPurchasedproducts/`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json;charset=UTF-8'
          }
        }
      );
      
      console.log('내가 구매한 상품 응답:', response.data);
      
      if (response.data && response.data.code === 'SUCCESS' && Array.isArray(response.data.data)) {
        // API 응답 데이터를 PurchasedProduct 타입으로 변환
        const products = response.data.data.map((item: any) => ({
          id: item.id,
          productName: item.productName,
          category: item.category,
          price: item.price,
          image: item.image,
          star: item.star || 0,
          createdAt: item.createdAt,
          description: item.description
        }));
        
        // 최신순 정렬 (생성일 기준 내림차순)
        const sortedProducts = products.sort((a: PurchasedProduct, b: PurchasedProduct) => {
          const dateA = new Date(a.createdAt || 0).getTime();
          const dateB = new Date(b.createdAt || 0).getTime();
          return dateB - dateA; // 내림차순
        });
        
        console.log('변환된 구매 상품 데이터:', sortedProducts);
        setPurchasedProducts(sortedProducts);
      } else {
        console.log('구매한 상품 데이터 없음 또는 응답 형식 불일치');
        setPurchasedProducts([]);
      }
    } catch (error) {
      console.error('내가 구매한 상품을 가져오는 중 오류 발생:', error);
      
      // Axios 오류 상세 정보 로깅
      if (axios.isAxiosError(error)) {
        console.error('API 오류 상태:', error.response?.status);
        console.error('API 오류 데이터:', error.response?.data);
      }
      
      setPurchasedProducts([]);
    } finally {
      setLoadingPurchasedProducts(false);
    }
  };
  
  // 탭이 wishlist로 변경될 때마다 데이터 가져오기
  useEffect(() => {
    if (activeTab === "wishlist") {
      fetchWishlistProducts();
    }
  }, [activeTab]);
  
  // 내가 만든 펀딩 데이터 가져오기
  const fetchMyFundings = async () => {
    try {
      setLoadingMyFundings(true);
      const token = localStorage.getItem('auth_token');
      if (!token) {
        console.error('로그인이 필요합니다.');
        return;
      }
      
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/mypage/myfundings`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      console.log('내가 만든 펀딩 응답:', response.data);
      
      if (response.data && response.data.code === 'SUCCESS' && Array.isArray(response.data.data)) {
        // API 응답 데이터를 Funding 타입으로 변환
        const fundings = response.data.data.map((item: FundingResponse) => {
          // 달성률 계산 (펀딩된 금액 / 상품 가격 * 100), 최대 100%로 제한
          const progress = item.product.price > 0 
            ? Math.min(Math.round((item.fundedAmount / item.product.price) * 100), 100)
            : 0;
            
          return {
            id: item.fundingId,
            title: item.title,
            progress: progress,
            tag: `${progress}% 달성`,
            imageUrl: item.image && item.image.length > 0 
              ? item.image[0] 
              : item.product.image || 'https://via.placeholder.com/300x200?text=펀딩이미지',
            createdAt: item.createdAt, // 생성일 추가
            updatedAt: item.updatedAt // 업데이트일 추가
          };
        });
        
        // 최신순으로 정렬 (생성일 기준 내림차순)
        const sortedFundings = fundings.sort((a: Funding, b: Funding) => {
          // 1. createdAt 날짜를 기준으로 정렬 (최신이 앞으로)
          const aCreated = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const bCreated = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          
          if (aCreated !== bCreated) {
            return bCreated - aCreated; // 내림차순 (최신이 앞으로)
          }
          
          // 2. updatedAt이 있다면 이를 기준으로 정렬
          const aUpdated = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
          const bUpdated = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
          
          return bUpdated - aUpdated; // 내림차순 (최신이 앞으로)
        });
        
        console.log('정렬된 생성 펀딩 데이터:', sortedFundings);
        setMyFundings(sortedFundings);
      } else {
        setMyFundings([]);
      }
    } catch (error) {
      console.error('내가 만든 펀딩을 가져오는 중 오류 발생:', error);
      setMyFundings([]);
    } finally {
      setLoadingMyFundings(false);
    }
  };
  
  // 내가 참여한 펀딩 데이터 가져오기
  const fetchParticipatedFundings = async () => {
    try {
      setLoadingParticipatedFundings(true);
      const token = localStorage.getItem('auth_token');
      if (!token) {
        console.error('로그인이 필요합니다.');
        return;
      }
      
      console.log('참여한 펀딩 API 호출 시작');
      
      // API 호출 - Swagger 성공 예시와 완전히 동일하게 URL 끝에 슬래시(/) 추가
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/mypage/myParticipantfundings/`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json;charset=UTF-8'
          }
        }
      );
      
      console.log('내가 참여한 펀딩 응답:', response.data);
      
      if (response.data && response.data.code === 'SUCCESS' && Array.isArray(response.data.data)) {
        // API 응답 데이터를 Funding 타입으로 변환
        const fundings = response.data.data
          // hidden이 true이면 제외
          .filter((item: FundingResponse & { hidden?: boolean }) => item.hidden !== true)
          .map((item: FundingResponse) => {
            console.log('펀딩 항목 처리:', item.fundingId, item.title);
            
            // 달성률 계산 (펀딩된 금액 / 상품 가격 * 100), 최대 100%로 제한
            const progress = item.product && item.product.price > 0 
              ? Math.min(Math.round((item.fundedAmount / item.product.price) * 100), 100)
              : 0;
            
            // 이미지 처리 로직 개선
            let imageUrl = 'https://via.placeholder.com/300x200?text=펀딩이미지';
            
            if (Array.isArray(item.image) && item.image.length > 0) {
              imageUrl = item.image[0];
            } else if (typeof item.image === 'string') {
              imageUrl = item.image;
            } else if (item.product && item.product.image) {
              imageUrl = item.product.image;
            }
            
            return {
              id: item.fundingId,
              title: item.title,
              progress: progress,
              tag: `${progress}% 달성`,
              imageUrl: imageUrl,
              createdAt: item.createdAt, // 생성일 추가
              updatedAt: item.updatedAt // 업데이트일 추가
            };
          });
        
        // 최신순으로 정렬 (생성일 기준 내림차순)
        const sortedFundings = fundings.sort((a: Funding, b: Funding) => {
          // 1. createdAt 날짜를 기준으로 정렬 (최신이 앞으로)
          const aCreated = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const bCreated = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          
          if (aCreated !== bCreated) {
            return bCreated - aCreated; // 내림차순 (최신이 앞으로)
          }
          
          // 2. updatedAt이 있다면 이를 기준으로 정렬
          const aUpdated = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
          const bUpdated = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
          
          return bUpdated - aUpdated; // 내림차순 (최신이 앞으로)
        });
        
        console.log('정렬된 참여 펀딩 데이터:', sortedFundings);
        setParticipatedFundings(sortedFundings);
      } else {
        console.log('참여한 펀딩 데이터 없음 또는 응답 형식 불일치');
        setParticipatedFundings([]);
      }
    } catch (error) {
      console.error('내가 참여한 펀딩을 가져오는 중 오류 발생:', error);
      
      // Axios 오류 상세 정보 로깅
      if (axios.isAxiosError(error)) {
        console.error('API 오류 상태:', error.response?.status);
        console.error('API 오류 데이터:', error.response?.data);
      }
      
      setParticipatedFundings([]);
    } finally {
      setLoadingParticipatedFundings(false);
    }
  };
  
  // 탭이 변경될 때 데이터 가져오기
  useEffect(() => {
    if (activeTab === "created") {
      fetchMyFundings();
    } else if (activeTab === "participated") {
      fetchParticipatedFundings();
    } else if (activeTab === "wishlist") {
      fetchWishlistProducts();
    } else if (activeTab === "purchased") {
      fetchPurchasedProducts();
    }
  }, [activeTab]);
  
  // 탭 내용을 렌더링하는 함수
  const renderTabContent = () => {
    switch (activeTab) {
      case "created":
        return (
          <div className="relative">
            <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 z-10">
              <button 
                onClick={() => handleScrollLeft(createdFundingsRef)}
                className="p-2 bg-cusBlack text-white rounded-full shadow-md hover:bg-cusBlack-light transition-all duration-300"
                aria-label="이전 항목"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>
            
            {loadingMyFundings ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cusBlue"></div>
              </div>
            ) : myFundings.length > 0 ? (
            <div 
              ref={createdFundingsRef}
              className="flex overflow-x-auto scrollbar-hide gap-4 py-4 pl-2 pr-6"
              style={{ ...scrollbarStyle }}
            >
                {myFundings.map((funding) => (
                <Link 
                  key={funding.id} 
                  to={`/funding/${funding.id}`} 
                  className="flex-shrink-0 transform transition-transform duration-300 hover:scale-105"
                  style={{ width: '300px' }}
                >
                  <FundingCard funding={funding} />
                </Link>
              ))}
            </div>
            ) : (
              <div className="py-12 text-center bg-cusGray-light rounded-xl">
                <p className="text-cusBlack-light font-medium mb-4">아직 만든 펀딩이 없습니다.</p>
                <Link 
                  to="/funding/create"
                  className="px-6 py-2 bg-cusRed text-white rounded-full hover:bg-cusRed-dark transition-colors"
                >
                  펀딩 만들기
                </Link>
              </div>
            )}
            
            {myFundings.length > 0 && (
            <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 z-10">
              <button 
                onClick={() => handleScrollRight(createdFundingsRef)}
                className="p-2 bg-cusBlack text-white rounded-full shadow-md hover:bg-cusBlack-light transition-all duration-300"
                aria-label="다음 항목"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            )}
          </div>
        );
        
      case "participated":
        return (
          <div className="relative">
            <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 z-10">
              <button 
                onClick={() => handleScrollLeft(participatedFundingsRef)}
                className="p-2 bg-cusBlack text-white rounded-full shadow-md hover:bg-cusBlack-light transition-all duration-300"
                aria-label="이전 항목"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>
            
            {loadingParticipatedFundings ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cusBlue"></div>
              </div>
            ) : participatedFundings.length > 0 ? (
            <div 
              ref={participatedFundingsRef}
              className="flex overflow-x-auto scrollbar-hide gap-4 py-4 pl-2 pr-6"
              style={{ ...scrollbarStyle }}
            >
                {participatedFundings.map((funding) => (
                <Link 
                  key={funding.id} 
                  to={`/funding/${funding.id}`} 
                  className="flex-shrink-0 transform transition-transform duration-300 hover:scale-105"
                  style={{ width: '300px' }}
                >
                  <FundingCard funding={funding} />
                </Link>
              ))}
            </div>
            ) : (
              <div className="py-12 text-center bg-cusGray-light rounded-xl">
                <p className="text-cusBlack-light font-medium mb-4">아직 참여한 펀딩이 없습니다.</p>
                <Link 
                  to="/funding/list"
                  className="px-6 py-2 bg-cusLightBlue text-white rounded-full hover:bg-cusBlue transition-colors"
                >
                  펀딩 둘러보기
                </Link>
              </div>
            )}
            
            {participatedFundings.length > 0 && (
            <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 z-10">
              <button 
                onClick={() => handleScrollRight(participatedFundingsRef)}
                className="p-2 bg-cusBlack text-white rounded-full shadow-md hover:bg-cusBlack-light transition-all duration-300"
                aria-label="다음 항목"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            )}
          </div>
        );
        
      case "purchased":
        // 구매한 상품 탭 렌더링
        return (
          <div className="relative">
            <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 z-10">
              <button 
                onClick={() => handleScrollLeft(purchasedProductsRef)}
                className="p-2 bg-cusBlack text-white rounded-full shadow-md hover:bg-cusBlack-light transition-all duration-300"
                aria-label="이전 항목"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>
            
            {loadingPurchasedProducts ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cusBlue"></div>
              </div>
            ) : purchasedProducts.length > 0 ? (
              <div 
                ref={purchasedProductsRef}
                className="flex overflow-x-auto scrollbar-hide gap-4 py-4 pl-2 pr-6"
                style={{ ...scrollbarStyle }}
              >
                {purchasedProducts.map((product) => (
                  <Link 
                    key={product.id} 
                    to={`/shopping/product/${product.id}`} 
                    className="flex-shrink-0 transform transition-transform duration-300 hover:scale-105"
                    style={{ width: '280px' }}
                  >
                    <div className="bg-white border border-cusGray rounded-xl overflow-hidden hover:shadow-lg transition-all transform hover:-translate-y-1 h-full">
                      <div className="relative h-48">
                        <img
                          src={product.image || 'https://via.placeholder.com/300x200?text=상품이미지'}
                          alt={product.productName}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="bg-cusBlue text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-sm">
                            {product.category}
                          </span>
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="font-bold text-lg text-cusBlack line-clamp-1">{product.productName}</h3>
                        <p className="text-cusBlack-light text-sm mt-1 mb-2 line-clamp-2">{product.description}</p>
                        <div className="flex justify-between items-center mt-3">
                          <span className="font-bold text-lg text-cusBlack">{product.price.toLocaleString()}원</span>
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="ml-1 text-sm text-cusBlack-light">{product.star.toFixed(1)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center bg-cusGray-light rounded-xl">
                <p className="text-cusBlack-light font-medium mb-4">아직 구매한 상품이 없습니다.</p>
                <Link 
                  to="/shopping"
                  className="px-6 py-2 bg-cusBlue text-white rounded-full hover:bg-cusBlue-dark transition-colors"
                >
                  쇼핑몰 둘러보기
                </Link>
              </div>
            )}
            
            {purchasedProducts.length > 0 && (
              <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 z-10">
                <button 
                  onClick={() => handleScrollRight(purchasedProductsRef)}
                  className="p-2 bg-cusBlack text-white rounded-full shadow-md hover:bg-cusBlack-light transition-all duration-300"
                  aria-label="다음 항목"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        );
        
      case "wishlist":
        const paginatedWishlist = getPaginatedItems(wishlistProducts, currentPage, itemsPerPage);
        
        return loadingWishlist ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cusBlue"></div>
          </div>
        ) : wishlistProducts.length > 0 ? (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {paginatedWishlist.map((product) => (
                <Link 
                  key={product.id} 
                  to={`/shopping/product/${product.id}`}
                  className="block border border-cusGray bg-white rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="h-48 bg-cusGray-light relative">
                    <img 
                      src={product.image || 'https://via.placeholder.com/300x200?text=상품이미지'}
                      alt={product.productName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-cusRed text-white text-xs px-2 py-1 rounded-full">
                      {product.category}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-cusBlack mb-2">{product.productName}</h3>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold">{product.price?.toLocaleString()}원</span>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="ml-1 text-sm text-cusBlack-light">{product.star?.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            {/* 페이지네이션 컴포넌트 */}
            <Pagination 
              totalItems={wishlistProducts.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <div className="text-5xl mb-4">❤️</div>
            <h3 className="text-xl font-bold text-cusBlack mb-2">찜한 상품이 없습니다</h3>
            <p className="text-cusBlack-light mb-6">마음에 드는 상품을 발견하면 하트를 눌러 찜해보세요!</p>
            <Link 
              to="/shopping"
              className="px-6 py-3 bg-cusBlue text-white rounded-lg inline-block hover:bg-blue-600 transition-colors"
            >
              쇼핑몰 둘러보기
            </Link>
          </div>
        );
      default:
        return null;
    }
  };

  // 탭이 변경될 때 페이지 초기화
  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<TransactionType>('deposit');
  
  // 계좌 관련 상태 추가
  const [hasAccount, setHasAccount] = useState<boolean>(false);
  const [accountNumber, setAccountNumber] = useState<string>('');
  const [isAccountModalOpen, setIsAccountModalOpen] = useState<boolean>(false);
  
  const [userData, setUserData] = useState<UserData | null>(null);

  // 연동 계좌 잔액 상태 추가
  const [bankBalance, setBankBalance] = useState<number>(0);
  
  // 잔액 새로고침 함수
  const refreshBalances = async () => {
    console.log('잔액 정보 새로고침 시작');
    const token = localStorage.getItem('auth_token');
    if (!token) {
      alert('로그인 정보가 없습니다.');
      return;
    }
    
    // 로딩 표시 추가
    const loadingToast = document.createElement('div');
    loadingToast.className = 'fixed bottom-4 right-4 bg-cusBlack text-white px-4 py-2 rounded-md shadow-lg z-50';
    loadingToast.textContent = '잔액 정보를 불러오는 중...';
    document.body.appendChild(loadingToast);
    
    try {
      // 1. /users/info API에서 기뷰페이 잔액 조회 (가장 우선)
      console.log('기뷰페이 잔액 조회 시작 - /users/info API');
      try {
        const userInfoResponse = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/users/info`,
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
          
          if (userData) {
            const updatedUserData = {
              ...userData,
              balance: givupayBalance
            };
            setUserData(updatedUserData);
            localStorage.setItem('user', JSON.stringify(updatedUserData));
            console.log('기뷰페이 잔액 업데이트 완료:', givupayBalance);
          }
        } else {
          console.log('/users/info API에 balance 필드가 없음, 대체 API 호출 시도');
          await fetchBalanceFromAlternativeAPIs(token);
        }
      } catch (error) {
        console.error('/users/info API 호출 오류:', error);
        await fetchBalanceFromAlternativeAPIs(token);
      }
      
      // 2. 연동 계좌 잔액 조회
      console.log('연동 계좌 잔액 조회 시작 - /mypage/checkAccount API');
      try {
        const accountResponse = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/mypage/checkAccount`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        console.log('연동 계좌 조회 응답:', accountResponse.data);
        
        if (accountResponse.data && accountResponse.data.code === 'SUCCESS') {
          // 계좌가 존재하는 경우
          setHasAccount(true);
          
          if (accountResponse.data.data) {
            // 연동 계좌 번호 설정
            if (accountResponse.data.data.accountNo) {
              setAccountNumber(accountResponse.data.data.accountNo);
              localStorage.setItem('account_number', accountResponse.data.data.accountNo);
            }
            
            if (accountResponse.data.data.balance !== undefined) {
              const bankBalanceValue = Number(accountResponse.data.data.balance);
              console.log('연동 계좌 잔액 새로고침:', bankBalanceValue);
              
              setBankBalance(bankBalanceValue);
              localStorage.setItem('bank_balance', bankBalanceValue.toString());
            }
          }
        } else {
          console.log('연동 계좌 정보가 없거나 조회 실패');
        }
      } catch (error) {
        console.error('연동 계좌 정보 조회 오류:', error);
        
        // 3. 대체 API로 계좌 잔액 조회 시도
        try {
          console.log('대체 API로 계좌 정보 조회 시도');
          const altAccountResponse = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/mypage/checkAccount`,
            {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
          );
          
          console.log('대체 API 계좌 정보 응답:', altAccountResponse.data);
          
          if (altAccountResponse.data && altAccountResponse.data.code === 'SUCCESS' && 
              altAccountResponse.data.data && altAccountResponse.data.data.balance !== undefined) {
            const bankBalanceValue = Number(altAccountResponse.data.data.balance);
            console.log('대체 API 연동 계좌 잔액:', bankBalanceValue);
            
            setBankBalance(bankBalanceValue);
            localStorage.setItem('bank_balance', bankBalanceValue.toString());
          }
        } catch (altError) {
          console.error('대체 API 계좌 정보 조회 오류:', altError);
        }
      }
      
      console.log('잔액 새로고침 완료');
      
      // 로딩 토스트 제거
      document.body.removeChild(loadingToast);
      
      // 완료 토스트 표시
      const successToast = document.createElement('div');
      successToast.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-md shadow-lg z-50';
      successToast.textContent = '잔액 정보가 업데이트되었습니다';
      document.body.appendChild(successToast);
      
      // 2초 후 완료 토스트 제거
      setTimeout(() => {
        document.body.removeChild(successToast);
      }, 2000);
      
    } catch (error) {
      console.error('잔액 새로고침 전체 오류:', error);
      
      // 로딩 토스트 제거
      if (document.body.contains(loadingToast)) {
        document.body.removeChild(loadingToast);
      }
      
      // 에러 토스트 표시
      const errorToast = document.createElement('div');
      errorToast.className = 'fixed bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded-md shadow-lg z-50';
      errorToast.textContent = '잔액 정보 업데이트 중 오류가 발생했습니다';
      document.body.appendChild(errorToast);
      
      // 2초 후 에러 토스트 제거
      setTimeout(() => {
        document.body.removeChild(errorToast);
      }, 2000);
    }
  };
  
  // 대체 API로 잔액 조회 함수
  const fetchBalanceFromAlternativeAPIs = async (token: string) => {
    // 1. 첫 번째 대체 API - getUserBalance
    try {
      const givupayResponse = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/mypage/getUserBalance`,
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
        
        if (userData) {
          const updatedUserData = {
            ...userData,
            balance: balance
          };
          setUserData(updatedUserData);
          localStorage.setItem('user', JSON.stringify(updatedUserData));
          return true; // 이 API로 성공했으면 다음 API는 호출 안함
        }
      } else {
        console.log('getUserBalance API에 balance 필드가 없음, 다음 API 시도');
      }
    } catch (error) {
      console.error('기뷰페이 잔액 조회 API (getUserBalance) 오류:', error);
    }
    
    // 2. 두 번째 대체 API - mypage/balance
    try {
      const balanceResponse = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/mypage/balance`,
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
        
        if (givupayBalance !== null && userData) {
          console.log('기뷰페이 잔액 업데이트 (mypage/balance):', givupayBalance);
          const updatedUserData = {
            ...userData,
            balance: givupayBalance
          };
          setUserData(updatedUserData);
          localStorage.setItem('user', JSON.stringify(updatedUserData));
          return true;
        }
      }
    } catch (error) {
      console.error('기뷰페이 잔액 조회 API (mypage/balance) 오류:', error);
    }
    
    return false;
  };
  
  // 트랜잭션 후 연동 계좌 잔액 업데이트
  const handleTransactionSuccess = async (responseData: any) => {
    console.log('거래 성공 응답 데이터:', responseData);
    
    try {
      // 로딩 표시 추가
      const loadingToast = document.createElement('div');
      loadingToast.className = 'fixed bottom-4 right-4 bg-cusBlack text-white px-4 py-2 rounded-md shadow-lg z-50';
      loadingToast.textContent = '잔액 정보를 업데이트 중...';
      document.body.appendChild(loadingToast);
      
      // 모든 키 로깅 (디버깅용)
      console.log('응답 데이터 전체 키 목록:');
      for (const key in responseData) {
        console.log(`- ${key}: ${typeof responseData[key]}`);
      }
      
      // 거래 유형 확인 (출금 또는 입금)
      const transactionType = responseData.type || '알 수 없음';
      console.log('거래 유형:', transactionType);
      
      // 가능한 응답 필드들을 모두 확인
      if (responseData.userId) {
        console.log('사용자 ID:', responseData.userId);
      }
      
      if (responseData.givupayBalance !== undefined) {
        console.log('기뷰페이 잔액:', responseData.givupayBalance);
        
        // 기뷰페이 잔액 업데이트
        if (userData) {
          const givupayBalance = Number(responseData.givupayBalance);
          const updatedUserData = {
            ...userData,
            balance: givupayBalance
          };
          setUserData(updatedUserData);
          localStorage.setItem('user', JSON.stringify(updatedUserData));
          console.log('기뷰페이 잔액 업데이트 완료:', givupayBalance);
        }
      }
      
      if (responseData.accountBalance !== undefined) {
        console.log('계좌 잔액:', responseData.accountBalance);
        
        // 계좌 잔액 업데이트
        const accountBalance = Number(responseData.accountBalance);
        setBankBalance(accountBalance);
        localStorage.setItem('bank_balance', accountBalance.toString());
        console.log('연동 계좌 잔액 업데이트 완료:', accountBalance);
      }
      
      // 수동으로 잔액 새로고침 실행
      await refreshBalances();
      
      // 로딩 토스트 제거
      document.body.removeChild(loadingToast);
      
      // 성공 토스트 표시
      const successToast = document.createElement('div');
      successToast.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-md shadow-lg z-50';
      successToast.textContent = `${transactionType === 'DEPOSIT' ? '충전' : '출금'}이 완료되었습니다.`;
      document.body.appendChild(successToast);
      
      // 2초 후 성공 토스트 제거
      setTimeout(() => {
        document.body.removeChild(successToast);
      }, 2000);
    } catch (error) {
      console.error('거래 후 잔액 업데이트 중 오류:', error);
      // 오류가 발생해도 잔액을 새로고침하려고 시도
      try {
        await refreshBalances();
      } catch (refreshError) {
        console.error('잔액 새로고침 중 추가 오류:', refreshError);
      }
    }
  };

  const handleTransactionClick = (type: TransactionType) => {
    if (!hasAccount) {
      setIsAccountModalOpen(true);
      return;
    }
    
    setTransactionType(type);
    setIsTransactionModalOpen(true);
  };
  
  // 컴포넌트 마운트 시 로그인 체크 및 사용자 정보 가져오기
  useEffect(() => {
    const fetchUserAndAccountInfo = async () => {
      // 로컬 스토리지에서 토큰과 사용자 정보 가져오기
    const userString = localStorage.getItem('user');
    const token = localStorage.getItem('auth_token');

      if (!token) {
      alert('로그인이 필요한 서비스입니다.');
      navigate('/login');
      return;
    }

    try {
        // 1. /users/info API에서 사용자 정보 가져오기 (우선)
        try {
          const userInfoResponse = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/users/info`,
            {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
          );
          
          console.log('/users/info API 응답:', userInfoResponse.data);
          
          // API에서 받은 정보로 userData 설정
          if (userInfoResponse.data) {
            const apiUserData = {
              kakaoId: userInfoResponse.data.kakaoId,
              nickname: userInfoResponse.data.nickName, // API 필드명 차이 주의
              email: userInfoResponse.data.email,
              profileImage: userInfoResponse.data.profileImage,
              balance: userInfoResponse.data.balance, // 기뷰페이 잔액
            };
            
            console.log('API에서 가져온 사용자 정보:', apiUserData);
            
            // 상태 업데이트 및 로컬 스토리지 저장
            setUserData(apiUserData);
            localStorage.setItem('user', JSON.stringify(apiUserData));
          }
        } catch (error) {
          console.error('/users/info API 호출 오류:', error);
          
          // API 실패 시 로컬 스토리지의 사용자 정보 사용 (대체 방법)
          if (userString) {
            try {
              const localUserData = JSON.parse(userString);
              setUserData(localUserData);
              console.log('로컬 스토리지에서 사용자 정보 로드:', localUserData);
            } catch (e) {
              console.error('사용자 정보 파싱 오류:', e);
            }
          }
        }
        
        // 2. 연동 계좌 정보 확인
        console.log('연동 계좌 정보 요청 시작');
        try {
          const accountResponse = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/mypage/checkAccount`,
            {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
          );
          
          console.log('연동 계좌 조회 API 응답:', accountResponse.data);
          
          // 계좌가 존재하는 경우
          if (accountResponse.data && accountResponse.data.code === 'SUCCESS') {
            console.log('연동 계좌 정보 존재. 계좌 UI 설정');
        setHasAccount(true);
            
            // API 응답 데이터 구조에 따라 계좌 정보 설정
            if (accountResponse.data.data) {
              // 연동 계좌 번호 설정
              if (accountResponse.data.data.accountNo) {
                setAccountNumber(accountResponse.data.data.accountNo);
                localStorage.setItem('account_number', accountResponse.data.data.accountNo);
              }
              
              // 연동 계좌 잔액 설정 - accountResponse.data.data.balance는 연동계좌 잔액임
              if (accountResponse.data.data.balance !== undefined) {
                setBankBalance(accountResponse.data.data.balance);
                localStorage.setItem('bank_balance', accountResponse.data.data.balance.toString());
              }
            } else {
              // 이미 저장된 계좌번호가 있으면 사용
              const savedAccountNumber = localStorage.getItem('account_number');
              if (savedAccountNumber) {
                setAccountNumber(savedAccountNumber);
              }
              
              // 저장된 연동 계좌 잔액이 있으면 사용
              const savedBankBalance = localStorage.getItem('bank_balance');
              if (savedBankBalance) {
                setBankBalance(Number(savedBankBalance));
              }
            }
          } else {
            // 연동 계좌가 없는 경우
            console.log('연동 계좌 정보 없음. 계좌 생성 UI 표시:', accountResponse.data.message);
            setHasAccount(false);
            setAccountNumber('');
            setBankBalance(0);
            localStorage.removeItem('account_number');
            localStorage.removeItem('bank_balance');
      }
    } catch (error) {
          console.error('연동 계좌 정보 조회 오류:', error);
          
          // 저장된 계좌 정보로 UI 표시 여부 결정
          const savedAccountNumber = localStorage.getItem('account_number');
          if (savedAccountNumber) {
            setHasAccount(true);
            setAccountNumber(savedAccountNumber);
            
            // 저장된 연동 계좌 잔액이 있으면 표시
            const savedBankBalance = localStorage.getItem('bank_balance');
            if (savedBankBalance) {
              setBankBalance(Number(savedBankBalance));
            }
          } else {
            setHasAccount(false);
          }
        }
        
        // 페이지 로드 시 잔액 자동 새로고침
        setTimeout(() => {
          refreshBalances();
        }, 500); // 기본 데이터 로드 후 0.5초 후에 잔액 새로고침
        
      } catch (error) {
        console.error('데이터 로드 오류:', error);
        
        // 로컬에 저장된 사용자 정보가 있으면 사용
        if (userString) {
          try {
            const parsedUser = JSON.parse(userString);
            setUserData(parsedUser);
          } catch (e) {
            console.error('사용자 정보 파싱 오류:', e);
      navigate('/login');
    }
        } else {
          navigate('/login');
        }
      }
    };

    fetchUserAndAccountInfo();
  }, [navigate]);

  // 계좌 생성 제출 핸들러
  const handleAccountCreation = async (password: string) => {
    try {
      console.log('계좌 생성 시작 - 비밀번호 길이:', password.length);
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        alert('로그인이 필요합니다.');
        return;
      }
      
      // 로딩 표시 추가
      const loadingToast = document.createElement('div');
      loadingToast.className = 'fixed bottom-4 right-4 bg-cusBlack text-white px-4 py-2 rounded-md shadow-lg z-50';
      loadingToast.textContent = '계좌를 생성 중입니다...';
      document.body.appendChild(loadingToast);
      
      // 비밀번호 로컬 스토리지에 저장 (암호화)
      localStorage.setItem('account_password', btoa(password));
      
      // 1. 2차 비밀번호 설정 API 호출 (새로 추가)
      try {
        console.log('2차 비밀번호 설정 API 호출');
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/users/setPassword`,
          { password: password }, // PaymentPasswordRequestDTO 형식으로 전송
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        console.log('2차 비밀번호 설정 완료');
      } catch (passwordError) {
        console.error('2차 비밀번호 설정 오류:', passwordError);
        // 비밀번호 설정 실패해도 계좌 생성은 시도
      }
      
      // 2. 계좌 생성 API 호출
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/mypage/createAccount`,
        { password: password }, // 비밀번호 명확하게 전송
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('계좌 생성 응답:', response.data);
      
      // 로딩 토스트 제거
      document.body.removeChild(loadingToast);
      
      if (response.data && (response.data.code === 'SUCCESS' || response.data.success === true)) {
        // 계좌 번호 저장 (API 응답에서 제공하는 경우)
        if (response.data.data && response.data.data.accountNo) {
          const accountNo = response.data.data.accountNo;
          setAccountNumber(accountNo);
          localStorage.setItem('account_number', accountNo);
        }
        
        // 성공 토스트 표시
        const successToast = document.createElement('div');
        successToast.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-md shadow-lg z-50';
        successToast.textContent = '계좌가 성공적으로 생성되었습니다!';
        document.body.appendChild(successToast);
        
        // 2초 후 성공 토스트 제거
        setTimeout(() => {
          document.body.removeChild(successToast);
        }, 2000);
        
        // 계좌 정보 업데이트
        setHasAccount(true);
        setIsAccountModalOpen(false);
        
        // 계좌 정보 새로고침
        await refreshBalances();
      } else {
        throw new Error(response.data?.message || '계좌 생성에 실패했습니다.');
      }
    } catch (error: any) {
      console.error('계좌 생성 오류:', error);
      
      // API 응답 상세 로깅 추가
      if (error.response) {
        console.error('응답 상태:', error.response.status);
        console.error('응답 데이터:', error.response.data);
      }
      
      // 에러 토스트 표시
      const errorToast = document.createElement('div');
      errorToast.className = 'fixed bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded-md shadow-lg z-50';
      errorToast.textContent = error.response?.data?.message || error.message || '계좌 생성 중 오류가 발생했습니다';
      document.body.appendChild(errorToast);
      
      // 2초 후 에러 토스트 제거
      setTimeout(() => {
        document.body.removeChild(errorToast);
      }, 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-5 py-8 font-pretendard">
      {userData && (
        <>
          {/* 상단 프로필 영역 */}
          <div className="flex flex-col md:flex-row items-start">
            <div className="md:mr-8 mb-6 md:mb-0">
              <div className="w-36 h-36 md:w-40 md:h-40 rounded-full overflow-hidden mb-4 border-4 border-cusPink shadow-lg">
                <img
                  src={userData.profileImage}
                  alt={userData.nickname}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center">
                <h2 className="text-xl font-bold text-cusBlack">{userData.nickname}</h2>
              </div>
            </div>
            
            <div className="flex-1 w-full">
              <div className="bg-cusLightBlue-lighter rounded-2xl p-6 mb-6 shadow-md relative">
                {/* 새로고침 버튼 - 네모 컴포넌트 오른쪽 상단에 배치 */}
                <button
                  onClick={refreshBalances}
                  className="absolute top-3 right-3 px-3 py-1.5 text-sm bg-white border border-gray-300 text-gray-700 rounded-full hover:bg-gray-100 transition-colors shadow-sm flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  새로고침
                </button>
                
                {hasAccount ? (
                  <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-4 py-2">
                    {/* 내 기뷰페이 */}
                    <div className="flex-1 min-w-[200px] text-center md:text-left bg-blue-50 p-3 rounded-lg shadow-sm">
                      <div className="flex items-center justify-center md:justify-start mb-2">
                        <span className="text-yellow-500 text-2xl mr-2">👑</span>
                        <h3 className="font-bold text-cusBlue">내 기뷰페이</h3>
                      </div>
                      <p className="text-2xl font-bold text-cusBlack">{userData?.balance?.toLocaleString()}<span className="text-lg ml-1">원</span></p>
                      <div className="flex justify-center md:justify-start gap-2 mt-2">
                        <button
                          onClick={() => handleTransactionClick('deposit')}
                          className="px-3 py-1 text-xs bg-cusBlue text-white rounded-full hover:bg-cusBlue-dark transition-colors shadow-sm"
                        >
                          충전
                        </button>
                        <button
                          onClick={() => handleTransactionClick('withdrawal')}
                          className="px-3 py-1 text-xs bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition-colors shadow-sm"
                        >
                          출금
                        </button>
                      </div>
                    </div>
                    
                    {/* 내 연동 계좌 - 회색 배경 제거 및 붙이기 */}
                    <div className="flex-1 min-w-[200px] text-center md:text-left pl-3 border-l border-gray-200">
                      <h3 className="font-bold text-cusBlack-light mb-1">내 연동계좌 (한국은행)</h3>
                      <p className="text-lg font-bold text-cusBlack">{accountNumber}</p>
                      <p className="text-sm font-bold text-green-600 mt-1">잔액: {bankBalance.toLocaleString()} 원</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-cusBlue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold mb-2">기뷰페이 계좌가 없습니다</h3>
                    <p className="text-gray-500 mb-3 text-center">후원과 상품 구매를 편리하게 이용하려면<br />기뷰페이 계좌를 만들어보세요!</p>
                    <button 
                      onClick={() => setIsAccountModalOpen(true)}
                      className="bg-cusBlue hover:bg-cusBlue-dark text-white px-5 py-2 rounded-full transition-colors"
                    >
                      계좌 만들기
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* 탭 내비게이션 */}
          <div className="bg-white rounded-xl shadow-sm p-3 mb-6">
            <div className="overflow-x-auto no-scrollbar">
              <div className="flex flex-nowrap min-w-full space-x-2 px-2">
                <button
                  className={`px-5 py-3 text-base font-bold rounded-full transition-all ${
                    activeTab === "created" 
                      ? "bg-cusBlack text-cusRed shadow-lg" 
                      : "bg-cusGray-light text-cusBlack-light hover:bg-cusGray"
                  }`}
                  onClick={() => setActiveTab("created")}
                >
                  내가 만든 펀딩
                </button>
                <button
                  className={`px-5 py-3 text-base font-bold rounded-full transition-all ${
                    activeTab === "participated" 
                      ? "bg-cusBlack text-cusLightBlue shadow-lg" 
                      : "bg-cusGray-light text-cusBlack-light hover:bg-cusGray"
                  }`}
                  onClick={() => setActiveTab("participated")}
                >
                  참여한 펀딩
                </button>
                <button
                  className={`px-5 py-3 text-base font-bold rounded-full transition-all ${
                    activeTab === "purchased" 
                      ? "bg-cusBlack text-cusBlue shadow-lg" 
                      : "bg-cusGray-light text-cusBlack-light hover:bg-cusGray"
                  }`}
                  onClick={() => setActiveTab("purchased")}
                >
                  구매한 상품
                </button>
                <button
                  className={`px-5 py-3 text-base font-bold rounded-full transition-all ${
                    activeTab === "wishlist" 
                      ? "bg-cusBlack text-pink-500 shadow-lg" 
                      : "bg-cusGray-light text-cusBlack-light hover:bg-cusGray"
                  }`}
                  onClick={() => setActiveTab("wishlist")}
                >
                  찜 목록
                </button>
              </div>
            </div>
          </div>
          
          {/* 탭 콘텐츠 - 중복 제목 제거 */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            {/* 탭 컨텐츠 */}
            {renderTabContent()}
          </div>
          
          {/* 모달 추가 */}
          <TransactionModal
            isOpen={isTransactionModalOpen}
            onClose={() => setIsTransactionModalOpen(false)}
            type={transactionType}
            updateUserData={setUserData}
            onTransactionSuccess={handleTransactionSuccess}
          />
          
          {/* 계좌 생성 모달 */}
          <AccountCreationModal 
            isOpen={isAccountModalOpen}
            onClose={() => setIsAccountModalOpen(false)}
            onSubmit={handleAccountCreation}
          />
        </>
      )}
    </div>
  );
};

// 펀딩 카드 컴포넌트 - Link는 상위 컴포넌트에서 제공하도록 수정
const FundingCard: React.FC<FundingProps> = ({ funding }) => {
  // 진행률에 따른 색상 설정
  const getProgressColor = (progress: number) => {
    if (progress < 30) return "bg-cusRed";
    if (progress < 70) return "bg-cusYellow";
    return "bg-success";
  };
  
  return (
    <div className="bg-white border border-cusGray rounded-xl overflow-hidden hover:shadow-lg transition-all transform hover:-translate-y-1">
      <div className="relative h-52">
        <img
          src={funding.imageUrl}
          alt={funding.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 left-3">
          <span className={`${getProgressColor(funding.progress)} text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-sm`}>
            {funding.tag}
          </span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-bold text-lg text-cusBlack">{funding.title}</h3>
        <div className="mt-3 mb-2">
          <div className="flex justify-between text-sm text-cusBlack-light mb-1.5">
            <span className="font-medium">{funding.progress}% 달성</span>
          </div>
          <div className="w-full bg-cusGray rounded-full h-2.5">
            <div
              className={`${getProgressColor(funding.progress)} h-2.5 rounded-full transition-all duration-500`}
              style={{ width: `${funding.progress}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// API 응답 타입 정의
interface FundingResponse {
  fundingId: number;
  user: {
    userId: number;
    nickName: string;
    image: string;
  };
  product: {
    id: number;
    productName: string;
    price: number;
    image: string;
  };
  title: string;
  description: string;
  category: string | null;
  categoryName: string | null;
  scope: string;
  participantsNumber: number;
  fundedAmount: number;
  status: string;
  image: string[];
  createdAt: string;
  updatedAt: string;
}

export default MyPage;