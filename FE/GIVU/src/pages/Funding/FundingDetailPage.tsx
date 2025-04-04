import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

// 펀딩 데이터 타입 정의
interface FundingDetail {
  fundingId: number;
  title: string;
  description: string;
  category: string;
  categoryName: string | null;
  scope: string;
  participantsNumber: number;
  fundedAmount: number;
  status: string;
  image: string | null;
  createdAt: string;
  updatedAt: string | null;
  writer: {
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
  letters: Array<{
    letterId: number;
    funding: number;
    user: {
      userId: number;
      nickName: string;
      image: string;
    };
    comment: string;
    image: string | null;
    access: string;
    createdAt: string;
    updatedAt: string;
  }>;
  reviews: Array<any>;
}

// 잔액 정보 인터페이스 추가
interface BalanceInfo {
  givuPayBalance: number;
  bankBalance: number | null;
  accountNumber: string | null;
}

// 선물 옵션 데이터
const GIFT_OPTIONS = [
  { amount: 0, label: "직접 입력하기", description: "원하는 금액으로 참여" },
  { amount: 5000, label: "5000원 선물하기", description: "커피 한잔 선물" },
  { amount: 10000, label: "10000원 선물하기", description: "디저트 한 개 선물" },
  { amount: 20000, label: "20000원 선물하기", description: "식사 한끼 선물" },
  { amount: 30000, label: "30000원 선물하기", description: "소품 한 개 선물" },
  { amount: 50000, label: "50000원 선물하기", description: "프리미엄 선물" }
];

// 임시 펀딩 데이터 (API 실패 시 사용)
const FALLBACK_DATA: FundingDetail = {
  fundingId: 1,
  title: "펀딩 제목",
  description: "펀딩 설명이 로드되지 않았습니다.",
  category: "카테고리",
  categoryName: null,
  scope: "PUBLIC",
  participantsNumber: 0,
  fundedAmount: 0,
  status: "진행중",
  image: null,
  createdAt: new Date().toISOString(),
  updatedAt: null,
  writer: {
    userId: 1,
    nickName: "작성자",
    image: "https://via.placeholder.com/200x200?text=프로필"
  },
  product: {
    id: 1,
    productName: "상품명",
    price: 10000,
    image: "https://via.placeholder.com/800x500?text=상품이미지"
  },
  letters: [],
  reviews: []
};

const FundingDetailPage = () => {
  const navigate = useNavigate();
  const params = useParams<{ id?: string }>(); // 라우터 설정에 맞게 파라미터 이름을 'id'로 수정
  console.log('URL 파라미터 전체:', params);
  
  // 파라미터에서 id 추출
  const fundingId = params.id;
  console.log('사용할 펀딩 ID:', fundingId);

  // ID가 없는 경우 홈으로 리다이렉트
  useEffect(() => {
    if (!fundingId) {
      console.error('펀딩 ID가 없음, 홈으로 리다이렉트');
      navigate('/');
      return;
    }
  }, [fundingId, navigate]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [fundingData, setFundingData] = useState<FundingDetail | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isCustomInput, setIsCustomInput] = useState(false);
  const [showAllParticipants, setShowAllParticipants] = useState(false);
  
  // 잔액 정보 상태 추가
  const [balanceInfo, setBalanceInfo] = useState<BalanceInfo>({
    givuPayBalance: 0,
    bankBalance: null,
    accountNumber: null
  });
  const [showBalanceInfo, setShowBalanceInfo] = useState<boolean>(false);
  const [balanceLoading, setBalanceLoading] = useState<boolean>(false);

  // 현재 URL 출력
  useEffect(() => {
    console.log('현재 URL:', window.location.href);
    console.log('Path:', window.location.pathname);
  }, []);
  
  // 펀딩 상세 데이터 가져오기
  useEffect(() => {
    // ID가 없으면 API 호출하지 않음
    if (!fundingId) {
      console.error('펀딩 ID가 없음');
      setError('펀딩 ID가 잘못되었습니다.');
      setLoading(false);
      return;
    }

    const fetchFundingDetail = async () => {
      try {
        console.log('펀딩 상세 정보 요청 시작, ID:', fundingId);
        setLoading(true);
        
        // API Base URL 확인 - 다른 파일에서 사용하는 방식으로 수정
        const baseUrl = import.meta.env.VITE_BASE_URL || import.meta.env.VITE_API_BASE_URL || 'https://j12d107.p.ssafy.io/api';
        console.log('API 기본 URL 확인:', {
          VITE_BASE_URL: import.meta.env.VITE_BASE_URL,
          VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
          '사용할 URL': baseUrl
        });
        
        // 토큰 확인 - 다양한 키 이름으로 시도
        const token = localStorage.getItem('auth_token') || 
                     localStorage.getItem('access_token') ||
                     localStorage.getItem('token');
        console.log('토큰 존재 여부:', !!token);
        
        // 전체 API URL 로깅 - 경로 수정: funding -> fundings (복수형)
        const apiUrl = `${baseUrl}/fundings/${fundingId}`;
        console.log('요청 URL:', apiUrl);
        
        // API 요청 - 더 많은 오류 정보 캡처
        try {
          const response = await axios.get(
            apiUrl,
            {
              headers: {
                'Authorization': token ? `Bearer ${token}` : '',
                'Content-Type': 'application/json'
              }
            }
          );
          
          console.log('펀딩 상세 응답 전체:', response);
          console.log('펀딩 상세 응답 데이터:', response.data);
          
          // 응답 구조 확인
          if (response.data) {
            if (response.data.code === 'SUCCESS') {
              console.log('응답 데이터 구조:', response.data.data);
              setFundingData(response.data.data);
            } else {
              console.error('응답 코드 오류:', response.data.code, response.data.message);
              // 임시 데이터로 UI 표시 (실제 환경에서는 제거할 것)
              setFundingData(FALLBACK_DATA);
              setError(response.data?.message || '펀딩 정보를 가져오지 못했습니다.');
            }
          } else {
            console.error('응답 데이터가 없음');
            // 임시 데이터로 UI 표시 (실제 환경에서는 제거할 것)
            setFundingData(FALLBACK_DATA);
            setError('서버 응답이 올바르지 않습니다.');
          }
        } catch (apiError: any) {
          console.error('API 요청 오류 상세정보:', apiError);
          console.error('오류 상태 코드:', apiError.response?.status);
          console.error('오류 응답 데이터:', apiError.response?.data);
          console.error('오류 메시지:', apiError.message);
          
          // axios 오류 세부 정보 기반으로 사용자 친화적인 오류 메시지 설정
          let errorMessage = '펀딩 정보를 가져오는 중 오류가 발생했습니다.';
          if (apiError.response) {
            // 서버가 응답을 반환했으나 2xx 범위가 아닌 경우
            if (apiError.response.status === 404) {
              errorMessage = '펀딩을 찾을 수 없습니다.';
            } else if (apiError.response.status === 401 || apiError.response.status === 403) {
              errorMessage = '접근 권한이 없습니다.';
            } else if (apiError.response.data?.message) {
              errorMessage = apiError.response.data.message;
            }
          } else if (apiError.request) {
            // 요청은 전송되었으나 응답을 받지 못한 경우
            errorMessage = '서버로부터 응답이 없습니다. 네트워크 연결을 확인해주세요.';
          }
          
          setError(errorMessage);
          setFundingData(FALLBACK_DATA); // 임시 데이터로 UI 표시
          throw apiError; // 상위 catch 블록으로 오류 전파
        }
      } catch (err) {
        console.error('펀딩 상세 조회 오류:', err);
        // 이미 내부 catch 블록에서 처리되었으므로 추가 작업은 필요 없음
      } finally {
        setLoading(false);
      }
    };

    fetchFundingDetail();
  }, [fundingId, navigate]); // fundingId가 변경될 때마다 API 다시 호출

  // 컴포넌트가 마운트될 때 스크롤을 맨 위로 이동
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 이미지 슬라이더 제어 함수
  const nextImage = () => {
    if (!fundingData || !fundingData.image) return;
    
    // 실제로 여러 이미지가 있다면 아래와 같이 처리
    // setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    
    // 임시로 단일 이미지만 처리
    setCurrentImageIndex(0);
  };

  const prevImage = () => {
    if (!fundingData || !fundingData.image) return;
    
    // 실제로 여러 이미지가 있다면 아래와 같이 처리
    // setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    
    // 임시로 단일 이미지만 처리
    setCurrentImageIndex(0);
  };

  // 금액 옵션 선택 함수 수정
  const selectAmount = (amount: number) => {
    if (amount === 0) {
      setIsCustomInput(true);
      setSelectedAmount(null);
    } else {
      setIsCustomInput(false);
      setSelectedAmount(amount);
      setCustomAmount('');
    }
  };

  // 직접 입력 금액 처리 함수
  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setCustomAmount(value);
    if (value) {
      setSelectedAmount(parseInt(value));
    } else {
      setSelectedAmount(null);
    }
  };

