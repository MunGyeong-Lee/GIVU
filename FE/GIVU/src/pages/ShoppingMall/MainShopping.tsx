import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";

// 카테고리 데이터
const CATEGORIES = [
  { id: 1, name: "가전/디지털" },
  { id: 2, name: "문구/오피스" },
  { id: 3, name: "생활용품" },
  { id: 4, name: "완구/취미" },
  { id: 5, name: "헬스/건강식품" },
  { id: 6, name: "출산/유아동" },
];

// 상품 데이터
const PRODUCTS = [
  { 
    id: 1, 
    name: "도현이의 노란 텐트", 
    price: 29000, 
    category: "홈인/리빙", 
    imageUrl: "https://via.placeholder.com/200x200?text=노란+텐트", 
    discount: 0 
  },
  { 
    id: 2, 
    name: "도현이의 노란 텐트", 
    price: 29000, 
    category: "홈인/리빙", 
    imageUrl: "https://via.placeholder.com/200x200?text=노란+텐트", 
    discount: 0 
  },
  { 
    id: 3, 
    name: "도현이의 노란 텐트", 
    price: 29000, 
    category: "홈인/리빙", 
    imageUrl: "https://via.placeholder.com/200x200?text=노란+텐트", 
    discount: 0 
  },
  { 
    id: 4, 
    name: "도현이의 노란 텐트", 
    price: 29000, 
    category: "홈인/리빙", 
    imageUrl: "https://via.placeholder.com/200x200?text=노란+텐트", 
    discount: 0 
  },
  { 
    id: 5, 
    name: "에어팟 프로 2", 
    price: 359000, 
    category: "가전/디지털", 
    imageUrl: "https://via.placeholder.com/200x200?text=에어팟+프로", 
    discount: 10 
  },
  { 
    id: 6, 
    name: "애플 에어팟 맥스", 
    price: 769000, 
    category: "가전/디지털", 
    imageUrl: "https://via.placeholder.com/200x200?text=에어팟+맥스", 
    discount: 5 
  },
  { 
    id: 7, 
    name: "다이슨 헤어 드라이어", 
    price: 499000, 
    category: "뷰티/코스메틱", 
    imageUrl: "https://via.placeholder.com/200x200?text=다이슨+드라이어", 
    discount: 15 
  },
  { 
    id: 8, 
    name: "친환경 대나무 칫솔", 
    price: 5000, 
    category: "생활용품", 
    imageUrl: "https://via.placeholder.com/200x200?text=대나무+칫솔", 
    discount: 0 
  },
];

// 더 많은 상품 데이터 추가
const EXTENDED_PRODUCTS = [
  ...PRODUCTS,
  { 
    id: 9, 
    name: "삼성 갤럭시 버즈 프로", 
    price: 219000, 
    category: "가전/디지털", 
    imageUrl: "https://via.placeholder.com/200x200?text=갤럭시+버즈", 
    discount: 20 
  },
  { 
    id: 10, 
    name: "소니 WH-1000XM4", 
    price: 429000, 
    category: "가전/디지털", 
    imageUrl: "https://via.placeholder.com/200x200?text=소니+헤드폰", 
    discount: 10 
  },
  { 
    id: 11, 
    name: "애플 맥북 프로", 
    price: 2490000, 
    category: "가전/디지털", 
    imageUrl: "https://via.placeholder.com/200x200?text=맥북+프로", 
    discount: 5 
  },
  { 
    id: 12, 
    name: "샤오미 공기청정기", 
    price: 129000, 
    category: "가전/디지털", 
    imageUrl: "https://via.placeholder.com/200x200?text=공기청정기", 
    discount: 15 
  },
  { 
    id: 13, 
    name: "LG 그램 노트북", 
    price: 1790000, 
    category: "가전/디지털", 
    imageUrl: "https://via.placeholder.com/200x200?text=LG+그램", 
    discount: 7 
  },
  { 
    id: 14, 
    name: "삼성 갤럭시 Z 폴드", 
    price: 1990000, 
    category: "가전/디지털", 
    imageUrl: "https://via.placeholder.com/200x200?text=갤럭시+폴드", 
    discount: 12 
  },
  { 
    id: 15, 
    name: "애플 아이패드 프로", 
    price: 1290000, 
    category: "가전/디지털", 
    imageUrl: "https://via.placeholder.com/200x200?text=아이패드+프로", 
    discount: 8 
  }
];

