import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

type ReviewType = '배송/포장' | '제품 품질' | '고객 서비스' | '전체';

interface ReviewDetail {
  id: number;
  title: string;
  author: string;
  date: string;
  views: number;
  rating: number;
  type: ReviewType;  // 후기 유형 추가
  authorFundingCount: number;  // 작성자의 펀딩 참여 수 추가
  content: string;
  images: string[];
  relatedFunding: {
    id: number;
    title: string;
    amount: number;
    target: number;
    percentage: number;
  };
}

// 더미 데이터 수정
const REVIEW_DETAILS: ReviewDetail = {
  id: 1,
  title: "노란색이 된 도현이의 속옷을 사주세요 !!!",
  author: "정도현",
  date: "2025.03.10",
  views: 235,
  rating: 4.5,  // 별점 추가
  type: "제품 품질",  // 후기 유형 추가
  authorFundingCount: 5,  // 펀딩 참여 수 추가
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

// StarRating 컴포넌트 정의
const StarRating = ({ rating }: { rating?: number }) => {
  if (!rating) return null;

  return (
    <div className="flex items-center">
      {/* ... StarRating 컴포넌트 내용 ... */}
    </div>
  );
};

function FundingReviewDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [review, setReview] = useState<ReviewDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // API 호출 함수
  const fetchReviewDetail = async (reviewId: string) => {
    try {
      setLoading(true);
      setError(null);

      // 실제 API 연동 시 사용할 코드
      // const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/funding/reviews/${reviewId}`);
      // setReview(response.data);

      // 임시로 더미 데이터 사용
      setReview(REVIEW_DETAILS);
    } catch (err) {
      setError('후기를 불러오는데 실패했습니다. 다시 시도해주세요.');
      console.error('Error fetching review:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchReviewDetail(id);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  if (error || !review) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error || '후기를 찾을 수 없습니다.'}
        </div>
      </div>
    );
  }

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
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold">{review.title}</h1>
          <StarRating rating={review.rating} />
        </div>
        <div className="flex items-center space-x-3 text-sm text-gray-500">
          <span className="inline-flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
            </svg>
            {review.author}
          </span>
          {/* 펀딩 참여 수 표시 */}
          <span className="text-rose-500 font-medium">
            {review.authorFundingCount}개의 펀딩 참여
          </span>
          <span>•</span>
          <span>{review.date}</span>
          <span>•</span>
          <span>조회 {review.views}</span>
          <span>•</span>
          {/* 후기 유형 태그 */}
          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
            {review.type}
          </span>
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