  // 참여자 목록 토글 함수
  const toggleParticipantsList = () => {
    setShowAllParticipants(!showAllParticipants);
  };

  // 참여자 표시 개수
  const displayedParticipants = fundingData?.letters 
    ? (showAllParticipants 
        ? fundingData.letters 
        : fundingData.letters.slice(0, 3))
    : [];

  // 결제 페이지로 이동하는 함수 추가
  const handleGiftClick = () => {
    if (!selectedAmount && (!isCustomInput || !customAmount) || !fundingData) {
      return;
    }
    const amount = isCustomInput ? parseInt(customAmount) : selectedAmount;
    navigate(`/payment/${fundingData.fundingId}`, { 
      state: { 
        amount,
        title: fundingData.title,
        creatorName: fundingData.writer.nickName
      }
    });
  };

  // 잔액 정보 가져오기 함수
  const fetchBalanceInfo = async () => {
    setBalanceLoading(true);
    const token = localStorage.getItem('auth_token') || 
                  localStorage.getItem('access_token') || 
                  localStorage.getItem('token');
    
    if (!token) {
      console.error('인증 토큰이 없습니다.');
      setBalanceLoading(false);
      return;
    }
    
    const baseUrl = import.meta.env.VITE_BASE_URL || import.meta.env.VITE_API_BASE_URL || 'https://j12d107.p.ssafy.io/api';
    
    try {
      // 1. GIVU Pay 잔액 가져오기
      let givuPayBalance = 0;
      
      try {
        const userInfoResponse = await axios.get(`${baseUrl}/users/info`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (userInfoResponse.data && userInfoResponse.data.balance !== undefined) {
          givuPayBalance = Number(userInfoResponse.data.balance);
        } else {
          // 대체 API 호출
          const balanceResponse = await axios.get(`${baseUrl}/mypage/getUserBalance`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          if (balanceResponse.data?.code === 'SUCCESS' && 
              balanceResponse.data?.data?.balance !== undefined) {
            givuPayBalance = Number(balanceResponse.data.data.balance);
          }
        }
      } catch (error) {
        console.error('GIVU Pay 잔액 조회 오류:', error);
      }
      
      // 2. 연동 계좌 정보 가져오기
      let bankBalance = null;
      let accountNumber = null;
      
      try {
        const accountResponse = await axios.get(`${baseUrl}/mypage/checkAccount`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (accountResponse.data?.code === 'SUCCESS' && accountResponse.data?.data) {
          if (accountResponse.data.data.balance !== undefined) {
            bankBalance = Number(accountResponse.data.data.balance);
          }
          
          if (accountResponse.data.data.accountNo) {
            accountNumber = accountResponse.data.data.accountNo;
          }
        }
      } catch (error) {
        console.error('연동 계좌 정보 조회 오류:', error);
      }
      
      // 잔액 정보 업데이트
      setBalanceInfo({
        givuPayBalance,
        bankBalance,
        accountNumber
      });
      
      // 잔액 정보 표시
      setShowBalanceInfo(true);
    } catch (error) {
      console.error('잔액 정보 조회 중 오류 발생:', error);
    } finally {
      setBalanceLoading(false);
    }
  };

  // 로딩 중 표시
  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6 flex justify-center items-center h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">펀딩 정보를 불러오는 중입니다...</p>
        </div>
      </div>
    );
  }

  // 에러 표시
  if (error && !fundingData) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error || '펀딩 정보를 불러올 수 없습니다.'}</p>
          <button 
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-black text-white rounded-lg"
          >
            이전 페이지로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  // 펀딩 데이터가 없는 경우 (이미 위에서 에러 처리했으므로 여기까지 오지 않겠지만 안전장치)
  if (!fundingData) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p>펀딩 정보를 불러올 수 없습니다.</p>
          <button 
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-black text-white rounded-lg"
          >
            이전 페이지로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  // 펀딩 달성율 계산
  const fundingPercentage = fundingData.product 
    ? Math.min(Math.round((fundingData.fundedAmount / fundingData.product.price) * 100), 100)
    : 0;

