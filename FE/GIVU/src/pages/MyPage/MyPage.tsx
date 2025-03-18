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

// 탭 메뉴 타입 정의
type TabType = "created" | "participated" | "liked" | "wishlist";

const MyPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>("created");

  // 탭 내용을 렌더링하는 함수
  const renderTabContent = () => {
    switch (activeTab) {
      case "created":
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MY_FUNDINGS.map((funding) => (
              <FundingCard key={funding.id} funding={funding} />
            ))}
          </div>
        );
      case "participated":
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PARTICIPATED_FUNDINGS.map((funding) => (
              <FundingCard key={funding.id} funding={funding} />
            ))}
          </div>
        );
      case "liked":
        return <p className="text-gray-500 py-10 text-center">아직 찜한 펀딩이 없습니다.</p>;
      case "wishlist":
        return <p className="text-gray-500 py-10 text-center">아직 위시리스트에 추가한 상품이 없습니다.</p>;
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
                  <h3 className="text-lg font-medium">내 기부페이</h3>
                </div>
                <p className="text-3xl font-bold">{USER_DATA.totalDonation.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 탭 메뉴 */}
      <div className="mb-8 mt-10">
        <ul className="flex border-b border-gray-200">
          <li className={`mr-5 ${activeTab === "created" ? "border-b-2 border-black" : ""}`}>
            <button
              className={`px-1 py-3 text-center ${activeTab === "created" ? "font-bold" : "text-gray-500"}`}
              onClick={() => setActiveTab("created")}
            >
              내가 만든 펀딩
            </button>
          </li>
          <li className={`mr-5 ${activeTab === "participated" ? "border-b-2 border-black" : ""}`}>
            <button
              className={`px-1 py-3 text-center ${activeTab === "participated" ? "font-bold" : "text-gray-500"}`}
              onClick={() => setActiveTab("participated")}
            >
              참여한 펀딩
            </button>
          </li>
          <li className={`mr-5 ${activeTab === "liked" ? "border-b-2 border-black" : ""}`}>
            <button
              className={`px-1 py-3 text-center ${activeTab === "liked" ? "font-bold" : "text-gray-500"}`}
              onClick={() => setActiveTab("liked")}
            >
              내가 쓴 후기
            </button>
          </li>
          <li className={`mr-5 ${activeTab === "wishlist" ? "border-b-2 border-black" : ""}`}>
            <button
              className={`px-1 py-3 text-center ${activeTab === "wishlist" ? "font-bold" : "text-gray-500"}`}
              onClick={() => setActiveTab("wishlist")}
            >
              찜 목록
            </button>
          </li>
        </ul>
      </div>
      
      {/* 탭 컨텐츠 */}
      {renderTabContent()}
    </div>
  );
};

// 펀딩 카드 컴포넌트
interface FundingProps {
  funding: {
    id: number;
    title: string;
    progress: number;
    tag: string;
    imageUrl: string;
  };
}

const FundingCard: React.FC<FundingProps> = ({ funding }) => {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
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