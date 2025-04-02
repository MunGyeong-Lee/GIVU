import React, { useState, useEffect, useRef } from 'react';
import './Step1Products.css'; // CSS 파일 추가
import { useProductsList } from '../../hooks/useProductQueries';
import { Product } from '../../services/product.service';

interface Step1ProductsProps {
  selectedProduct: Partial<Product>;
  updateSelectedProduct: (product: Product) => void;
  onNext: () => void;
}

// 카테고리 매핑 및 아이콘
const CATEGORIES = [
  { id: 1, name: "전체", icon: "🏠", value: "전체" },
  { id: 2, name: "전자기기", icon: "📱", value: "전자기기" },
  { id: 3, name: "패션/의류", icon: "👕", value: "패션/의류" },
  { id: 4, name: "식품/음료", icon: "🍎", value: "식품/음료" },
  { id: 5, name: "가정용품", icon: "🧹", value: "가정용품" },
  { id: 6, name: "가구/인테리어", icon: "🪑", value: "가구/인테리어" },
  { id: 7, name: "건강/뷰티", icon: "💄", value: "건강/뷰티" },
  { id: 8, name: "스포츠/레저", icon: "⚽", value: "스포츠/레저" },
  { id: 9, name: "도서/문구", icon: "📚", value: "도서/문구" },
  { id: 10, name: "기타", icon: "🎁", value: "기타" }
];

const Step1Products: React.FC<Step1ProductsProps> = ({
  selectedProduct,
  updateSelectedProduct,
  onNext
}) => {
  // 쿼리 파라미터 상태
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [isWishlist, setIsWishlist] = useState(false);

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const categoryRef = useRef<HTMLDivElement>(null);

  const ITEMS_PER_PAGE = 15; // 한 번에 표시할 상품 수를 15개로 변경

  // React Query를 사용하여 상품 데이터 로드
  const {
    data: allProducts = [],
    isLoading: initialLoading,
    error: queryError
  } = useProductsList();

  // 검색어, 카테고리, 위시리스트 필터링을 위한 상태
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);

  // React Query 데이터 에러 처리
  useEffect(() => {
    if (queryError) {
      setError('상품을 불러오는데 실패했습니다. 다시 시도해주세요.');
      setFilteredProducts([]);
      setDisplayedProducts([]);
      setTotalPages(1);
    }
  }, [queryError]);

  // React Query 데이터 초기 설정
  useEffect(() => {
    if (allProducts.length > 0) {
      setFilteredProducts(allProducts);
      setDisplayedProducts(allProducts.slice(0, ITEMS_PER_PAGE));
      setTotalPages(Math.ceil(allProducts.length / ITEMS_PER_PAGE));
    }
  }, [allProducts]);

  // 검색어와 카테고리에 따라 상품 필터링
  useEffect(() => {
    if (allProducts.length === 0) return;

    let filtered = [...allProducts];

    // 검색어 필터링
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.productName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 카테고리 필터링
    if (selectedCategory !== '전체') {
      filtered = filtered.filter(product =>
        product.category === selectedCategory
      );
    }

    // 위시리스트만 보기 (실제 API 연동 필요)
    if (isWishlist) {
      // 임시로 즐겨찾기된 상품만 필터링
      filtered = filtered.filter(product => product.favorite);
    }

    setFilteredProducts(filtered);
    setCurrentPage(1); // 필터링 시 첫 페이지로 이동
    setTotalPages(Math.ceil(filtered.length / ITEMS_PER_PAGE));
    setDisplayedProducts(filtered.slice(0, ITEMS_PER_PAGE));
  }, [searchQuery, selectedCategory, isWishlist, allProducts]);

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;

    setLoading(true);
    const startIdx = (page - 1) * ITEMS_PER_PAGE;
    const endIdx = startIdx + ITEMS_PER_PAGE;

    // 약간의 지연효과 (UI 경험 향상)
    setTimeout(() => {
      setDisplayedProducts(filteredProducts.slice(startIdx, endIdx));
      setCurrentPage(page);
      setLoading(false);
      // 상품 목록 영역으로 스크롤
      const productListElement = document.querySelector('.product-list');
      if (productListElement) {
        productListElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 300);
  };

  // 상품 선택 함수
  const handleSelectProduct = (product: Product) => {
    console.log("상품 선택:", product.id, product.productName);

    // 이전 선택 상품과 다른 경우에만 처리
    if (selectedProduct.id !== product.id) {
      updateSelectedProduct(product);
    } else {
      // 이미 선택된 상품 선택 취소
      updateSelectedProduct({} as Product);
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

  // 맨 위로 버튼 구현
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 페이지네이션 컴포넌트
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    const maxVisiblePages = 10; // 한 번에 표시할 최대 페이지 수를 10개로 변경

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex justify-center items-center mt-8 space-x-1">
        {/* 처음 페이지 버튼 */}
        <button
          className={`p-2 rounded-lg transition-all duration-200 ${currentPage === 1
            ? 'text-gray-300 cursor-not-allowed'
            : 'text-gray-600 hover:bg-gray-100 hover:text-primary-color'
            }`}
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          aria-label="처음 페이지로"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>

        {/* 이전 페이지 버튼 */}
        <button
          className={`p-2 rounded-lg transition-all duration-200 ${currentPage === 1
            ? 'text-gray-300 cursor-not-allowed'
            : 'text-gray-600 hover:bg-gray-100 hover:text-primary-color'
            }`}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="이전 페이지로"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* 페이지 번호 버튼 */}
        {pageNumbers.map(number => (
          <button
            key={number}
            className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-200 ${number === currentPage
              ? 'bg-primary-color text-white shadow-md hover:bg-primary-color/90'
              : 'text-gray-600 hover:bg-gray-100 hover:text-primary-color'
              }`}
            onClick={() => handlePageChange(number)}
            aria-label={`${number} 페이지로 이동`}
            aria-current={number === currentPage ? 'page' : undefined}
          >
            {number}
          </button>
        ))}

        {/* 다음 페이지 버튼 */}
        <button
          className={`p-2 rounded-lg transition-all duration-200 ${currentPage === totalPages
            ? 'text-gray-300 cursor-not-allowed'
            : 'text-gray-600 hover:bg-gray-100 hover:text-primary-color'
            }`}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="다음 페이지로"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* 마지막 페이지 버튼 */}
        <button
          className={`p-2 rounded-lg transition-all duration-200 ${currentPage === totalPages
            ? 'text-gray-300 cursor-not-allowed'
            : 'text-gray-600 hover:bg-gray-100 hover:text-primary-color'
            }`}
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          aria-label="마지막 페이지로"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    );
  };

  return (
    <div className="p-6">
      {/* 헤더 영역 */}
      <div className="mb-8 text-center border-b pb-6">
        <h2 className="text-2xl font-bold mb-2">상품선택</h2>
        <p className="text-gray-600 max-w-xl mx-auto">
          원하는 상품을 선택하면 펀딩 정보가 자동으로 설정됩니다.
        </p>
        <p className="text-gray-600 max-w-xl mx-auto">
          선물받고 싶은 상품을 찾아 선택해주세요.
        </p>
      </div>

      {/* 카테고리 영역 - 한 줄 가로 스크롤 */}
      <div className="mb-8 relative">
        {/* 왼쪽 스크롤 버튼 */}
        <button
          onClick={() => scrollCategory('left')}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full shadow-md p-1"
          aria-label="카테고리 왼쪽으로 스크롤"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>

        {/* 카테고리 가로 스크롤 */}
        <div
          ref={categoryRef}
          className="flex overflow-x-auto scrollbar-hide space-x-2 py-2 px-6"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {CATEGORIES.map(category => (
            <div
              key={category.id}
              className={`flex items-center flex-shrink-0 cursor-pointer transition-all px-3 py-1.5 rounded-full text-xs sm:text-sm ${selectedCategory === category.value
                ? 'bg-primary-color text-white font-medium shadow-sm'
                : 'hover:bg-gray-100 border border-gray-200'
                }`}
              onClick={() => setSelectedCategory(category.value)}
            >
              <span className="mr-1">{category.icon}</span>
              <span className="whitespace-nowrap">{category.name}</span>
            </div>
          ))}
        </div>

        {/* 오른쪽 스크롤 버튼 */}
        <button
          onClick={() => scrollCategory('right')}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full shadow-md p-1"
          aria-label="카테고리 오른쪽으로 스크롤"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* 검색 및 위시리스트 영역 */}
      <div className="mb-8 bg-gray-50 p-4 rounded-lg">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* 검색창 */}
          <div className="flex-grow">
            <div className="relative">
              <input
                type="text"
                placeholder="상품명으로 검색하기"
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-color focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute left-3 top-3 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              {searchQuery && (
                <button
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  onClick={() => setSearchQuery('')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* 위시리스트 체크박스 */}
          <div>
            <label
              className={`flex items-center px-4 py-2 rounded-lg cursor-pointer transition-all ${isWishlist ? 'bg-primary-color/10 border border-primary-color text-primary-color' : 'bg-white border border-gray-200 hover:bg-gray-50 text-gray-700'}`}
            >
              <input
                type="checkbox"
                className="sr-only"
                checked={isWishlist}
                onChange={() => setIsWishlist(!isWishlist)}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 mr-2 ${isWishlist ? 'text-primary-color' : 'text-gray-400'}`}
                fill={isWishlist ? "currentColor" : "none"}
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={isWishlist ? 0 : 2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              내 위시리스트만 보기
            </label>
          </div>
        </div>
      </div>

      {/* 상품 목록 */}
      <div className="mb-8 product-list">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">상품 목록</h3>
          {!initialLoading && filteredProducts.length > 0 && (
            <p className="text-sm text-gray-500">
              총 {filteredProducts.length}개 상품 중 {Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)}개 표시
            </p>
          )}
        </div>

        {initialLoading ? (
          <div className="flex justify-center items-center py-20 bg-gray-50 rounded-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-color"></div>
            <span className="ml-3 text-gray-600">상품을 불러오는 중...</span>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-12 bg-red-50 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-lg font-medium">{error}</p>
            <button
              className="mt-4 px-6 py-2 bg-primary-color text-white rounded-md hover:bg-opacity-90 shadow-sm"
              onClick={() => window.location.reload()}
            >
              다시 시도
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center text-gray-500 py-12 bg-gray-50 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-lg font-medium">상품이 없습니다</p>
            <p className="mt-2 text-sm">다른 카테고리를 선택하거나 검색어를 변경해보세요.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {displayedProducts.map(product => (
                <div
                  key={product.id}
                  className={`product-card bg-white border rounded-lg overflow-hidden cursor-pointer transition-all duration-200 shadow-sm h-full focus:outline-none focus:ring-0 ${selectedProduct.id === product.id
                    ? 'ring-2 ring-primary-color border-primary-color shadow-lg outline-none'
                    : 'hover:shadow-md hover:border-gray-200'
                    }`}
                  onClick={() => {
                    // 이미 선택된 상품을 다시 클릭하면 선택 취소
                    if (selectedProduct.id === product.id) {
                      updateSelectedProduct({} as Product);
                    } else {
                      handleSelectProduct(product);
                    }
                  }}
                  tabIndex={0}
                  style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      if (selectedProduct.id === product.id) {
                        updateSelectedProduct({} as Product);
                      } else {
                        handleSelectProduct(product);
                      }
                    }
                  }}
                >
                  <div className="h-44 w-full overflow-hidden bg-gray-50 relative">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.productName}
                        className="h-full w-full object-contain"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/150';
                        }}
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    {/* 카테고리 뱃지 */}
                    <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md">
                      {product.category}
                    </div>
                    {/* 즐겨찾기 아이콘 */}
                    {product.favorite && (
                      <div className="absolute top-2 left-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 drop-shadow-sm" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h4 className="font-medium text-gray-800 truncate mb-1 text-sm">
                      {product.productName}
                    </h4>
                    <p className="text-primary-color font-bold">
                      {product.price?.toLocaleString()}원
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* 로딩 인디케이터 */}
            {loading && (
              <div className="flex justify-center items-center py-4 mt-6">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary-color"></div>
                <span className="ml-2 text-gray-600 text-sm">불러오는 중...</span>
              </div>
            )}

            {/* 페이지네이션 */}
            {!loading && renderPagination()}

            {/* 모든 상품 표시 완료 메시지 */}
            {!loading && currentPage === totalPages && filteredProducts.length > 0 && (
              <div className="text-center text-gray-500 mt-6 py-3 bg-gray-50 rounded-lg">
                <p className="text-sm">모든 상품을 불러왔습니다.</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* 선택된 상품 정보 */}
      {selectedProduct.id && (
        <div className="border border-primary-color/20 rounded-lg p-6 mb-8 bg-primary-color/5 shadow-sm">
          <h3 className="text-lg font-bold mb-4 text-primary-color">선택된 상품 정보</h3>
          <div className="flex flex-col md:flex-row items-start">
            <div className="w-full md:w-24 h-24 bg-gray-100 flex items-center justify-center mr-6 mb-4 md:mb-0 rounded-md overflow-hidden">
              {selectedProduct.image ? (
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.productName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/150';
                  }}
                />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              )}
            </div>
            <div className="flex-grow">
              <div className="mb-1">
                <span className="text-gray-500 text-sm">상품명</span>
                <p className="font-semibold text-gray-900 text-lg">{selectedProduct.productName}</p>
              </div>
              <div className="flex flex-wrap gap-6 mt-3">
                <div>
                  <span className="text-gray-500 text-sm">가격</span>
                  <p className="font-bold text-gray-900">{selectedProduct.price?.toLocaleString()}원</p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">카테고리</span>
                  <p className="font-medium text-gray-900">{selectedProduct.category}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 버튼 */}
      <div className="flex justify-end">
        <button
          className={`px-8 py-3 rounded-lg text-white font-medium shadow-sm transition-all transform hover:translate-y-[-2px] ${!selectedProduct.id
            ? 'bg-gray-300 cursor-not-allowed opacity-70'
            : 'bg-primary-color hover:bg-primary-color/90'
            }`}
          onClick={onNext}
          disabled={!selectedProduct.id}
        >
          다음 단계로
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block ml-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* 맨 위로 버튼 (일정량 이상 스크롤 했을 때만 표시) */}
      {displayedProducts.length > ITEMS_PER_PAGE && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-primary-color text-white p-2 rounded-full shadow-lg hover:bg-primary-color/90 transition-colors"
          aria-label="맨 위로 가기"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Step1Products;