  // 목표 금액까지 남은 금액
  const remainingAmount = fundingData.product 
    ? Math.max(fundingData.product.price - fundingData.fundedAmount, 0)
    : 0;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* 잔액 정보 표시 섹션 */}
      <div className="mb-6 bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 flex justify-between items-center bg-gray-50">
          <h2 className="text-lg font-semibold">내 잔액 정보</h2>
          <button 
            onClick={fetchBalanceInfo} 
            className="px-3 py-1.5 bg-black text-white rounded-md text-sm hover:bg-gray-800 transition"
            disabled={balanceLoading}
          >
            {balanceLoading ? '로딩 중...' : '잔액 조회'}
          </button>
        </div>
        
        {showBalanceInfo && (
          <div className="p-4">
            <div className="mb-2">
              <span className="font-semibold">GIVU Pay 잔액:</span> 
              <span className="ml-2 text-primary-color">{balanceInfo.givuPayBalance.toLocaleString()} 원</span>
            </div>
            
            {balanceInfo.bankBalance !== null ? (
              <div>
                <span className="font-semibold">연동 계좌 잔액:</span>
                <span className="ml-2">{balanceInfo.bankBalance.toLocaleString()} 원</span>
                {balanceInfo.accountNumber && (
                  <span className="ml-2 text-xs text-gray-500">
                    ({balanceInfo.accountNumber.replace(/(\d{4})(\d{4})(\d{4})(\d*)/, '$1-$2-$3-$4')})
                  </span>
                )}
              </div>
            ) : (
              <div className="text-sm text-gray-500">
                연동된 계좌가 없습니다. 마이페이지에서 계좌를 연동해 주세요.
              </div>
            )}
          </div>
        )}
      </div>

      {/* 이미지 슬라이더 섹션 */}
      <div className="relative mb-6 bg-gray-100 rounded-lg overflow-hidden">
        <div className="h-[400px] flex items-center justify-center">
          <img
            src={fundingData.product?.image || fundingData.image || "https://via.placeholder.com/800x500?text=이미지없음"}
            alt={`${fundingData.title} 이미지`}
            className="max-h-full object-contain"
          />
        </div>

        {/* 좌우 화살표 버튼 - 이미지가 여러 개인 경우에만 표시 */}
        {/* 현재는 이미지가 하나만 있으므로 주석 처리
        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/50 hover:bg-white/80 rounded-full p-2"
          aria-label="이전 이미지"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/50 hover:bg-white/80 rounded-full p-2"
          aria-label="다음 이미지"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        */}

        {/* 이미지 인디케이터 - 이미지가 여러 개인 경우에만 표시 */}
        {/* 
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
          {currentImageIndex + 1}/{images.length}
        </div>
        */}
      </div>

      {/* 펀딩 요약 정보 수정 */}
      <div className="border border-gray-200 rounded-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-xl font-bold">{fundingData.title}</h1>
          <span className="text-gray-600">{fundingData.categoryName || fundingData.category}</span>
        </div>

        <div className="flex flex-col md:flex-row justify-between mb-4">
          <div>
            <span className="text-gray-600">참여자: {fundingData.participantsNumber}명</span>
            <span className="ml-4 px-2 py-1 bg-gray-100 rounded text-sm">{fundingData.status}</span>
          </div>
          <div className="md:text-right">
            <div className="text-gray-600">
              현재 모금액: {fundingData.fundedAmount.toLocaleString()}원 ({fundingPercentage}%)
            </div>
            <div className="font-bold">
              목표 금액: {fundingData.product?.price.toLocaleString() || "설정되지 않음"}원
            </div>
          </div>
        </div>

        {/* 진행 바 */}
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-black h-2.5 rounded-full"
            style={{ width: `${fundingPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* 대상자 소개 섹션 */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4">대상자 소개</h2>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="border border-gray-200 rounded-lg p-6 md:w-1/2">
            <div className="mb-4">
              <div className="w-24 h-24 rounded-lg mb-4 overflow-hidden">
                <img 
                  src={fundingData.writer.image || "https://via.placeholder.com/200x200?text=프로필"}
                  alt={`${fundingData.writer.nickName}의 프로필`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="font-bold">{fundingData.writer.nickName}</div>
              <div className="text-gray-600">{fundingData.categoryName || fundingData.category}</div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-6 md:w-1/2">
            <h3 className="font-bold mb-4">펀딩 소개글</h3>
            <p className="text-gray-600">{fundingData.description}</p>
          </div>
        </div>
      </section>

      {/* 참여자 섹션 */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4">참여자 섹션</h2>
        <div className="border border-gray-200 rounded-lg p-6">
          <div className="mb-6">
            <h3 className="font-bold mb-4">함께하는 사람들 ({fundingData.participantsNumber}명)</h3>
          </div>

          <div>
            <h3 className="font-bold mb-4">참여자 목록</h3>
            {displayedParticipants.length > 0 ? (
              <div className="space-y-6">
                {displayedParticipants.map((letter) => (
                  <div key={letter.letterId} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full overflow-hidden">
                        <img 
                          src={letter.user.image || "https://via.placeholder.com/50x50"}
                          alt={`${letter.user.nickName}의 프로필`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="font-bold">{letter.user.nickName}</span>
                    </div>
                    <p className="text-gray-600 pl-10">{letter.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">아직 참여자가 없습니다.</p>
            )}

            {fundingData.letters.length > 3 && (
              <button
                onClick={toggleParticipantsList}
                className="w-full py-2 border border-gray-200 rounded-md mt-4 text-gray-600 hover:bg-gray-50"
              >
                {showAllParticipants ? "숨기기" : "펼쳐보기"}
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 선물하기 섹션 수정 */}
      <section className="mb-10">
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-black rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold">
              <span className="text-red-500">{fundingData.writer.nickName}님</span>의<br />
              위시 펀딩 동참하기
            </h2>
          </div>

          <div className="bg-white rounded-lg p-4 mb-6">
            <div className="text-purple-600 font-bold">
              목표까지 {remainingAmount.toLocaleString()}원 남았어요
            </div>
            <div className="w-full bg-purple-100 rounded-full h-2 my-2">
              <div
                className="bg-purple-500 h-2 rounded-full"
                style={{ width: `${fundingPercentage}%` }}
              ></div>
            </div>
            <div className="text-right text-gray-600">
              목표금액 {fundingData.product?.price.toLocaleString() || "0"}원
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {GIFT_OPTIONS.map((option) => (
              <button
                key={option.amount}
                onClick={() => selectAmount(option.amount)}
                className={`p-4 rounded-lg text-white flex flex-col items-start ${
                  selectedAmount === option.amount && !isCustomInput 
                    ? 'bg-gray-800' 
                    : 'bg-black'
                }`}
              >
                <span className="font-bold text-lg mb-2">{option.label}</span>
                <span className="text-sm">{option.description}</span>
              </button>
            ))}
          </div>

          {/* 직접 입력 필드 추가 */}
          {isCustomInput && (
            <div className="mb-6">
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  금액을 직접 입력해주세요
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                    placeholder="금액을 입력하세요"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                    원
                  </span>
                </div>
                {customAmount && (
                  <p className="mt-2 text-sm text-gray-600">
                    {parseInt(customAmount).toLocaleString()}원을 선물합니다
                  </p>
                )}
              </div>
            </div>
          )}

          <button 
            onClick={handleGiftClick}
            className={`w-full py-3 text-white font-bold rounded-lg transition ${
              (selectedAmount || (isCustomInput && customAmount)) 
                ? 'bg-black hover:bg-gray-800' 
                : 'bg-gray-400 cursor-not-allowed'
            }`}
            disabled={!selectedAmount && (!isCustomInput || !customAmount)}
          >
            {selectedAmount ? 
              `${selectedAmount.toLocaleString()}원 선물하기` : 
              '선물하기'
            }
          </button>
        </div>
      </section>

      {/* 안내사항 섹션 */}
      <section className="mb-6">
        <div className="space-y-6 text-sm">
          <div>
            <h3 className="font-bold flex items-center">
              <span className="text-red-500 mr-1">✓</span> 펀딩 참여 안내
            </h3>
            <ul className="ml-4 mt-2 space-y-1 list-disc text-gray-600">
              <li>펀딩에 참여하시면 GIVU 페이로 결제가 진행됩니다</li>
              <li>펀딩 목표 금액 달성 시, 마이페이지 내 펀딩 목록에서 상품 구매를 진행할 수 있습니다.</li>
              <li>펀딩 참여 내역은 마이페이지에서 확인하실 수 있습니다</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold flex items-center">
              <span className="text-yellow-500 mr-1">💰</span> GIVU 페이 안내
            </h3>
            <ul className="ml-4 mt-2 space-y-1 list-disc text-gray-600">
              <li>펀딩 참여 시 GIVU 페이 잔액이 부족할 경우, 충전 후 참여가 가능합니다</li>
              <li>펀딩 참여 시 참여하신 금액은 GIVU 페이로 차감 완료됩니다</li>
              <li>GIVU 페이 충전 금액의 환불은 고객센터를 통해 가능합니다</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold flex items-center">
              <span className="text-orange-500 mr-1">🎁</span> 선물 관련 안내
            </h3>
            <ul className="ml-4 mt-2 space-y-1 list-disc text-gray-600">
              <li>목표 금액 달성 시 GIVU 자사몰에 등록된 상품으로 구매가 진행됩니다</li>
              <li>선물 수령자의 주소지로 배송이 이루어집니다</li>
              <li>상품 하자 및 오배송의 경우 교환/반품이 가능합니다</li>
              <li>단순 변심에 의한 교환/반품은 불가합니다</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold flex items-center">
              <span className="text-red-500 mr-1">❌</span> 펀딩 취소 안내
            </h3>
            <ul className="ml-4 mt-2 space-y-1 list-disc text-gray-600">
              <li>펀딩 달성률에 따라 취소 정책이 달라집니다.
                <br />(50% 이하 → 참여자 환불 / 50% 이상 → 정상자 GIVU 페이 증정)</li>
              <li>목표 금액 달성 후에는 취소가 불가합니다</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold flex items-center">
              <span className="text-yellow-500 mr-1">⚠</span> 교환/반품이 불가능한 경우
            </h3>
            <ul className="ml-4 mt-2 space-y-1 list-disc text-gray-600">
              <li>선물 수령자가 상품을 사용하거나 훼손한 경우</li>
              <li>상품의 포장을 개봉하여 가치가 하락한 경우</li>
              <li>시간 경과로 재판매가 어려울 정도로 상품 가치가 하락한 경우</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold flex items-center">
              <span className="text-gray-500 mr-1">📞</span> 고객 지원
            </h3>
            <ul className="ml-4 mt-2 space-y-1 list-disc text-gray-600">
              <li>펀딩 관련 문의: 채널톡 상담</li>
              <li>상품 관련 문의: GIVU 고객센터</li>
              <li>운영시간: 평일 10:00 - 18:00 (주말/공휴일 제외)</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 디버깅 정보 (개발 중에만 표시) */}
      {import.meta.env.MODE === 'development' && (
        <div className="mt-8 p-4 bg-gray-100 rounded-lg text-xs">
          <h4 className="font-bold mb-2">디버깅 정보</h4>
          <pre className="overflow-auto">{JSON.stringify({ fundingId, loading, error }, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default FundingDetailPage;