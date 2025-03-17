import React, { useState } from "react";
import { Link } from "react-router-dom";

// 임시 데이터
const CATEGORIES = [
  { id: 1, name: "의류" },
  { id: 2, name: "액세서리" },
  { id: 3, name: "생활용품" },
  { id: 4, name: "식품" },
  { id: 5, name: "기타" },
];

const PRODUCTS = [
  { id: 1, name: "친환경 에코백", price: 15000, category: "액세서리", imageUrl: "https://via.placeholder.com/200", discount: 10 },
  { id: 2, name: "유기농 티셔츠", price: 25000, category: "의류", imageUrl: "https://via.placeholder.com/200", discount: 0 },
  { id: 3, name: "재활용 노트북", price: 8000, category: "생활용품", imageUrl: "https://via.placeholder.com/200", discount: 15 },
  { id: 4, name: "대나무 칫솔", price: 5000, category: "생활용품", imageUrl: "https://via.placeholder.com/200", discount: 0 },
  { id: 5, name: "유기농 과자", price: 3500, category: "식품", imageUrl: "https://via.placeholder.com/200", discount: 5 },
  { id: 6, name: "친환경 물병", price: 12000, category: "생활용품", imageUrl: "https://via.placeholder.com/200", discount: 0 },
  { id: 7, name: "재활용 팔찌", price: 9000, category: "액세서리", imageUrl: "https://via.placeholder.com/200", discount: 0 },
  { id: 8, name: "유기농 모자", price: 18000, category: "의류", imageUrl: "https://via.placeholder.com/200", discount: 20 },
];

const MainShopping = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const filteredProducts = selectedCategory 
    ? PRODUCTS.filter(product => product.category === selectedCategory)
    : PRODUCTS;

  return (
    <div className="w-full">
      {/* 배너 섹션 */}
      <section className="bg-green-500 text-white py-16 text-center mb-10">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">GIVU 쇼핑몰</h1>
          <p className="text-xl mb-6">환경을 생각하는 친환경 제품들을 만나보세요</p>
          <button className="bg-white text-green-500 font-bold py-3 px-6 rounded hover:bg-gray-100 transition-all transform hover:-translate-y-1">
            지금 쇼핑하기
          </button>
        </div>
      </section>

      {/* 카테고리 섹션 */}
      <section className="mb-10 px-4">
        <h2 className="text-2xl font-bold text-center mb-6">카테고리</h2>
        <div className="flex flex-wrap justify-center gap-4">
          <button 
            onClick={() => setSelectedCategory(null)}
            className={`px-5 py-2 rounded-full border ${
              selectedCategory === null 
                ? 'bg-green-500 text-white border-green-500' 
                : 'bg-white text-gray-700 border-gray-300 hover:border-green-500'
            }`}
          >
            전체
          </button>
          {CATEGORIES.map(category => (
            <button 
              key={category.id}
              onClick={() => setSelectedCategory(category.name)}
              className={`px-5 py-2 rounded-full border ${
                selectedCategory === category.name 
                  ? 'bg-green-500 text-white border-green-500' 
                  : 'bg-white text-gray-700 border-gray-300 hover:border-green-500'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </section>

      {/* 상품 목록 섹션 */}
      <section className="mb-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-8">
          {selectedCategory ? `${selectedCategory} 상품` : "모든 상품"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredProducts.map(product => (
            <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="relative h-48">
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
                <h3 className="font-medium mb-2">{product.name}</h3>
                <div className="flex items-center gap-2 mb-4">
                  {product.discount > 0 && (
                    <span className="text-gray-500 line-through text-sm">
                      {product.price.toLocaleString()}원
                    </span>
                  )}
                  <span className="text-green-600 font-bold">
                    {(product.price * (100 - product.discount) / 100).toLocaleString()}원
                  </span>
                </div>
                <button className="w-full py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
                  장바구니 담기
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 특별 혜택 섹션 */}
      <section className="mb-16 py-12 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-8">특별 혜택</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <h3 className="text-xl font-bold text-green-500 mb-4">첫 구매 10% 할인</h3>
            <p className="text-gray-600">첫 구매 시 모든 상품 10% 할인 혜택을 드립니다.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <h3 className="text-xl font-bold text-green-500 mb-4">무료 배송</h3>
            <p className="text-gray-600">3만원 이상 구매 시 무료 배송 혜택을 드립니다.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <h3 className="text-xl font-bold text-green-500 mb-4">적립금 혜택</h3>
            <p className="text-gray-600">구매 금액의 5%를 적립금으로 돌려드립니다.</p>
          </div>
        </div>
      </section>

      {/* 추천 상품 섹션 */}
      <section className="mb-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-8">추천 상품</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {PRODUCTS.slice(0, 4).map(product => (
            <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="relative h-48">
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
                <h3 className="font-medium mb-2">{product.name}</h3>
                <div className="flex items-center gap-2 mb-4">
                  {product.discount > 0 && (
                    <span className="text-gray-500 line-through text-sm">
                      {product.price.toLocaleString()}원
                    </span>
                  )}
                  <span className="text-green-600 font-bold">
                    {(product.price * (100 - product.discount) / 100).toLocaleString()}원
                  </span>
                </div>
                <button className="w-full py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
                  장바구니 담기
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default MainShopping;