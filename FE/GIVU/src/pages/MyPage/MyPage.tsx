import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

// 임시 데이터 - 나중에 API에서 가져오도록 수정 예정


// 임시 펀딩 데이터
const MY_FUNDINGS = [
  {
    id: 1,
    title: "도현이 점심 펀딩",
    progress: 45, // 달성률 수정
    tag: "45% 달성",
    imageUrl: "https://via.placeholder.com/300x200?text=펀딩이미지1",
  },
  {
    id: 2,
    title: "도현이 아침 펀딩",
    progress: 28,
    tag: "28% 달성",
    imageUrl: "https://via.placeholder.com/300x200?text=펀딩이미지2",
  },
  {
    id: 3,
    title: "도현이 저녁 펀딩",
    progress: 72,
    tag: "72% 달성",
    imageUrl: "https://via.placeholder.com/300x200?text=펀딩이미지3",
  },
];

const PARTICIPATED_FUNDINGS = [
  {
    id: 4,
    title: "오늘 도현이의 패션",
    progress: 66,
    tag: "66% 달성",
    imageUrl: "https://via.placeholder.com/300x200?text=패션이미지",
  },
  {
    id: 5,
    title: "도현이 팬티 펀딩",
    progress: 89,
    tag: "89% 달성",
    imageUrl: "https://via.placeholder.com/300x200?text=팬티이미지",
  },
];

// 임시 후기 데이터 - 더 많은 데이터 추가 (페이지네이션 테스트용)
const MY_REVIEWS = [
  {
    id: 1,
    title: "노란색이 된 도현이의 속옷을 사주세요 !!!",
    date: "2025.03.10",
    author: "닉네임",
    views: 235,
    image: "https://via.placeholder.com/150x100?text=속옷이미지"
  },
  {
    id: 2,
    title: "제 워너비 복장입니다 사주세요 !!!",
    date: "2025.03.01",
    author: "정도현",
    views: 124,
    image: "https://via.placeholder.com/150x100?text=복장이미지"
  },
  // 추가 데이터는 실제 구현 시 API에서 가져올 것입니다
];

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
type TabType = "created" | "participated" | "liked" | "wishlist";

