import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';

// .env 파일에서 기본 URL 가져오기

// API 응답 타입에 맞게 수정된 상품 인터페이스
interface Product {
  id: number;
  productName: string;
  price: number;
  image: string;
  favorite: boolean;
  star: number;
  views: number;  // 조회수 추가
  description: string;
  createdAt: string;
  payments: any[];
  category: string;
}

// 카테고리 정의 수정
const CATEGORIES = [
  { id: 1, name: "전체", icon: "🏠", value: null },
  { id: 2, name: "전자기기", icon: "📱", value: "ELECTRONICS" },
  { id: 3, name: "패션/의류", icon: "👕", value: "CLOTHING" },
  { id: 4, name: "식품/음료", icon: "🍎", value: "FOOD" },
  { id: 5, name: "가정용품", icon: "🧹", value: "HOMEAPPLIANCES" },
  { id: 6, name: "가구/인테리어", icon: "🪑", value: "FURNITURE" },
  { id: 7, name: "건강/뷰티", icon: "💄", value: "BEAUTY" },
  { id: 8, name: "스포츠/레저", icon: "⚽", value: "SPORTS" },
  { id: 9, name: "도서/문구", icon: "📚", value: "BOOKS" },
  { id: 10, name: "기타", icon: "🎁", value: "OTHER" }
];

// 가격대 필터 인터페이스 추가
interface PriceRange {
  id: number;
  name: string;
  min: number | null;
  max: number | null;
}

// 가격대 필터 수정 - 명시적 타입 지정
const PRICE_RANGES: PriceRange[] = [
  { id: 1, name: "가격대별", min: null, max: null },
  { id: 2, name: "1만원 미만", min: 0, max: 10000 },
  { id: 3, name: "1~3만원", min: 10000, max: 30000 },
  { id: 4, name: "3~5만원", min: 30000, max: 50000 },
  { id: 5, name: "5~10만원", min: 50000, max: 100000 },
  { id: 6, name: "10만원 이상", min: 100000, max: null }
];

// 카테고리 아이콘 가져오기 유틸 함수
const getCategoryIcon = (categoryValue: string) => {
  const category = CATEGORIES.find(cat => cat.value === categoryValue);
  return category ? category.icon : "🏷️";
};

// 이미지 컴포넌트 - 규격화된 이미지 표시를 위한 공통 컴포넌트
const ProductImage = ({ 
  image, 
  productName, 
  category 
}: { 
  image: string | null, 
  productName: string, 
  category: string 
}) => {
  return (
    <>
      {image ? (
        <div className="w-full h-full overflow-hidden bg-gray-100">
          <img 
            src={image} 
            alt={productName} 
            className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              // 이미지 로드 실패 시 기본 이미지로 대체
              e.currentTarget.src = `https://via.placeholder.com/300x300?text=${getCategoryIcon(category)}`;
            }}
          />
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-200">
          <span className="text-4xl">{getCategoryIcon(category)}</span>
        </div>
      )}
    </>
  );
};

// 계좌 생성 모달 컴포넌트
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

// 충전 모달 컴포넌트 추가
const ChargeModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
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

      // 충전 API 호출 (실제로는 구현 필요)
      // await axios.post(...);

      // 임시 성공 처리
      alert('충전이 완료되었습니다.');
      resetModal();
      onClose();
    } catch (err: any) {
      setError(err.message || '충전 중 오류가 발생했습니다.');
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
        <h2 className="text-2xl font-bold mb-6 text-center">충전하기</h2>
        
        {step === 1 ? (
          // 금액 입력 단계
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                충전 금액
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={amount}
                  onChange={handleAmountChange}
                  placeholder="금액을 입력하세요"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  autoFocus
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                  원
                </span>
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm py-2">
                {error}
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                disabled={!amount || Number(amount) <= 0}
                className={`flex-1 px-4 py-2 rounded-lg text-white ${
                  !amount || Number(amount) <= 0
                    ? 'bg-pink-300 cursor-not-allowed' 
                    : 'bg-pink-500 hover:bg-pink-600'
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
              <p className="text-lg font-medium mb-2 text-center">
                충전을 위해 계좌 비밀번호를 입력해주세요.
              </p>
              <p className="text-gray-600 mb-4 text-center">
                금액: <span className="font-bold text-gray-800">{Number(amount).toLocaleString()}원</span>
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-xl tracking-widest"
                maxLength={6}
                autoFocus
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm py-2 text-center">
                {error}
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                이전
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={password.length !== 6 || loading}
                className={`flex-1 px-4 py-2 rounded-lg text-white ${
                  password.length !== 6 || loading
                    ? 'bg-pink-300 cursor-not-allowed' 
                    : 'bg-pink-500 hover:bg-pink-600'
                } transition-colors`}
              >
                {loading ? '처리중...' : '충전하기'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const MainShopping = () => {
  // 상태 관리
  const [products, setProducts] = useState<Product[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [bestProducts, setBestProducts] = useState<Product[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 무한 스크롤을 위한 상태
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(8); // 한 번에 보여줄 상품 수
  const [hasMore,setHasMore] = useState(true);
  
  // ref 정의
  const bestProductsRef = useRef<HTMLDivElement>(null);
  // const productGridRef = useRef<HTMLDivElement>(null);
  const trendingProductsRef = useRef<HTMLDivElement>(null);
  const allProductsRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef<HTMLDivElement>(null); // 무한 스크롤 감지를 위한 ref

  // 추가된 상태
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // 현재 필터링된 상품을 저장하는 상태 추가
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  // 계좌 관련 상태 추가
  const [hasAccount, setHasAccount] = useState<boolean>(false);
  const [accountNumber, setAccountNumber] = useState<string>('');
  const [accountBalance, setAccountBalance] = useState<number>(0);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState<boolean>(false);
  const [isChargeModalOpen, setIsChargeModalOpen] = useState<boolean>(false);

  // 필터 적용 함수 - 카테고리와 가격대 필터를 모두 적용
  const applyFilters = (allProducts: Product[]) => {
    let result = [...allProducts];
    
    // 카테고리 필터 적용
    if (selectedCategory && selectedCategory !== 'all') {
      result = result.filter(product => product.category === selectedCategory);
    }
    
    // 가격대 필터 적용
    if (selectedPriceRange !== null && selectedPriceRange !== 1) {
      const selectedRange = PRICE_RANGES.find(range => range.id === selectedPriceRange);
      if (selectedRange) {
        result = result.filter(product => {
          if (selectedRange.min !== null && selectedRange.max !== null) {
            return product.price >= selectedRange.min && product.price < selectedRange.max;
          } else if (selectedRange.min !== null) {
            return product.price >= selectedRange.min;
          } else if (selectedRange.max !== null) {
            return product.price < selectedRange.max;
          }
          return true;
        });
      }
    }
    
    return result;
  };

  // API에서 상품 목록 가져오기
  const fetchProducts = async (pageNum: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/products/list`,
        {
          params: {
            page: pageNum,
            size: 10,
            sort: 'createdAt,desc'
          }
        }
      );

      // API 응답 데이터 확인 및 안전한 처리
      const productsData = response.data;
      console.log('API 응답:', productsData); // 디버깅용

      if (!productsData || !Array.isArray(productsData)) {
        throw new Error('올바르지 않은 데이터 형식입니다.');
      }

      // 로컬 스토리지에서 좋아요 상태 가져오기
      const favoriteProducts = JSON.parse(localStorage.getItem('favoriteProducts') || '{}') as Record<string, boolean>;
      
      // 상품 목록에 좋아요 상태 반영
      const productsWithFavorites = productsData.map((product: Product) => ({
        ...product,
        favorite: favoriteProducts[String(product.id)] !== undefined 
          ? favoriteProducts[String(product.id)] 
          : product.favorite
      }));

      if (pageNum === 0) {
        // 첫 페이지일 경우 상태 초기화
        setProducts(productsWithFavorites);
        // 초기 필터링된 상품 목록 설정
        setFilteredProducts(productsWithFavorites);
        // 초기 표시할 상품 목록 설정
        setDisplayedProducts(productsWithFavorites.slice(0, itemsPerPage));
        
        // 베스트 상품 설정 (별점 순 -> 가격 순)
        const bestProductsList = [...productsWithFavorites]
          .sort((a, b) => {
            if (a.star !== b.star) {
              return b.star - a.star;
            }
            return b.price - a.price;
          })
          .slice(0, 8);
        setBestProducts(bestProductsList);
        
        // 지금 뜨는 상품 설정 (조회수 기준)
        const trendingProductsList = [...productsWithFavorites]
          .sort((a, b) => b.views - a.views)
          .slice(0, 5);
        setTrendingProducts(trendingProductsList);
      } else {
        // 추가 페이지의 경우 기존 상품 목록에 추가
        setProducts(prev => [...prev, ...productsWithFavorites]);
        // 필터링된 상품 목록에도 추가 (필터 적용)
        setFilteredProducts(prev => applyFilters([...prev, ...productsWithFavorites]));
        // 표시할 상품 목록 업데이트
        setDisplayedProducts(prev => [...prev, ...productsWithFavorites.slice(0, itemsPerPage)]);
      }

      // 페이지네이션 처리
      setHasMore(productsData.length === 10); // 10개가 있으면 다음 페이지가 있다고 가정
      setPage(pageNum);
    } catch (err) {
      console.error('상품을 불러오는 중 오류가 발생했습니다:', err);
      setError('상품을 불러오는데 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  // 카테고리 선택 핸들러 수정
  const handleCategorySelect = (categoryValue: string | null) => {
    setSelectedCategory(categoryValue);
    
    // 필터 적용
    if (products.length > 0) {
      let filtered = [...products];
      
      if (categoryValue) {
        filtered = products.filter(product => {
          // API에서 받은 카테고리 값과 선택된 카테고리 값 비교
          return product.category === categoryValue;
        });
      }
      
      setFilteredProducts(filtered);
      setDisplayedProducts(filtered.slice(0, itemsPerPage));
      setHasMore(filtered.length > itemsPerPage);
      setPage(1);
    }
    
    // 스크롤을 상품 목록 위치로 이동
    allProductsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // 가격대 선택 핸들러
  const handlePriceRangeSelect = (priceRangeId: number | null) => {
    setSelectedPriceRange(priceRangeId);
    
    // 필터 적용
    if (products.length > 0) {
      const filtered = applyFilters(products);
      setFilteredProducts(filtered);
      setDisplayedProducts(filtered.slice(0, itemsPerPage));
      setHasMore(filtered.length > itemsPerPage);
      setPage(1);
    }
    
    // 스크롤을 상품 목록 위치로 이동
    allProductsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // 모든 필터 초기화
  const resetAllFilters = () => {
    setSelectedCategory(null);
    setSelectedPriceRange(null);
    
    setFilteredProducts(products);
    setDisplayedProducts(products.slice(0, itemsPerPage));
    setHasMore(products.length > itemsPerPage);
    setPage(1);
  };
  
  // 더 많은 상품 로드하기 - 수정
  const loadMoreProducts = () => {
    if (!hasMore || loading) return;
    
    const nextPage = page + 1;
    const startIndex = page * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    // 이미 필터링된 상품 목록 사용
    if (startIndex >= filteredProducts.length) {
      setHasMore(false);
      return;
    }
    
    setLoading(true);
    
    setTimeout(() => {
      const newDisplayedProducts = [
        ...displayedProducts,
        ...filteredProducts.slice(startIndex, endIndex)
      ];
      
      setDisplayedProducts(newDisplayedProducts);
      setPage(nextPage);
      
      // 더 불러올 상품이 있는지 확인
      setHasMore(endIndex < filteredProducts.length);
      setLoading(false);
    }, 500);
  };

  // 인터섹션 옵저버 설정 (무한 스크롤용)
  useEffect(() => {
    // 관찰할 요소가 없으면 리턴
    if (!loadingRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        // 관찰 대상이 화면에 보이면 추가 상품 로드
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMoreProducts();
        }
      },
      { threshold: 0.1 } // 10% 정도 보이면 로드 시작
    );
    
    // 관찰 시작
    observer.observe(loadingRef.current);
    
    // 컴포넌트 언마운트 시 관찰 중지
    return () => {
      if (loadingRef.current) {
        observer.unobserve(loadingRef.current);
      }
    };
  }, [loadingRef, hasMore, loading]);

  // 첫 로드 시 상품 가져오기
  useEffect(() => {
    fetchProducts(0);
  }, []);

  // 상품 목록 업데이트 이벤트 감지
  useEffect(() => {
    const handleProductsUpdate = (event: CustomEvent) => {
      const updatedProducts = event.detail.products;
      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts);
      setDisplayedProducts(updatedProducts.slice(0, itemsPerPage));
      
      // 베스트 상품 업데이트
      const bestProductsList = [...updatedProducts]
        .sort((a, b) => {
          if (a.star !== b.star) {
            return b.star - a.star;
          }
          return b.price - a.price;
        })
        .slice(0, 8);
      setBestProducts(bestProductsList);
      
      // 지금 뜨는 상품 업데이트
      const trendingProductsList = [...updatedProducts]
        .sort((a, b) => b.views - a.views)
        .slice(0, 5);
      setTrendingProducts(trendingProductsList);
    };

    window.addEventListener('productsUpdated', handleProductsUpdate as EventListener);
    return () => {
      window.removeEventListener('productsUpdated', handleProductsUpdate as EventListener);
    };
  }, [itemsPerPage]);

  // 카테고리나 가격대 필터 변경 시 필터링된 상품 갱신
  useEffect(() => {
    if (products.length > 0) {
      const filtered = applyFilters(products);
      setFilteredProducts(filtered);
      setDisplayedProducts(filtered.slice(0, itemsPerPage));
      setHasMore(filtered.length > itemsPerPage);
      setPage(1);
    }
  }, [selectedCategory, selectedPriceRange]);

  // isLoggedIn 상태 설정 로직 수정
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    setIsLoggedIn(!!token);
  }, []);

  // 찜하기 버튼 클릭 핸들러 추가
  const handleWishlistClick = async (e: React.MouseEvent, productId: number) => {
    e.preventDefault();
    e.stopPropagation();  // 이벤트 버블링 방지
    
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      alert('로그인이 필요한 서비스입니다.');
      return;
    }

    try {
      // 상품 ID를 문자열로 확실하게 변환
      const productIdStr = String(productId);
      
      // API 호출 전에 상태를 먼저 토글
      const product = products.find(p => p.id === productId);
      if (!product) return;

      const newFavoriteState = !product.favorite;
      
      // 로컬 스토리지에 상태 저장
      const favoriteProducts = JSON.parse(localStorage.getItem('favoriteProducts') || '{}') as Record<string, boolean>;
      favoriteProducts[productIdStr] = newFavoriteState;
      localStorage.setItem('favoriteProducts', JSON.stringify(favoriteProducts));

      // UI 상태 업데이트 - 모든 상태를 업데이트해야 함
      const updateProductState = (list: Product[]) => 
        list.map(p => p.id === productId ? { ...p, favorite: newFavoriteState } : p);
      
      // 모든 상태 업데이트
      const updatedProducts = updateProductState(products);
      const updatedFilteredProducts = updateProductState(filteredProducts);
      const updatedDisplayedProducts = updateProductState(displayedProducts);
      const updatedBestProducts = updateProductState(bestProducts);
      const updatedTrendingProducts = updateProductState(trendingProducts);
      
      setProducts(updatedProducts);
      setFilteredProducts(updatedFilteredProducts);
      setDisplayedProducts(updatedDisplayedProducts);
      setBestProducts(updatedBestProducts);
      setTrendingProducts(updatedTrendingProducts);

      await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/products/${productId}/like`,
        null,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          withCredentials: true
        }
      );

      console.log(`상품 ${productId}의 좋아요 상태가 ${newFavoriteState}로 변경되었습니다.`);
    } catch (error: any) {
      // 에러 발생 시 상태를 원래대로 되돌림
      const product = products.find(p => p.id === productId);
      if (product) {
        const originalState = product.favorite;
        
        // 로컬 스토리지 원상복구
        const favoriteProducts = JSON.parse(localStorage.getItem('favoriteProducts') || '{}') as Record<string, boolean>;
        favoriteProducts[String(productId)] = originalState;
        localStorage.setItem('favoriteProducts', JSON.stringify(favoriteProducts));
        
        // UI 상태 원상복구
        const revertProductState = (list: Product[]) => 
          list.map(p => p.id === productId ? { ...p, favorite: originalState } : p);
        
        setProducts(revertProductState(products));
        setFilteredProducts(revertProductState(filteredProducts));
        setDisplayedProducts(revertProductState(displayedProducts));
        setBestProducts(revertProductState(bestProducts));
        setTrendingProducts(revertProductState(trendingProducts));
      }
      console.error('찜하기 처리 중 오류 발생:', error);
      if (error.response) {
        console.log('에러 상태:', error.response.status);
        console.log('에러 데이터:', error.response.data);
      }
      alert('찜하기 처리 중 오류가 발생했습니다.');
    }
  };

  // 가로 스크롤 함수
  const scrollHorizontally = (ref: any, direction: 'left' | 'right') => {
    if (ref.current) {
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
  
  // 카테고리 스크롤 함수
  const scrollCategory = (direction: 'left' | 'right') => {
    if (categoryRef.current) {
      const scrollAmount = 200;
      const scrollLeft = direction === 'left' 
        ? categoryRef.current.scrollLeft - scrollAmount 
        : categoryRef.current.scrollLeft + scrollAmount;
      
      categoryRef.current.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      });
    }
  };

  // getCategoryName 함수 수정
  const getCategoryName = (categoryValue: string) => {
    console.log('카테고리 값:', categoryValue); // 디버깅용
    const category = CATEGORIES.find(cat => cat.value === categoryValue);
    return category ? category.name : categoryValue; // 매칭되지 않는 경우 원래 값 반환
  };
  
  // 필터 상태 텍스트 가져오기
  const getFilterStatusText = () => {
    if (selectedCategory && selectedPriceRange) {
      return `카테고리: ${getCategoryName(selectedCategory)}, 가격대: ${PRICE_RANGES.find(r => r.id === selectedPriceRange)?.name}`;
    } else if (selectedCategory) {
      return `카테고리: ${getCategoryName(selectedCategory)}`;
    } else if (selectedPriceRange) {
      return `가격대: ${PRICE_RANGES.find(r => r.id === selectedPriceRange)?.name}`;
    } else {
      return "전체 상품";
    }
  };

  // 계좌 생성 제출 핸들러
  const handleAccountCreation = (password: string) => {
    console.log('계좌 생성 - 비밀번호:', password);
    // TODO: 여기서 API 호출
    
    // 임시로 계좌 생성 시뮬레이션
    const randomAccountNumber = Math.floor(Math.random() * 90000000) + 10000000;
    setAccountNumber(`110-${randomAccountNumber}-01`);
    setAccountBalance(0);
    setHasAccount(true);
    setIsAccountModalOpen(false);
    
    alert('계좌가 성공적으로 생성되었습니다!');
  };
  
  // 충전하기 버튼 클릭 핸들러 추가
  const handleChargeClick = () => {
    if (!hasAccount) {
      setIsAccountModalOpen(true);
      return;
    }
    
    setIsChargeModalOpen(true);
  };

  return (
    <div className="w-full">
      {/* 초기 로딩 인디케이터 */}
      {loading && products.length === 0 && (
        <div className="fixed inset-0 bg-white bg-opacity-80 z-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-pink-500"></div>
        </div>
      )}
      
      {/* 에러 메시지 */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 mx-4" role="alert">
          <strong className="font-bold">오류!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}
      
      {/* 헤더 영역 */}
      <header className="py-4 border-b border-gray-200 bg-white w-full">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-pink-500">GIVUMALL</h1>
          <div className="relative w-64 md:w-96">
            <input 
              type="text"
              placeholder="상품명 또는 브랜드 입력"
              className="w-full py-2 px-4 border border-gray-300 rounded-md"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
      </header>
      
      {/* 계좌 정보 영역 (새로 추가) */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 py-6">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6">
            {hasAccount ? (
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="mb-4 md:mb-0">
                  <p className="text-gray-500 text-sm mb-1">내 기뷰페이 계좌</p>
                  <p className="text-lg font-bold">{accountNumber}</p>
                </div>
                <div className="flex items-center">
                  <div className="mr-3">
                    <p className="text-gray-500 text-sm mb-1">잔액</p>
                    <p className="text-xl font-bold text-pink-600">{accountBalance.toLocaleString()}원</p>
                  </div>
                  <button 
                    onClick={handleChargeClick}
                    className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-md transition-colors"
                  >
                    충전하기
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6">
                <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-2">기뷰페이 계좌가 없습니다</h3>
                <p className="text-gray-500 mb-4 text-center">쇼핑과 펀딩을 편리하게 이용하려면<br />기뷰페이 계좌를 만들어보세요!</p>
                <button 
                  onClick={() => setIsAccountModalOpen(true)}
                  className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-full transition-colors"
                >
                  계좌 만들기
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* 카테고리 영역 - 한 줄 가로 스크롤 */}
      <div className="bg-white py-4 border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="container mx-auto px-4 relative">
          {/* 왼쪽 스크롤 버튼 */}
          <button 
            onClick={() => scrollCategory('left')} 
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full shadow-md p-1 md:hidden"
            aria-label="카테고리 왼쪽으로 스크롤"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          
          {/* 카테고리 가로 스크롤 */}
          <div 
            ref={categoryRef}
            className="flex overflow-x-auto scrollbar-hide space-x-4 py-1 px-6 md:px-0 md:justify-center"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {CATEGORIES.map(category => (
              <div 
                key={category.id} 
                className={`flex items-center flex-shrink-0 cursor-pointer transition-all px-3 py-2 rounded-full ${
                  selectedCategory === category.value 
                    ? 'bg-pink-100 text-pink-600 font-medium shadow-sm' 
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => handleCategorySelect(category.value)}
              >
                <span className="mr-1.5">{category.icon}</span>
                <span className="whitespace-nowrap">{category.name}</span>
              </div>
            ))}
          </div>
          
          {/* 오른쪽 스크롤 버튼 */}
          <button 
            onClick={() => scrollCategory('right')} 
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full shadow-md p-1 md:hidden"
            aria-label="카테고리 오른쪽으로 스크롤"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* 베스트 상품 영역 - 가로 스크롤 */}
      {bestProducts.length > 0 && (
        <div className="py-10 w-full">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">베스트 상품</h3>
              <div className="flex gap-2">
                <button 
                  onClick={() => scrollHorizontally(bestProductsRef, 'left')}
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center text-gray-600"
                  aria-label="이전 상품"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button 
                  onClick={() => scrollHorizontally(bestProductsRef, 'right')}
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center text-gray-600"
                  aria-label="다음 상품"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
            <div 
              ref={bestProductsRef} 
              className="flex overflow-x-auto scrollbar-hide gap-4 pb-4"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {bestProducts.map(product => (
                <Link 
                  key={product.id}
                  to={`/shopping/product/${product.id}`} 
                  className="border border-gray-200 rounded-lg overflow-hidden flex-shrink-0 transition-transform hover:scale-[1.02] hover:shadow-md"
                  style={{ width: '250px' }}
                >
                  <div className="h-48 bg-gray-100 relative">
                    <ProductImage 
                      image={product.image} 
                      productName={product.productName} 
                      category={product.category} 
                    />
                    <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                      {getCategoryName(product.category)}
                    </div>
                    
                    {/* 찜하기 버튼 */}
                    <button 
                      onClick={(e: React.MouseEvent) => {
                        e.preventDefault();
                        if (!isLoggedIn) {
                          alert('로그인이 필요한 서비스입니다.');
                          return;
                        }
                        handleWishlistClick(e, product.id);
                      }}
                      className="absolute top-2 left-2 p-2 bg-white rounded-full shadow-md"
                    >
                      {product.favorite ? (
                        <svg className="w-5 h-5 text-rose-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <div className="p-3">
                    <h4 className="font-medium text-sm">{product.productName}</h4>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-black font-bold text-sm">
                        {product.price ? Number(product.price).toLocaleString() + '원' : '가격 정보 없음'}
                      </span>
                      {/* 별점 표시 */}
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="ml-1 text-sm text-gray-600">{product.star.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 가격대별 필터 */}
      <div className="py-8 bg-gray-50 w-full">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-4 mb-4">
            {PRICE_RANGES.map(range => (
              <button 
                key={range.id}
                className={`px-4 py-1 border rounded-md text-sm transition-colors ${
                  selectedPriceRange === range.id 
                    ? 'bg-pink-100 text-pink-600 border-pink-300 font-medium shadow-sm' 
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => handlePriceRangeSelect(range.id === 1 ? null : range.id)}
              >
                {range.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 지금 뜨는 상품 섹션 */}
      {trendingProducts.length > 0 && (
        <div className="py-12 w-full border-b border-gray-100">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold">지금 뜨는 상품</h3>
                <p className="text-gray-500 text-sm mt-1">많은 사람들이 지금 이 상품을 찾고 있어요!</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => scrollHorizontally(trendingProductsRef, 'left')}
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center text-gray-600"
                  aria-label="이전 상품"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button 
                  onClick={() => scrollHorizontally(trendingProductsRef, 'right')}
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center text-gray-600"
                  aria-label="다음 상품"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div 
              ref={trendingProductsRef}
              className="flex overflow-x-auto scrollbar-hide gap-4 pb-4"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {trendingProducts.map((product, index) => (
                <Link 
                  key={product.id} 
                  to={`/shopping/product/${product.id}`}
                  className="border border-gray-200 rounded-lg overflow-hidden flex-shrink-0 transition-transform hover:scale-[1.02] hover:shadow-md bg-white relative"
                  style={{ width: '300px' }}
                >
                  <div className="h-48 bg-gray-100 relative">
                    <ProductImage 
                      image={product.image} 
                      productName={product.productName} 
                      category={product.category} 
                    />
                    
                    {/* 순위 배지는 오른쪽으로 이동 */}
                    <div className="absolute top-3 right-3 bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold">
                      {index + 1}
                    </div>

                    {/* 찜하기 버튼 왼쪽으로 이동 */}
                    <button 
                      onClick={(e: React.MouseEvent) => {
                        e.preventDefault();
                        if (!isLoggedIn) {
                          alert('로그인이 필요한 서비스입니다.');
                          return;
                        }
                        handleWishlistClick(e, product.id);
                      }}
                      className="absolute top-2 left-2 p-2 bg-white rounded-full shadow-md"
                    >
                      {product.favorite ? (
                        <svg className="w-5 h-5 text-rose-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-base">{product.productName}</h4>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-black font-bold text-lg">
                        {product.price ? Number(product.price).toLocaleString() + '원' : '가격 정보 없음'}
                      </span>
                      {/* 별점 표시 */}
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="ml-1 text-sm text-gray-600">{product.star.toFixed(1)}</span>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 mr-1">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span>인기 급상승 중</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 모든 상품 그리드 - 무한 스크롤 적용 */}
      <div className="py-12 w-full bg-gray-50" ref={allProductsRef}>
        <div className="container mx-auto px-4">
          {/* 필터 상태 표시 */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-bold">모든 상품</h3>
              {(selectedCategory || selectedPriceRange) && (
                <div className="mt-2 text-sm text-gray-600 flex items-center">
                  <span>현재 필터: {getFilterStatusText()}</span>
                  <button 
                    onClick={resetAllFilters}
                    className="ml-2 text-pink-500 hover:text-pink-700"
                  >
                    초기화
                  </button>
                </div>
              )}
            </div>
            
            {/* 필터링된 상품 개수 표시 */}
            <div className="text-sm text-gray-500">
              총 {products.length}개 상품
            </div>
          </div>

          {loading && displayedProducts.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
            </div>
          ) : displayedProducts.length > 0 ? (
            <>
              <div 
                className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8"
              >
                {displayedProducts.map(product => (
                  <Link 
                    key={product.id} 
                    to={`/shopping/product/${product.id}`}
                    className="border border-gray-200 rounded-lg overflow-hidden bg-white transition-transform hover:scale-[1.02] hover:shadow-md"
                  >
                    <div className="relative h-48 md:h-64 bg-gray-100">
                      <ProductImage 
                        image={product.image} 
                        productName={product.productName} 
                        category={product.category} 
                      />
                      <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                        {getCategoryName(product.category)}
                      </div>
                      
                      {/* 찜하기 버튼 */}
                      <button 
                        onClick={(e: React.MouseEvent) => {
                          e.preventDefault();
                          if (!isLoggedIn) {
                            alert('로그인이 필요한 서비스입니다.');
                            return;
                          }
                          handleWishlistClick(e, product.id);
                        }}
                        className="absolute top-2 left-2 p-2 bg-white rounded-full shadow-md"
                      >
                        {product.favorite ? (
                          <svg className="w-5 h-5 text-rose-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        )}
                      </button>
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold text-base">{product.productName}</h4>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-black font-bold text-lg">
                          {product.price ? Number(product.price).toLocaleString() + '원' : '가격 정보 없음'}
                        </span>
                        {/* 별점 표시 */}
                        <div className="flex items-center">
                          <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="ml-1 text-sm text-gray-600">{product.star.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              
              {/* 무한 스크롤 로딩 인디케이터 */}
              <div ref={loadingRef} className="py-4 flex justify-center">
                {loading && hasMore && (
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pink-500"></div>
                )}
                {!hasMore && displayedProducts.length > 0 && (
                  <div className="text-center text-gray-500 my-4">
                    모든 상품을 확인하셨습니다.
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center text-gray-500 my-8 py-12 bg-white rounded-lg shadow-sm">
              <p className="text-lg">선택한 필터에 맞는 상품이 없습니다.</p>
              <p className="mt-2">다른 카테고리를 선택하거나 필터를 해제해보세요.</p>
              <button 
                onClick={resetAllFilters}
                className="mt-4 px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors"
              >
                필터 초기화
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* 맨 위로 가기 버튼 */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 bg-pink-500 text-white p-3 rounded-full shadow-lg hover:bg-pink-600 transition-colors"
        aria-label="맨 위로 가기"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>

      {/* 계좌 생성 모달 */}
      <AccountCreationModal 
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        onSubmit={handleAccountCreation}
      />
      
      {/* 충전 모달 */}
      <ChargeModal
        isOpen={isChargeModalOpen}
        onClose={() => setIsChargeModalOpen(false)}
      />
    </div>
  );
};

export default MainShopping;