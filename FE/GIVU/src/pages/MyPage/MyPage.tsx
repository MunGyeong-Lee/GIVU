import React, { useState, useRef, MutableRefObject } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

// 임시 데이터 - 나중에 API에서 가져오도록 수정 예정
const USER_DATA = {
  name: "정도현",
  profileImage: "https://via.placeholder.com/200x200?text=정도현",
  totalDonation: 100000,
};

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
    author: "정도현",
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
const WISHLIST_ITEMS = [
  { 
    id: 5, 
    name: "에어팟 프로 2", 
    price: 359000, 
    category: "가전/디지털", 
    imageUrl: "https://via.placeholder.com/200x200?text=에어팟+프로", 
    discount: 10 
  },
  { 
    id: 11, 
    name: "애플 맥북 프로", 
    price: 2490000, 
    category: "가전/디지털", 
    imageUrl: "https://via.placeholder.com/200x200?text=맥북+프로", 
    discount: 5 
  }
];

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
interface Transaction {
  transactionBalance: number;
  accountNo: string;
}

// 모달 컴포넌트 추가
const TransactionModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  type: TransactionType;
}> = ({ isOpen, onClose, type }) => {
  const [amount, setAmount] = useState<string>('');
  const [accountNo, setAccountNo] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 입력값 검증
      if (!amount || !accountNo) {
        throw new Error('모든 필드를 입력해주세요.');
      }

      if (accountNo.length !== 16) {
        throw new Error('올바른 계좌번호를 입력해주세요. (16자리)');
      }

      const transaction: Transaction = {
        transactionBalance: Number(amount),
        accountNo: accountNo
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/transaction/${type}`,
        transaction
      );

      if (response.data === true) {
        alert(type === 'deposit' ? '충전이 완료되었습니다.' : '출금이 완료되었습니다.');
        onClose();
      } else {
        throw new Error('거래에 실패했습니다.');
      }
    } catch (err: any) {
      setError(err.message || '거래 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-cusBlack">
          {type === 'deposit' ? '충전하기' : '출금하기'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-cusBlack-light mb-1">
              계좌번호
            </label>
            <input
              type="text"
              value={accountNo}
              onChange={(e) => setAccountNo(e.target.value.replace(/[^0-9]/g, ''))}
              maxLength={16}
              placeholder="SSAFY 계좌번호 16자리"
              className="w-full px-4 py-2 border border-cusGray rounded-lg focus:outline-none focus:ring-2 focus:ring-cusBlue"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-cusBlack-light mb-1">
              금액ㅋㅋㅋ
            </label>
            <div className="relative">
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="금액을 입력하세요"
                className="w-full px-4 py-2 border border-cusGray rounded-lg focus:outline-none focus:ring-2 focus:ring-cusBlue"
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
              type="submit"
              disabled={loading}
              className={`flex-1 px-4 py-2 rounded-lg text-white ${
                loading 
                  ? 'bg-cusBlue-light cursor-not-allowed' 
                  : 'bg-cusBlue hover:bg-cusBlue-dark'
              } transition-colors`}
            >
              {loading ? '처리중...' : type === 'deposit' ? '충전하기' : '출금하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const MyPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>("created");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // 방법 1: HTMLDivElement | null 타입으로 명시적 정의
  const createdFundingsRef = useRef<HTMLDivElement | null>(null);
  const participatedFundingsRef = useRef<HTMLDivElement | null>(null);
  const reviewsRef = useRef<HTMLDivElement | null>(null);
  const wishlistRef = useRef<HTMLDivElement | null>(null);
  
  
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
        return WISHLIST_ITEMS.length > 0 ? (
          <div className="relative">
            <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 z-10">
              <button 
                onClick={() => handleScrollLeft(wishlistRef)}
                className="p-2 bg-cusBlack text-white rounded-full shadow-md hover:bg-cusBlack-light"
                aria-label="이전 항목"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>
            
            <div 
              ref={wishlistRef}
              className="flex overflow-x-auto scrollbar-hide gap-4 py-4 pl-2 pr-6"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {WISHLIST_ITEMS.map((product) => (
                <Link 
                  key={product.id} 
                  to={`/shopping/product/${product.id}`}
                  className="bg-white border border-cusGray rounded-xl overflow-hidden hover:shadow-lg transition-all transform hover:-translate-y-1 flex-shrink-0"
                  style={{ width: '250px' }}
                >
                  <div className="h-48 bg-cusGray-light">
                    <img 
                      src={product.imageUrl} 
                      alt={product.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium mb-2 text-cusBlack">{product.name}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      {product.discount > 0 && (
                        <span className="text-cusBlack-light line-through text-sm">
                          {product.price.toLocaleString()}원
                        </span>
                      )}
                      <span className="text-cusRed font-bold">
                        {(product.price * (100 - product.discount) / 100).toLocaleString()}원
                      </span>
                      {product.discount > 0 && (
                        <span className="bg-cusRed-light text-white text-xs font-bold px-2 py-0.5 rounded-full ml-auto">
                          {product.discount}% 할인
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 z-10">
              <button 
                onClick={() => handleScrollRight(wishlistRef)}
                className="p-2 bg-cusBlack text-white rounded-full shadow-md hover:bg-cusBlack-light"
                aria-label="다음 항목"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-cusGray-light rounded-xl py-10 text-center">
            <p className="text-cusBlack-light font-medium">아직 위시리스트에 추가한 상품이 없습니다.</p>
            <Link to="/shopping" className="inline-block mt-4 px-6 py-2 bg-cusRed text-white rounded-full hover:bg-cusRed-light transition-colors text-sm">
              쇼핑하러 가기
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

  const handleTransactionClick = (type: TransactionType) => {
    setTransactionType(type);
    setIsTransactionModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-5 py-8 font-pretendard">
      {/* 상단 프로필 영역 */}
      <div className="flex flex-col md:flex-row items-start">
        <div className="md:mr-8 mb-6 md:mb-0">
          <div className="w-36 h-36 md:w-40 md:h-40 rounded-full overflow-hidden mb-4 border-4 border-cusPink shadow-lg">
            <img
              src={USER_DATA.profileImage}
              alt={USER_DATA.name}
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
              <h1 className="text-2xl font-bold mb-3 md:mb-0 text-cusBlack">{USER_DATA.name}</h1>
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
            </div>
            
            <div className="flex items-center">
              <div className="mr-10">
                <div className="flex items-center mb-2">
                  <span className="text-yellow-500 text-2xl mr-2">👑</span>
                  <h3 className="text-lg font-medium text-cusBlue">내 기뷰페이</h3>
                </div>
                <p className="text-3xl font-bold text-cusBlack">{USER_DATA.totalDonation.toLocaleString()}</p>
              </div>
            </div>
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
                  ? "bg-cusBlack text-cusYellow shadow-lg" 
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