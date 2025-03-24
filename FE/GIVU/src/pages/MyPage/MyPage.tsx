import React, { useState } from "react";
import { Link } from "react-router-dom";

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
    progress: 1, // 달성률
    tag: "1% 달성",
    imageUrl: "https://via.placeholder.com/300x200?text=펀딩이미지1",
  },
  {
    id: 2,
    title: "도현이 아침 펀딩",
    progress: 1,
    tag: "1% 달성",
    imageUrl: "https://via.placeholder.com/300x200?text=펀딩이미지2",
  },
  {
    id: 3,
    title: "도현이 저녁 펀딩",
    progress: 1,
    tag: "1% 달성",
    imageUrl: "https://via.placeholder.com/300x200?text=펀딩이미지3",
  },
];

const PARTICIPATED_FUNDINGS = [
  {
    id: 4,
    title: "오늘 도현이의 패션",
    progress: 1,
    tag: "1% 달성",
    imageUrl: "https://via.placeholder.com/300x200?text=패션이미지",
  },
  {
    id: 5,
    title: "도현이 팬티 펀딩",
    progress: 1,
    tag: "1% 달성",
    imageUrl: "https://via.placeholder.com/300x200?text=팬티이미지",
  },
];

// 임시 후기 데이터 추가
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
  }
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

const MyPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>("created");

  // 탭 내용을 렌더링하는 함수
  const renderTabContent = () => {
    switch (activeTab) {
      case "created":
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MY_FUNDINGS.map((funding) => (
              <Link key={funding.id} to={`/funding/${funding.id}`} className="block">
                <FundingCard funding={funding} />
              </Link>
            ))}
          </div>
        );
      case "participated":
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PARTICIPATED_FUNDINGS.map((funding) => (
              <Link key={funding.id} to={`/funding/${funding.id}`} className="block">
                <FundingCard funding={funding} />
              </Link>
            ))}
          </div>
        );
      case "liked":
        return MY_REVIEWS.length > 0 ? (
          <div className="space-y-6">
            {MY_REVIEWS.map((review) => (
              <Link 
                key={review.id} 
                to={`/funding/review/${review.id}`}
                className="block hover:bg-gray-50 transition-colors"
              >
                <div className="flex gap-6 py-4 border-b border-gray-200">
                  <div className="w-32 h-24 flex-shrink-0">
                    <img 
                      src={review.image} 
                      alt={review.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold mb-2">{review.title}</h2>
                    <div className="text-sm text-gray-500">
                      작성자: <span className="text-gray-700">{review.author}</span> | {review.date} | 조회 {review.views}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 py-10 text-center">아직 작성한 후기가 없습니다.</p>
        );
      case "wishlist":
        return WISHLIST_ITEMS.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {WISHLIST_ITEMS.map((product) => (
              <Link 
                key={product.id} 
                to={`/shopping/product/${product.id}`}
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="h-48 bg-gray-100">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium mb-2">{product.name}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    {product.discount > 0 && (
                      <span className="text-gray-500 line-through text-sm">
                        {product.price.toLocaleString()}원
                      </span>
                    )}
                    <span className="text-black font-bold">
                      {(product.price * (100 - product.discount) / 100).toLocaleString()}원
                    </span>
                    {product.discount > 0 && (
                      <span className="text-orange-500 text-xs font-bold ml-auto">
                        {product.discount}% 할인
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 py-10 text-center">아직 위시리스트에 추가한 상품이 없습니다.</p>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-5 py-5">
      {/* 상단 프로필 영역 */}
      <div className="flex flex-col md:flex-row items-start">
        <div className="md:mr-8 mb-6 md:mb-0">
          <div className="w-36 h-36 md:w-40 md:h-40 rounded-full overflow-hidden mb-4">
            <img
              src={USER_DATA.profileImage}
              alt={USER_DATA.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-center">
            <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm mt-2">
              프로필 수정
            </button>
          </div>
        </div>
        
        <div className="flex-1 w-full">
          <div className="bg-gray-100 rounded-2xl p-6 mb-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center border-b border-gray-200 pb-4 mb-4">
              <h1 className="text-xl font-bold mb-3 md:mb-0">{USER_DATA.name}</h1>
              <div className="flex gap-3">
                <Link to="/donations" className="px-4 py-1 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50">
                  총전
                </Link>
                <Link to="/account" className="px-4 py-1 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50">
                  내 계좌 송금
                </Link>
                <Link to="/settings" className="px-4 py-1 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50">
                  결제 수단 관리
                </Link>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="mr-10">
                <div className="flex items-center mb-2">
                  <span className="text-yellow-500 text-xl mr-2">👑</span>
                  <h3 className="text-lg font-medium">내 기뷰페이</h3>
                </div>
                <p className="text-3xl font-bold">{USER_DATA.totalDonation.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 탭 메뉴 */}
      <div className="mb-8 mt-10">
        <div className="mb-4">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              className={`px-5 py-2.5 text-sm ${
                activeTab === "created" 
                  ? "bg-black text-white" 
                  : "bg-white text-gray-700 hover:bg-gray-50"
              } border border-gray-200 rounded-l-lg`}
              onClick={() => setActiveTab("created")}
            >
              내가 만든 펀딩
            </button>
            <button
              className={`px-5 py-2.5 text-sm ${
                activeTab === "participated" 
                  ? "bg-black text-white" 
                  : "bg-white text-gray-700 hover:bg-gray-50"
              } border-t border-b border-gray-200`}
              onClick={() => setActiveTab("participated")}
            >
              참여한 펀딩
            </button>
            <button
              className={`px-5 py-2.5 text-sm ${
                activeTab === "liked" 
                  ? "bg-black text-white" 
                  : "bg-white text-gray-700 hover:bg-gray-50"
              } border-t border-b border-gray-200`}
              onClick={() => setActiveTab("liked")}
            >
              내가 쓴 후기
            </button>
            <button
              className={`px-5 py-2.5 text-sm ${
                activeTab === "wishlist" 
                  ? "bg-black text-white" 
                  : "bg-white text-gray-700 hover:bg-gray-50"
              } border border-gray-200 rounded-r-lg`}
              onClick={() => setActiveTab("wishlist")}
            >
              찜 목록
            </button>
          </div>
        </div>
      </div>
      
      {/* 탭 컨텐츠 */}
      {renderTabContent()}
    </div>
  );
};

// 펀딩 카드 컴포넌트 - Link는 상위 컴포넌트에서 제공하도록 수정
const FundingCard: React.FC<FundingProps> = ({ funding }) => {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative h-52">
        <img
          src={funding.imageUrl}
          alt={funding.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 left-2">
          <span className="bg-teal-400 text-white text-xs px-2 py-1 rounded">
            {funding.tag}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-base">{funding.title}</h3>
        <div className="mt-1 mb-2">
          <div className="w-full bg-gray-200 rounded-full h-1 mb-1 mt-2">
            <div
              className="bg-teal-400 h-1 rounded-full"
              style={{ width: `${funding.progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>{funding.progress}% 달성</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPage;