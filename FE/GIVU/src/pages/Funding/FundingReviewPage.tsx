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
    <div className="w-full p-0 m-0 overflow-hidden relative">
      {/* 상단 타이틀 섹션 */}
      <div className="bg-gradient-to-r from-rose-50 to-rose-100 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            펀딩 후기 모음
          </h1>
          <p className="text-gray-600 text-lg mb-6">
            즐거웠던 순간을 공유해주세요!
          </p>
          <Link to="/funding/review/write">
            <button className="bg-white text-gray-800 px-6 py-3 rounded-md 
              hover:bg-gray-50 transition-colors duration-200 shadow-md
              font-medium text-base border border-gray-300">
              후기 작성하기
            </button>
          </Link>
        </div>
      </div>

      {/* 후기 목록 섹션 */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {REVIEW_ITEMS.map((item) => (
            <Link 
              to={`/funding/review/${item.id}`} 
              key={item.id} 
              className="block bg-white rounded-lg overflow-hidden shadow-sm 
                hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex p-4 gap-6">
                {/* 후기 이미지 */}
                <div className="w-40 h-32 flex-shrink-0 overflow-hidden rounded-md">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover hover:scale-105 
                      transition-transform duration-200"
                  />
                </div>
                
                {/* 후기 내용 */}
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2 
                      hover:text-rose-500 transition-colors">
                      {item.title}
                    </h2>
                    <div className="flex items-center space-x-3 text-sm text-gray-500">
                      <span className="inline-flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/>
                        </svg>
                        {item.author}
                      </span>
                      <span>•</span>
                      <span>{item.date}</span>
                      <span>•</span>
                      <span className="inline-flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                        </svg>
                        조회 {item.views}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* 더보기 버튼 */}
        <div className="text-center mt-10">
          <button className="px-6 py-3 border-2 border-gray-300 rounded-md
            text-gray-600 font-medium hover:bg-gray-50 transition-colors">
            더 많은 후기 보기
          </button>
        </div>
      </div>
    </div>
  );
}

export default FundingReviewPage;