// Funding 타입을 먼저 정의
type Funding = {
  id: number;
  title: string;
  progress: number;
  tag: string;
  imageUrl: string;
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
}> = ({ isOpen, onClose, type }) => {
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

  const handleSubmit = async () => {
    if (password.length !== 6) {
      setError('비밀번호는 6자리 숫자여야 합니다.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 비밀번호 검증 로직 (실제로는 API 호출)
      // 임시로 항상 성공하는 것으로 가정
      const isPasswordCorrect = true; // 실제 구현 시 API로 검증

      if (!isPasswordCorrect) {
        throw new Error('비밀번호가 일치하지 않습니다.');
      }

      // const transaction: Transaction = {
      //   transactionBalance: Number(amount),
      //   accountNo: 'dummy' // 계좌번호는 API에서 유저 정보로 확인
      // };

      // 실제 API 호출 부분 (주석 처리)
      /*
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/transaction/${type}`,
        transaction
      );
      */

      // 임시 성공 처리
      alert(type === 'deposit' ? '충전이 완료되었습니다.' : '출금이 완료되었습니다.');
      resetModal();
      onClose();
    } catch (err: any) {
      setError(err.message || '거래 중 오류가 발생했습니다.');
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
          {type === 'deposit' ? '충전하기' : '출금하기'}
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
                {type === 'deposit' ? '충전' : '출금'}을 위해 계좌 비밀번호를 입력해주세요.
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

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
    setPassword(value);
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
    setConfirmPassword(value);
  };

  const handleNextStep = () => {
    if (password.length !== 6) {
      setError('비밀번호는 6자리 숫자여야 합니다.');
      return;
    }
    setError(null);
    setStep(2);
  };

  const handleSubmit = () => {
    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    onSubmit(password);
  };

  const resetModal = () => {
    setPassword('');
    setConfirmPassword('');
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
                    className="w-10 h-12 border-2 border-gray-300 rounded-md flex items-center justify-center text-xl font-bold"
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
                    className="w-10 h-12 border-2 border-gray-300 rounded-md flex items-center justify-center text-xl font-bold"
                  >
                    {confirmPassword[i] ? '•' : ''}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {step === 1 ? (
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="6자리 비밀번호 입력"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-xl tracking-widest"
              maxLength={6}
              autoFocus
            />
          ) : (
            <input
              type="password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              placeholder="비밀번호 확인"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-xl tracking-widest"
              maxLength={6}
              autoFocus
            />
          )}
          
          {error && (
            <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
          )}
        </div>
        
        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            취소
          </button>
          
          {step === 1 ? (
            <button
              onClick={handleNextStep}
              disabled={password.length !== 6}
              className={`px-6 py-2 ${
                password.length === 6 
                  ? 'bg-pink-500 hover:bg-pink-600 text-white' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              } rounded-md transition-colors`}
            >
              다음
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={confirmPassword.length !== 6}
              className={`px-6 py-2 ${
                confirmPassword.length === 6 
                  ? 'bg-pink-500 hover:bg-pink-600 text-white' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              } rounded-md transition-colors`}
            >
              계좌 생성
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
  
  // 방법 1: HTMLDivElement | null 타입으로 명시적 정의
  const createdFundingsRef = useRef<HTMLDivElement | null>(null);
  const participatedFundingsRef = useRef<HTMLDivElement | null>(null);
  // const reviewsRef = useRef<HTMLDivElement | null>(null);
  // const wishlistRef = useRef<HTMLDivElement | null>(null);
  
  
  // 스크롤 함수 타입 정의 변경
  const scrollHorizontally = (ref: React.RefObject<HTMLDivElement> | any, direction: 'left' | 'right') => {
    if (ref && ref.current) {
      const scrollAmount = 300;
      const scrollLeft = direction === 'left' 
        ? ref.current.scrollLeft - scrollAmount 
        : ref.current.scrollLeft + scrollAmount;
      
      ref.current.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
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
        const wishlist = response.data.filter((product: any) => 
          favoriteProductIds.includes(String(product.id))
        );
        setWishlistProducts(wishlist);
      }
    } catch (error) {
      console.error('찜 목록을 불러오는 중 오류가 발생했습니다:', error);
    } finally {
      setLoadingWishlist(false);
    }
  };
  
  // 탭이 wishlist로 변경될 때마다 데이터 가져오기
  useEffect(() => {
    if (activeTab === "wishlist") {
      fetchWishlistProducts();
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
                className="p-2 bg-cusBlack text-white rounded-full shadow-md hover:bg-cusBlack-light"
                aria-label="이전 항목"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>
            
            <div 
              ref={createdFundingsRef}
              className="flex overflow-x-auto scrollbar-hide gap-4 py-4 pl-2 pr-6"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {MY_FUNDINGS.map((funding) => (
                <Link 
                  key={funding.id} 
                  to={`/funding/${funding.id}`} 
                  className="flex-shrink-0"
                  style={{ width: '300px' }}
                >
                  <FundingCard funding={funding} />
                </Link>
              ))}
            </div>
            
            <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 z-10">
              <button 
                onClick={() => handleScrollRight(createdFundingsRef)}
                className="p-2 bg-cusBlack text-white rounded-full shadow-md hover:bg-cusBlack-light"
                aria-label="다음 항목"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        );
        
      case "participated":
        return (
          <div className="relative">
            <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 z-10">
              <button 
                onClick={() => handleScrollLeft(participatedFundingsRef)}
                className="p-2 bg-cusBlack text-white rounded-full shadow-md hover:bg-cusBlack-light"
                aria-label="이전 항목"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>
            
            <div 
              ref={participatedFundingsRef}
              className="flex overflow-x-auto scrollbar-hide gap-4 py-4 pl-2 pr-6"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {PARTICIPATED_FUNDINGS.map((funding) => (
                <Link 
                  key={funding.id} 
                  to={`/funding/${funding.id}`} 
                  className="flex-shrink-0"
                  style={{ width: '300px' }}
                >
                  <FundingCard funding={funding} />
                </Link>
              ))}
            </div>
            
            <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 z-10">
              <button 
                onClick={() => handleScrollRight(participatedFundingsRef)}
                className="p-2 bg-cusBlack text-white rounded-full shadow-md hover:bg-cusBlack-light"
                aria-label="다음 항목"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        );
        
      case "liked":
        const paginatedReviews = getPaginatedItems(MY_REVIEWS, currentPage, itemsPerPage);
        
        return MY_REVIEWS.length > 0 ? (
          <div>
            <div className="space-y-4">
              {paginatedReviews.map((review) => (
                <Link 
                  key={review.id} 
                  to={`/funding/review/${review.id}`}
                  className="block hover:bg-cusGray-light transition-colors rounded-xl"
                >
                  <div className="flex gap-6 p-4 border border-cusGray bg-white rounded-lg">
                    <div className="w-32 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                      <img 
                        src={review.image} 
                        alt={review.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold mb-2 text-cusBlack">{review.title}</h2>
                      <div className="text-sm text-cusBlack-light">
                        작성자: <span className="text-cusBlue font-medium">{review.author}</span> | {review.date} | 조회 {review.views}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            {/* 페이지네이션 컴포넌트 */}
            <Pagination 
              totalItems={MY_REVIEWS.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </div>
        ) : (
          <div className="bg-cusGray-light rounded-xl py-10 text-center">
            <p className="text-cusBlack-light font-medium">아직 작성한 후기가 없습니다.</p>
            <button className="mt-4 px-6 py-2 bg-cusBlue text-white rounded-full hover:bg-cusBlue-light transition-colors text-sm">
              첫 후기 작성하기
            </button>
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

  const handleTransactionClick = (type: TransactionType) => {
    if (!hasAccount) {
      setIsAccountModalOpen(true);
      return;
    }
    
    setTransactionType(type);
    setIsTransactionModalOpen(true);
  };
  
  // 계좌 생성 제출 핸들러
  const handleAccountCreation = (password: string) => {
    console.log('계좌 생성 - 비밀번호:', password);
    // TODO: 여기서 API 호출
    
    // 임시로 계좌 생성 시뮬레이션
    const randomAccountNumber = Math.floor(Math.random() * 90000000) + 10000000;
    setAccountNumber(`110-${randomAccountNumber}-01`);
    setHasAccount(true);
    setIsAccountModalOpen(false);
    
    // 사용자 데이터 업데이트 (잔액 초기화)
    if (userData) {
      setUserData({
        ...userData,
        balance: 0,
      });
    }
    
    alert('계좌가 성공적으로 생성되었습니다!');
  };
  
  // 컴포넌트 마운트 시 로그인 체크 및 사용자 정보 가져오기
  useEffect(() => {
    const userString = localStorage.getItem('user');
    const token = localStorage.getItem('auth_token');

    if (!userString || !token) {
      alert('로그인이 필요한 서비스입니다.');
      navigate('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userString);
      setUserData(parsedUser);
      
      // 임시로 계좌가 있는지 확인 (실제로는 API 호출)
      // userData에 balance가 있고 null이 아닌 경우 계좌가 있다고 간주
      if (parsedUser.balance !== undefined && parsedUser.balance !== null) {
        setHasAccount(true);
        // 계좌번호도 설정 (실제로는 API에서 가져옴)
        const randomAccountNumber = Math.floor(Math.random() * 90000000) + 10000000;
        setAccountNumber(`110-${randomAccountNumber}-01`);
      }
    } catch (error) {
      console.error('사용자 정보 파싱 오류:', error);
      navigate('/login');
    }
  }, [navigate]);

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
                <button className="px-4 py-2 bg-btnPink hover:bg-btnPink-hover text-black hover:text-white rounded-full text-sm transition-colors shadow-md">
                  프로필 수정
                </button>
              </div>
            </div>
            
            <div className="flex-1 w-full">
              <div className="bg-cusLightBlue-lighter rounded-2xl p-6 mb-6 shadow-md">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center border-b border-cusGray pb-4 mb-4">
                  <div className="mr-auto md:ml-4">
                    <h1 className="text-2xl font-bold text-cusBlack">{userData.nickname}</h1>
                  </div>
                  {hasAccount ? (
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleTransactionClick('deposit')}
                        className="px-5 py-2 border border-cusBlue rounded-full text-sm bg-btnLightBlue text-cusBlue hover:bg-btnLightBlue-hover hover:text-white transition-colors shadow-sm"
                      >
                        충전하기
                      </button>
                      <button
                        onClick={() => handleTransactionClick('withdrawal')}
                        className="px-5 py-2 border border-cusYellow rounded-full text-sm bg-btnYellow text-cusBlack hover:bg-btnYellow-hover transition-colors shadow-sm"
                      >
                        출금하기
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsAccountModalOpen(true)}
                      className="px-5 py-2 border border-cusBlue rounded-full text-sm bg-btnLightBlue text-cusBlue hover:bg-btnLightBlue-hover hover:text-white transition-colors shadow-sm"
                    >
                      계좌 만들기
                    </button>
                  )}
                </div>
                
                {hasAccount ? (
                  <div className="flex flex-col md:flex-row items-center md:items-start justify-start gap-10 py-4 md:pl-4">
                    <div className="text-center md:text-left">
                      <div className="flex items-center justify-center md:justify-start mb-2">
                        <span className="text-yellow-500 text-3xl mr-2">👑</span>
                        <h3 className="text-xl font-bold text-cusBlue">내 기뷰페이</h3>
                      </div>
                      <p className="text-3xl font-bold text-cusBlack">{userData.balance?.toLocaleString()}<span className="text-xl ml-1">원</span></p>
                    </div>
                    <div className="text-center md:text-left">
                      <p className="text-cusBlack-light mb-2">내 기뷰페이 계좌</p>
                      <p className="text-xl font-bold text-cusBlack">{accountNumber}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-4">
                    <div className="w-16 h-16 rounded-full bg-cusLightBlue flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cusBlue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold mb-2 text-cusBlack">기뷰페이 계좌가 없습니다</h3>
                    <p className="text-cusBlack-light mb-4 text-center">쇼핑과 펀딩을 편리하게 이용하려면<br />기뷰페이 계좌를 만들어보세요!</p>
                    <button 
                      onClick={() => setIsAccountModalOpen(true)}
                      className="px-6 py-2 bg-cusBlue text-white rounded-full hover:bg-cusBlue-dark transition-colors"
                    >
                      계좌 만들기
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* 탭 메뉴 - 글자 색상 강조 */}
          <div className="mb-8 mt-10">
            <div className="mb-4">
              <div className="flex flex-wrap justify-center md:justify-start gap-2 md:gap-4" role="group">
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
                    activeTab === "liked" 
                      ? "bg-cusBlack text-success shadow-lg" 
                      : "bg-cusGray-light text-cusBlack-light hover:bg-cusGray"
                  }`}
                  onClick={() => setActiveTab("liked")}
                >
                  내가 쓴 후기
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

export default MyPage;