// 배너 슬라이더에 사용할 메인 상품 데이터
const MAIN_BANNER_PRODUCTS = [
  {
    id: 1,
    name: "애플 에어팟 맥스",
    description: "고품질 사운드와 액티브 노이즈 캔슬링을 갖춘 프리미엄 헤드폰",
    price: 769000,
    imageUrl: "https://via.placeholder.com/800x500?text=에어팟+맥스",
    discount: 5,
    bgColor: "bg-gradient-to-r from-black to-gray-800",
    icon: "🎧"
  },
  {
    id: 2,
    name: "다이슨 헤어 드라이어",
    description: "열 손상 없이 빠르게 드라이 가능한 혁신적인 헤어 드라이어",
    price: 499000,
    imageUrl: "https://via.placeholder.com/800x500?text=다이슨+드라이어",
    discount: 15,
    bgColor: "bg-gradient-to-r from-purple-900 to-pink-700",
    icon: "💨"
  },
  {
    id: 3,
    name: "애플 맥북 프로",
    description: "압도적인 성능과 배터리 수명을 갖춘 최신형 노트북",
    price: 2490000,
    imageUrl: "https://via.placeholder.com/800x500?text=맥북+프로",
    discount: 5,
    bgColor: "bg-gradient-to-r from-blue-900 to-indigo-800",
    icon: "💻"
  }
];

// 가격대 필터 옵션
const PRICE_RANGES = [
  { id: 1, name: "가격대별" },
  { id: 2, name: "1만원 미만" },
  { id: 3, name: "1~3만원" },
  { id: 4, name: "3~5만원" },
  { id: 5, name: "5~10만원" },
  { id: 6, name: "10만원 이상" },
];

// 베스트 상품
const BEST_PRODUCTS = EXTENDED_PRODUCTS.slice(4, 12);

// 지금 뜨는 상품
const TRENDING_PRODUCTS = [
  EXTENDED_PRODUCTS[6], // 다이슨 헤어 드라이어
  EXTENDED_PRODUCTS[12], // LG 그램
  EXTENDED_PRODUCTS[14], // 아이패드 프로
  EXTENDED_PRODUCTS[5], // 에어팟 맥스
  EXTENDED_PRODUCTS[13] // 갤럭시 폴드
];

const MainShopping = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  
  const filteredProducts = selectedCategory 
    ? EXTENDED_PRODUCTS.filter(product => product.category === selectedCategory)
    : EXTENDED_PRODUCTS;

  const bestProductsRef = useRef<HTMLDivElement>(null);
  const productGridRef = useRef<HTMLDivElement>(null);
  const trendingProductsRef = useRef<HTMLDivElement>(null);
  const mainBannerRef = useRef<HTMLDivElement>(null);

  // 타입 정의 간소화
  const scrollHorizontally = (ref: any, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = 300; // 스크롤 양
      const scrollLeft = direction === 'left' 
        ? ref.current.scrollLeft - scrollAmount 
        : ref.current.scrollLeft + scrollAmount;
      
      ref.current.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      });
    }
  };

  // 배너 슬라이드 이동 함수
  const changeBanner = (direction: 'left' | 'right') => {
    if (direction === 'left') {
      setCurrentBannerIndex(prev => 
        prev === 0 ? MAIN_BANNER_PRODUCTS.length - 1 : prev - 1
      );
    } else {
      setCurrentBannerIndex(prev => 
        (prev + 1) % MAIN_BANNER_PRODUCTS.length
      );
    }
  };

  // 자동 슬라이드 효과
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex(prev => 
        (prev + 1) % MAIN_BANNER_PRODUCTS.length
      );
    }, 5000); // 5초마다 변경
    
    return () => clearInterval(interval);
  }, []);

  const currentBanner = MAIN_BANNER_PRODUCTS[currentBannerIndex];

  return (
    <div className="w-full">
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
          {/* <button className="px-4 py-1 border border-gray-300 rounded-md">이문동</button> */}
        </div>
      </header>

      {/* 메인 배너 슬라이더 */}
      <div 
        className={`w-full relative h-[400px] md:h-[500px] overflow-hidden transition-all duration-500 ease-in-out ${currentBanner.bgColor}`}
      >
        <div className="container mx-auto h-full relative">
          {/* 왼쪽 화살표 */}
          <button 
            onClick={() => changeBanner('left')}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-white/50 hover:bg-white/80 rounded-full w-10 h-10 flex items-center justify-center text-gray-800"
            aria-label="이전 상품"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          {/* 배너 콘텐츠 */}
          <div className="flex h-full items-center justify-between px-4 md:px-0">
            <div className="z-10 max-w-lg text-white">
              <h2 className="text-3xl md:text-5xl font-bold mb-2 drop-shadow-md">{currentBanner.name}</h2>
              <p className="text-lg md:text-xl mb-4 opacity-90 drop-shadow-md">{currentBanner.description}</p>
              <div className="flex items-center gap-3 mb-6">
                {currentBanner.discount > 0 && (
                  <span className="text-white/80 line-through text-lg">
                    {currentBanner.price.toLocaleString()}원
                  </span>
                )}
                <span className="text-white font-bold text-2xl">
                  {(currentBanner.price * (100 - currentBanner.discount) / 100).toLocaleString()}원
                </span>
                {currentBanner.discount > 0 && (
                  <span className="bg-orange-500 text-white text-sm font-bold px-2 py-1 rounded-full">
                    {currentBanner.discount}% 할인
                  </span>
                )}
              </div>
              <button className="px-6 py-3 bg-white text-black font-bold rounded-md hover:bg-white/90 transition-colors">
                자세히 보기
              </button>
            </div>
            <div className="hidden md:flex items-center justify-center">
              {/* 이미지가 없어도 멋진 디자인을 보여주는 대체 요소 */}
              <div className="relative w-[400px] h-[400px] flex items-center justify-center">
                <div className="absolute w-full h-full rounded-full bg-white/10 animate-pulse"></div>
                <div className="absolute w-[300px] h-[300px] rounded-full bg-white/20 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                <div className="absolute w-[200px] h-[200px] rounded-full bg-white/30 animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="text-[120px] drop-shadow-lg">{currentBanner.icon}</div>
              </div>
            </div>
          </div>
          
          {/* 오른쪽 화살표 */}
          <button 
            onClick={() => changeBanner('right')}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-white/50 hover:bg-white/80 rounded-full w-10 h-10 flex items-center justify-center text-gray-800"
            aria-label="다음 상품"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          {/* 인디케이터 점 */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {MAIN_BANNER_PRODUCTS.map((_, index) => (
              <button
                key={index}
                className={`w-2.5 h-2.5 rounded-full ${index === currentBannerIndex ? 'bg-white' : 'bg-white/50'}`}
                onClick={() => setCurrentBannerIndex(index)}
                aria-label={`배너 ${index + 1}로 이동`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 카테고리 영역 */}
      <div className="bg-white py-8 w-full">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {CATEGORIES.map(category => (
              <div key={category.id} className="flex flex-col items-center">
                <div className="w-16 h-16 bg-gray-100 rounded-lg mb-2 flex items-center justify-center">
                  <span className="text-xl">🛒</span>
                </div>
                <span className="text-sm text-center">{category.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 카테고리 필터 영역 */}
      <div className="py-8 border-t border-b border-gray-200 w-full">
        <div className="container mx-auto px-4">
          <h3 className="text-lg font-bold mb-4">카테고리별 추천</h3>
          <div className="flex flex-wrap gap-2 mb-6">
            <button className="px-4 py-1 bg-gray-100 rounded-md text-sm">생일선물</button>
            <button className="px-4 py-1 bg-gray-100 rounded-md text-sm">기념일</button>
            <button className="px-4 py-1 bg-gray-100 rounded-md text-sm">커플선물</button>
            <button className="px-4 py-1 bg-gray-100 rounded-md text-sm">친구선물</button>
            <button className="px-4 py-1 bg-gray-100 rounded-md text-sm">출산산선물</button>
          </div>
        </div>
      </div>

      {/* 베스트 상품 영역 - 가로 스크롤 */}
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
            {BEST_PRODUCTS.map(product => (
              <div 
                key={product.id} 
                className="border border-gray-200 rounded-lg overflow-hidden flex-shrink-0 transition-transform hover:scale-[1.02] hover:shadow-md"
                style={{ width: '250px' }}
              >
                <div className="h-48 bg-gray-100">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3">
                  <h4 className="font-medium text-sm">{product.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    {product.discount > 0 && (
                      <span className="text-gray-500 line-through text-xs">
                        {product.price.toLocaleString()}원
                      </span>
                    )}
                    <span className="text-black font-bold text-sm">
                      {(product.price * (100 - product.discount) / 100).toLocaleString()}원
                    </span>
                    {product.discount > 0 && (
                      <span className="text-orange-500 text-xs font-bold ml-auto">
                        {product.discount}% OFF
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

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
            {TRENDING_PRODUCTS.map((product, index) => (
              <div 
                key={product.id} 
                className="border border-gray-200 rounded-lg overflow-hidden flex-shrink-0 transition-transform hover:scale-[1.02] hover:shadow-md bg-white relative"
                style={{ width: '300px' }}
              >
                {/* 인기 순위 배지 */}
                <div className="absolute top-3 left-3 bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold">
                  {index + 1}
                </div>
                <div className="h-48 bg-gray-100">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-base">{product.name}</h4>
                  <div className="flex items-center gap-2 mt-2">
                    {product.discount > 0 && (
                      <span className="text-gray-500 line-through text-sm">
                        {product.price.toLocaleString()}원
                      </span>
                    )}
                    <span className="text-black font-bold text-lg">
                      {(product.price * (100 - product.discount) / 100).toLocaleString()}원
                    </span>
                    {product.discount > 0 && (
                      <span className="text-orange-500 text-xs font-bold ml-auto">
                        {product.discount}% 할인
                      </span>
                    )}
                  </div>
                  <div className="mt-4 flex items-center text-sm text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 mr-1">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>인기 급상승 중</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 상품 그리드 - 가로 스크롤 섹션으로 변경 */}
      <div className="py-12 w-full">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">추천 상품</h3>
            <div className="flex gap-2">
              <button 
                onClick={() => scrollHorizontally(productGridRef, 'left')}
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center text-gray-600"
                aria-label="이전 상품"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button 
                onClick={() => scrollHorizontally(productGridRef, 'right')}
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
            ref={productGridRef}
            className="flex overflow-x-auto scrollbar-hide gap-4 pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {filteredProducts.map(product => (
              <div 
                key={product.id} 
                className="border border-gray-200 rounded-lg overflow-hidden flex-shrink-0 transition-transform hover:scale-[1.02] hover:shadow-md"
                style={{ width: '250px' }}
              >
                <div className="relative h-48">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                  />
                  {product.discount > 0 && (
                    <span className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {product.discount}% 할인
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-medium mb-2 text-sm md:text-base">{product.name}</h3>
                  <div className="flex items-center gap-2 mb-4">
                    {product.discount > 0 && (
                      <span className="text-gray-500 line-through text-xs md:text-sm">
                        {product.price.toLocaleString()}원
                      </span>
                    )}
                    <span className="text-black font-bold text-sm md:text-base">
                      {(product.price * (100 - product.discount) / 100).toLocaleString()}원
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 기존 그리드 표시 형태도 유지 */}
      <div className="py-12 w-full bg-gray-50">
        <div className="container mx-auto px-4">
          <h3 className="text-xl font-bold mb-6">모든 상품</h3>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {filteredProducts.slice(0, 8).map(product => (
              <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                <div className="relative h-48 md:h-64">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                  />
                  {product.discount > 0 && (
                    <span className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
                      {product.discount}% 할인
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-medium mb-2 text-sm md:text-base">{product.name}</h3>
                  <div className="flex items-center gap-2 mb-4">
                    {product.discount > 0 && (
                      <span className="text-gray-500 line-through text-xs md:text-sm">
                        {product.price.toLocaleString()}원
                      </span>
                    )}
                    <span className="text-black font-bold text-sm md:text-base">
                      {(product.price * (100 - product.discount) / 100).toLocaleString()}원
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainShopping;