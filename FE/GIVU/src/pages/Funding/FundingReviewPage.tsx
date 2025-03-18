import React from 'react';
import { Link } from 'react-router-dom';

// 더미 데이터
const REVIEW_ITEMS = [
  {
    id: 1,
    title: "노란색이 된 도현이의 속옷을 사주세요 !!!",
    author: "정도현",
    date: "2025.03.10",
    views: 235,
    image: "https://via.placeholder.com/150x100?text=속옷이미지"
  },
  {
    id: 2,
    title: "제 워너비 복장입니다 사주세요 !!!",
    author: "정도현",
    date: "2025.03.01",
    views: 124,
    image: "https://via.placeholder.com/150x100?text=복장이미지"
  },
  {
    id: 3,
    title: "노란색이 된 도현이의 속옷을 사주세요 !!!",
    author: "정도현",
    date: "2025.03.10",
    views: 235,
    image: "https://via.placeholder.com/150x100?text=속옷이미지"
  },
  {
    id: 4,
    title: "노란색이 된 도현이의 속옷을 사주세요 !!!",
    author: "정도현",
    date: "2025.03.10",
    views: 235,
    image: "https://via.placeholder.com/150x100?text=속옷이미지"
  }
];

function FundingReviewPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* 페이지 제목 */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">펀딩 후기 모음</h1>
        <p className="text-gray-600 mt-2">즐거웠던 순간을 공유해주세요!</p>
        <div className="mt-4">
          <Link to="/funding/review/write">
            <button className="inline-block border border-gray-400 px-4 py-2 rounded-md text-sm hover:bg-gray-100 transition-colors">
              [후기 작성하기]
            </button>
          </Link>
        </div>
      </div>

      {/* 구분선 */}
      <div className="border-t border-gray-300 my-6"></div>

      {/* 후기 목록 */}
      <div className="space-y-6">
        {REVIEW_ITEMS.map((item) => (
          <div key={item.id} className="flex gap-6 py-4 border-b border-gray-200">
            {/* 후기 이미지 */}
            <div className="w-32 h-24 flex-shrink-0">
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* 후기 내용 */}
            <div className="flex-1">
              <Link to={`/funding/review/${item.id}`} className="block group">
                <h2 className="text-xl font-bold mb-2">{item.title}</h2>
                <div className="text-sm text-gray-500">
                  작성자: <span className="text-gray-700">{item.author}</span> | {item.date} | 조회 {item.views}
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FundingReviewPage;