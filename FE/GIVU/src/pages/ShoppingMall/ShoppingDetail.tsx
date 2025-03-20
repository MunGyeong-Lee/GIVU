import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

// 임시 데이터 - 나중에 API로 대체
const PRODUCT_DETAILS = {
  id: 6,
  name: "애플 에어팟 맥스",
  price: 769000,
  category: "가전/디지털",
  imageUrl: "https://via.placeholder.com/800x600?text=에어팟+맥스",
  discount: 5,
  description: `
    고품질 사운드와 액티브 노이즈 캔슬링을 갖춘 프리미엄 헤드폰입니다.
    
    주요 특징:
    - 액티브 노이즈 캔슬링 기능
    - 투명성 모드로 주변 소리 확인 가능
    - 공간 음향으로 몰입감 있는 사운드
    - 최대 20시간 배터리 사용 가능
    - 고급스러운 메쉬 캐노피와 편안한 착용감
    
    패키지 구성: 헤드폰, 스마트 케이스, Lightning to USB-C 케이블
  `,
  detailImages: [
    "https://via.placeholder.com/800x600?text=상세이미지1",
    "https://via.placeholder.com/800x600?text=상세이미지2",
    "https://via.placeholder.com/800x600?text=상세이미지3"
  ],
  options: [
    {
      name: "색상",
      choices: ["스페이스 그레이", "실버", "스카이 블루", "핑크", "그린"]
    }
  ],
  stock: 50,
  deliveryInfo: {
    fee: 3000,
    freeFeeOver: 50000,
    estimatedDays: "1~3일 이내"
  },
  reviews: [
    {
      id: 1,
      author: "구매자1",
      rating: 5,
      content: "정말 좋은 품질입니다. 추천합니다!",
      date: "2025.02.15"
    },
    {
      id: 2,
      author: "구매자2",
      rating: 4,
      content: "노이즈 캔슬링이 좋아요. 음질도 훌륭합니다.",
      date: "2025.02.10"
    }
  ],
  relatedProducts: [5, 9, 10, 14]
};

const ShoppingProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  
  // 실제 구현에서는 id를 사용하여 API에서 데이터를 가져와야 함
  const product = PRODUCT_DETAILS;
  
  // 옵션 선택 핸들러
  const handleOptionChange = (optionName: string, value: string) => {
    setSelectedOptions({
      ...selectedOptions,
      [optionName]: value
    });
  };
  
  // 수량 변경 핸들러
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    if (newQuantity > product.stock) return;
    setQuantity(newQuantity);
  };
  
  // 할인가 계산
  const discountedPrice = 
    product.discount > 0 
      ? Math.floor(product.price * (100 - product.discount) / 100) 
      : product.price;
  
  // 총 금액 계산
  const totalPrice = discountedPrice * quantity;
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* 상품 기본 정보 영역 */}
      <div className="flex flex-col md:flex-row gap-8 mb-12">
        {/* 상품 이미지 영역 */}
        <div className="w-full md:w-1/2">
          <div className="mb-4 relative">
            <img 
              src={currentImageIndex === 0 ? product.imageUrl : product.detailImages[currentImageIndex - 1]} 
              alt={product.name} 
              className="w-full h-auto rounded-lg"
            />
            {product.discount > 0 && (
              <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full font-bold">
                {product.discount}% 할인
              </div>
            )}
          </div>
          <div className="grid grid-cols-5 gap-2">
            <button 
              className={`border-2 rounded-md overflow-hidden ${currentImageIndex === 0 ? 'border-black' : 'border-gray-200'}`}
              onClick={() => setCurrentImageIndex(0)}
            >
              <img src={product.imageUrl} alt="썸네일" className="w-full h-16 object-cover" />
            </button>
            {product.detailImages.map((img, idx) => (
              <button 
                key={idx}
                className={`border-2 rounded-md overflow-hidden ${currentImageIndex === idx + 1 ? 'border-black' : 'border-gray-200'}`}
                onClick={() => setCurrentImageIndex(idx + 1)}
              >
                <img src={img} alt={`썸네일 ${idx + 1}`} className="w-full h-16 object-cover" />
              </button>
            ))}
          </div>
        </div>
        
        {/* 상품 정보 및 구매 옵션 */}
        <div className="w-full md:w-1/2">
          <div className="mb-4">
            <span className="text-sm text-gray-500">{product.category}</span>
            <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center gap-2 mb-4">
              {product.discount > 0 && (
                <span className="text-gray-400 line-through text-lg">{product.price.toLocaleString()}원</span>
              )}
              <span className="text-black font-bold text-2xl">{discountedPrice.toLocaleString()}원</span>
              {product.discount > 0 && (
                <span className="bg-orange-100 text-orange-700 text-sm px-2 py-1 rounded">
                  {product.discount}% 할인
                </span>
              )}
            </div>
            <div className="text-sm text-gray-600 mb-6">
              <p>배송비: {product.deliveryInfo.fee === 0 ? '무료' : `${product.deliveryInfo.fee.toLocaleString()}원`}</p>
              {product.deliveryInfo.fee > 0 && (
                <p>{product.deliveryInfo.freeFeeOver.toLocaleString()}원 이상 구매 시 무료배송</p>
              )}
              <p>배송 예정: {product.deliveryInfo.estimatedDays}</p>
            </div>
          </div>
          
          {/* 옵션 선택 */}
          {product.options.map((option, idx) => (
            <div key={idx} className="mb-4">
              <label className="block text-sm font-medium mb-2">{option.name}</label>
              <select 
                className="w-full p-2 border border-gray-300 rounded-md"
                value={selectedOptions[option.name] || ''}
                onChange={(e) => handleOptionChange(option.name, e.target.value)}
              >
                <option value="">선택해주세요</option>
                {option.choices.map((choice, choiceIdx) => (
                  <option key={choiceIdx} value={choice}>{choice}</option>
                ))}
              </select>
            </div>
          ))}
          
          {/* 수량 선택 */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">수량</label>
            <div className="flex border border-gray-300 rounded-md w-32">
              <button 
                className="px-3 py-1 border-r border-gray-300 hover:bg-gray-100"
                onClick={() => handleQuantityChange(quantity - 1)}
              >
                -
              </button>
              <input 
                type="number" 
                min="1" 
                max={product.stock}
                value={quantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                className="w-full text-center"
              />
              <button 
                className="px-3 py-1 border-l border-gray-300 hover:bg-gray-100"
                onClick={() => handleQuantityChange(quantity + 1)}
              >
                +
              </button>
            </div>
          </div>
          
          {/* 총 금액 */}
          <div className="p-4 bg-gray-50 rounded-md mb-6">
            <div className="flex justify-between items-center">
              <span className="font-medium">총 상품 금액</span>
              <span className="font-bold text-xl">{totalPrice.toLocaleString()}원</span>
            </div>
          </div>
          
          {/* 구매 버튼 */}
          <div className="flex gap-2">
            <button className="flex-1 py-3 border border-black rounded-md hover:bg-gray-100 transition-colors">
              장바구니
            </button>
            <button className="flex-1 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors">
              바로 구매하기
            </button>
          </div>
        </div>
      </div>
      
      {/* 상세 정보 탭 */}
      <div className="mb-12">
        <div className="border-b border-gray-200 mb-6">
          <div className="flex">
            <button className="py-3 px-4 border-b-2 border-black font-medium text-sm">
              상품 상세정보
            </button>
            <button className="py-3 px-4 text-gray-500 text-sm">
              리뷰 ({product.reviews.length})
            </button>
            <button className="py-3 px-4 text-gray-500 text-sm">
              배송/교환/반품 안내
            </button>
          </div>
        </div>
        
        <div>
          <div className={`whitespace-pre-line ${!isDescriptionExpanded && 'max-h-96 overflow-hidden relative'}`}>
            {product.description}
            
            {/* 상세 이미지들 */}
            <div className="mt-8 space-y-4">
              {product.detailImages.map((img, idx) => (
                <img 
                  key={idx}
                  src={img}
                  alt={`${product.name} 상세 이미지 ${idx + 1}`}
                  className="w-full h-auto rounded-md"
                />
              ))}
            </div>
            
            {!isDescriptionExpanded && (
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent"></div>
            )}
          </div>
          
          {!isDescriptionExpanded && (
            <div className="text-center mt-4">
              <button 
                onClick={() => setIsDescriptionExpanded(true)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
              >
                상세정보 더보기
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* 리뷰 섹션 */}
      <div className="mb-12">
        <h3 className="text-lg font-bold mb-4">상품 리뷰</h3>
        <div className="space-y-4">
          {product.reviews.map(review => (
            <div key={review.id} className="border border-gray-200 rounded-md p-4">
              <div className="flex justify-between mb-2">
                <div>
                  <span className="font-medium">{review.author}</span>
                  <div className="flex text-yellow-400">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <svg 
                        key={idx} 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-4 w-4" 
                        viewBox="0 0 20 20" 
                        fill={idx < review.rating ? 'currentColor' : 'none'}
                        stroke="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <span className="text-sm text-gray-500">{review.date}</span>
              </div>
              <p className="text-sm text-gray-700">{review.content}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-6">
          <Link to="/shopping/review/write" className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
            리뷰 작성하기
          </Link>
        </div>
      </div>
      
      {/* 배송/교환/반품 안내 */}
      <div className="mb-12">
        <h3 className="text-lg font-bold mb-4">배송/교환/반품 안내</h3>
        <div className="border border-gray-200 rounded-md p-6">
          <div className="mb-6">
            <h4 className="font-bold mb-2">배송 안내</h4>
            <ul className="text-sm text-gray-700 space-y-1 list-disc pl-5">
              <li>배송 방법: 택배</li>
              <li>배송 지역: 전국</li>
              <li>배송 비용: {product.deliveryInfo.fee === 0 ? '무료' : `${product.deliveryInfo.fee.toLocaleString()}원`}</li>
              <li>제주 및 도서산간 지역은 추가 배송비가 발생할 수 있습니다.</li>
              <li>배송 기간: {product.deliveryInfo.estimatedDays} (주문 완료 후)</li>
            </ul>
          </div>
          
          <div className="mb-6">
            <h4 className="font-bold mb-2">교환/반품 안내</h4>
            <ul className="text-sm text-gray-700 space-y-1 list-disc pl-5">
              <li>상품 수령일로부터 7일 이내에 교환/반품이 가능합니다.</li>
              <li>단순 변심에 의한 교환/반품은 고객님께서 왕복 배송비를 부담하셔야 합니다.</li>
              <li>상품 하자, 오배송의 경우 판매자가 배송비를 부담합니다.</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-2">교환/반품이 불가능한 경우</h4>
            <ul className="text-sm text-gray-700 space-y-1 list-disc pl-5">
              <li>고객님의 책임 있는 사유로 상품이 훼손된 경우</li>
              <li>상품 사용 또는 일부 소비로 인해 상품 가치가 현저히 감소한 경우</li>
              <li>시간 경과에 의해 재판매가 어려운 경우</li>
              <li>복제가 가능한 상품의 포장을 훼손한 경우</li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* 추천 상품 */}
      <div>
        <h3 className="text-lg font-bold mb-4">함께 보면 좋은 상품</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(idx => (
            <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="h-48 bg-gray-100">
                <img 
                  src={`https://via.placeholder.com/200x200?text=추천상품${idx}`}
                  alt={`추천상품 ${idx}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3">
                <h4 className="font-medium text-sm">추천 상품 {idx}</h4>
                <div className="mt-1 font-bold">
                  {Math.floor(Math.random() * 200000 + 50000).toLocaleString()}원
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShoppingProductDetail;