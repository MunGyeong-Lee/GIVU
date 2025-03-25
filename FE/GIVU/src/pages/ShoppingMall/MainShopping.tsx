import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';

// .env 파일에서 기본 URL 가져오기
const API_BASE_URL = import.meta.env.VITE_BASE_URL;

// API 응답 타입에 맞게 수정된 상품 인터페이스
interface Product {
  id: number;
  productName: string;
  price: number;
  image: string;
  favorite: number;
  star: number;
  description: string;
  createdAt: string;
  payments: any[];
  category: string;
}

// 카테고리 정의 (API에서 받아온 카테고리 종류에 맞게 정의)
const CATEGORIES = [
  { id: 1, name: "전체", icon: "🏠", value: null },
  { id: 2, name: "전자기기", icon: "📱", value: "ELECTRONICS" },
  { id: 3, name: "패션/의류", icon: "👕", value: "FASHION" },
  { id: 4, name: "식품/음료", icon: "🍎", value: "FOOD" },
  { id: 5, name: "가정용품", icon: "🧹", value: "HOME" },
  { id: 6, name: "건강/뷰티", icon: "💄", value: "BEAUTY" },
  { id: 7, name: "스포츠/레저", icon: "⚽", value: "SPORTS" },
  { id: 8, name: "도서/문구", icon: "📚", value: "BOOKS" },
  { id: 9, name: "기타", icon: "🎁", value: "OTHER" }
];

// 가격대 필터 (필요 시 사용)
const PRICE_RANGES = [
  { id: 1, name: "가격대별" },
  { id: 2, name: "1만원 미만" },
  { id: 3, name: "1~3만원" },
  { id: 4, name: "3~5만원" },
  { id: 5, name: "5~10만원" },
  { id: 6, name: "10만원 이상" },
];

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
  const [itemsPerPage, setItemsPerPage] = useState(8); // 한 번에 보여줄 상품 수
  const [hasMore, setHasMore] = useState(true);
  
  // ref 정의
  const bestProductsRef = useRef<HTMLDivElement>(null);
  const productGridRef = useRef<HTMLDivElement>(null);
  const trendingProductsRef = useRef<HTMLDivElement>(null);
  const allProductsRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef<HTMLDivElement>(null); // 무한 스크롤 감지를 위한 ref

  // API에서 상품 목록 가져오기
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 카테고리 필터링 파라미터 추가
      const categoryParam = selectedCategory ? `&category=${selectedCategory}` : '';
      
      // API 호출
      const response = await axios.get(`${API_BASE_URL}/products/list?${categoryParam}`);
      
      console.log('API 응답:', response.data);
      
      // 데이터 처리
      const newProducts = response.data; // API 응답 구조에 따라 조정
      
      // 모든 상품 저장
      setProducts(newProducts);
      
      // 처음에는 일부만 표시
      setDisplayedProducts(newProducts.slice(0, itemsPerPage));
      
      // 더 불러올 상품이 있는지 확인
      setHasMore(newProducts.length > itemsPerPage);
      
      // 페이지 초기화
      setPage(1);
      
      // 베스트 상품과 인기 상품 설정
      if (newProducts.length > 0) {
        // 가격 기준으로 정렬하여 상위 제품 선택
        const sortedByPrice = [...newProducts].sort((a, b) => b.price - a.price);
        setBestProducts(sortedByPrice.slice(0, 8));
        
        // 임의로 인기 상품 선택
        setTrendingProducts(newProducts.slice(0, 5));
      }
      
    } catch (err) {
      console.error('상품을 불러오는 중 오류가 발생했습니다:', err);
      setError('상품을 불러오는데 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  // 더 많은 상품 로드하기
  const loadMoreProducts = () => {
    if (!hasMore || loading) return;
    
    // 다음 페이지 계산
    const nextPage = page + 1;
    const startIndex = page * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    // 표시할 추가 상품이 있는지 확인
    if (startIndex >= products.length) {
      setHasMore(false);
      return;
    }
    
    // 로딩 표시
    setLoading(true);
    
    // 로딩 효과를 위한 지연 (실제 API 호출 시에는 필요 없음)
    setTimeout(() => {
      // 새로운 상품 추가
      const newDisplayedProducts = [
        ...displayedProducts,
        ...products.slice(startIndex, endIndex)
      ];
      
      setDisplayedProducts(newDisplayedProducts);
      setPage(nextPage);
      
      // 더 로드할 상품이 있는지 확인
      setHasMore(endIndex < products.length);
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
    fetchProducts();
  }, []);
  
  // 카테고리 변경 시 상품 다시 가져오기
  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  // 카테고리 선택 핸들러
  const handleCategorySelect = (categoryValue: string | null) => {
    setSelectedCategory(categoryValue);
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

  // 카테고리 이름 가져오기 유틸 함수
  const getCategoryName = (categoryValue: string) => {
    const category = CATEGORIES.find(cat => cat.value === categoryValue);
    return category ? category.name : categoryValue;
  };
  
  // 카테고리 아이콘 가져오기 유틸 함수
  const getCategoryIcon = (categoryValue: string) => {
    const category = CATEGORIES.find(cat => cat.value === categoryValue);
    return category ? category.icon : "🏷️";
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
                    {product.image ? (
                      <img 
                        src={product.image} 
                        alt={product.productName} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <span className="text-3xl">{getCategoryIcon(product.category)}</span>
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                      {getCategoryName(product.category)}
                    </div>
                  </div>
                  <div className="p-3">
                    <h4 className="font-medium text-sm">{product.productName}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-black font-bold text-sm">
                        {product.price ? Number(product.price).toLocaleString() + '원' : '가격 정보 없음'}
                      </span>
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
                className="px-4 py-1 bg-white border border-gray-200 rounded-md text-sm"
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
                  {/* 인기 순위 배지 */}
                  <div className="absolute top-3 left-3 bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold">
                    {index + 1}
                  </div>
                  <div className="h-48 bg-gray-100">
                    {product.image ? (
                      <img 
                        src={product.image} 
                        alt={product.productName} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <span className="text-3xl">{getCategoryIcon(product.category)}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-base">{product.productName}</h4>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-black font-bold text-lg">
                        {product.price ? Number(product.price).toLocaleString() + '원' : '가격 정보 없음'}
                      </span>
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
                    onClick={() => {
                      setSelectedCategory(null);
                      setSelectedPriceRange(null);
                    }}
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
                      {product.image ? (
                        <img 
                          src={product.image} 
                          alt={product.productName} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <span className="text-4xl">{getCategoryIcon(product.category)}</span>
                        </div>
                      )}
                      <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                        {getCategoryName(product.category)}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium mb-2 text-sm md:text-base">{product.productName}</h3>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-black font-bold text-sm md:text-base">
                          {product.price ? Number(product.price).toLocaleString() + '원' : '가격 정보 없음'}
                        </span>
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
                onClick={() => {
                  setSelectedCategory(null);
                  setSelectedPriceRange(null);
                }}
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
    </div>
  );
};

export default MainShopping;