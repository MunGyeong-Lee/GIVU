import React from 'react';
import { useParams, Link } from 'react-router-dom';

// 더미 데이터
const REVIEW_DETAILS = {
  id: 1,
  title: "노란색이 된 도현이의 속옷을 사주세요 !!!",
  author: "정도현",
  date: "2025.03.10",
  views: 235,
  content: `
    안녕하세요! 저는 이번에 GIVU에서 펀딩에 참여하여 멋진 선물을 받게 되었습니다.
    
    이번에 받은 노란색 속옷은 제가 정말 갖고 싶었던 아이템이었는데요, 여러분들 덕분에 목표 금액을 달성하여 구매할 수 있게 되었습니다.
    
    생각보다 품질도 좋고 착용감도 너무 편안해서 정말 만족스럽습니다. 펀딩에 참여해주신 모든 분들께 진심으로 감사드립니다.
    
    앞으로도 GIVU를 통해 많은 분들의 소원이 이루어졌으면 좋겠습니다. 정말 감사합니다!
  `,
  images: [
    "https://via.placeholder.com/800x500?text=상세이미지1",
    "https://via.placeholder.com/800x500?text=상세이미지2"
  ],
  relatedFunding: {
    id: 101,
    title: "도현이의 생일 선물 펀딩",
    amount: 150000,
    target: 300000,
    percentage: 50
  }
};

function FundingReviewDetailPage() {
  const { id } = useParams<{ id: string }>();
  
  // 실제 구현에서는 id를 사용하여 API에서 데이터를 가져와야 함
  const review = REVIEW_DETAILS;
  
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* 뒤로가기 링크 */}
      <div className="mb-6">
        <Link to="/funding/review" className="text-gray-600 hover:text-gray-900 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          후기 목록으로 돌아가기
        </Link>
      </div>
      
      {/* 후기 제목 및 메타 정보 */}
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h1 className="text-2xl font-bold mb-2">{review.title}</h1>
        <div className="text-sm text-gray-500">
          작성자: <span className="text-gray-700">{review.author}</span> | {review.date} | 조회 {review.views}
        </div>
      </div>
      
      {/* 후기 내용 */}
      <div className="mb-8">
        {review.images.map((image, index) => (
          <div key={index} className="mb-6">
            <img 
              src={image} 
              alt={`후기 이미지 ${index + 1}`} 
              className="w-full h-auto rounded-lg"
            />
          </div>
        ))}
        
        <div className="whitespace-pre-line text-gray-800 leading-relaxed mt-6">
          {review.content}
        </div>
      </div>
      
      {/* 관련 펀딩 정보 */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-bold mb-4">관련 펀딩</h3>
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1">
            <h4 className="font-bold">{review.relatedFunding.title}</h4>
            <div className="flex items-center gap-2 mt-2">
              <div className="text-sm text-gray-600">
                현재 금액: {review.relatedFunding.amount.toLocaleString()}원
              </div>
              <div className="text-sm font-bold">
                ({review.relatedFunding.percentage}%)
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-black h-2 rounded-full" 
                style={{ width: `${review.relatedFunding.percentage}%` }}
              ></div>
            </div>
          </div>
          <Link 
            to={`/funding/${review.relatedFunding.id}`}
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition"
          >
            펀딩 보기
          </Link>
        </div>
      </div>
      
      {/* 코멘트 섹션 */}
      <div className="mt-10">
        <h3 className="text-lg font-bold mb-4">댓글</h3>
        <div className="border border-gray-200 rounded-lg p-4">
          <textarea 
            className="w-full p-2 border border-gray-300 rounded mb-2" 
            rows={3}
            placeholder="댓글을 남겨주세요"
          ></textarea>
          <div className="flex justify-end">
            <button className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition">
              등록하기
            </button>
          </div>
        </div>
        
        <div className="mt-6">
          <p className="text-gray-500 text-center py-4">아직 댓글이 없습니다.</p>
        </div>
      </div>
    </div>
  );
}

export default FundingReviewDetailPage; 