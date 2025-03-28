import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// 후기 유형 정의
type ReviewType = '배송/포장' | '제품 품질' | '고객 서비스' | '전체';

// 리뷰 아이템 타입 수정
interface ReviewItem {
  id: number;
  title: string;
  author: string;
  date: string;
  views: number;
  rating: number;
  content: string;
  image: string;
  type: ReviewType;  // 후기 유형 추가
  authorFundingCount: number;  // 작성자의 펀딩 참여 수 추가
}

// API 응답 타입 정의
interface ReviewResponse {
  content: ReviewItem[];
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
}

// 더미 데이터
const REVIEW_ITEMS = [
  {
    id: 1,
    title: "노란색이 된 도현이의 속옷을 사주세요 !!!",
    author: "정도현",
    date: "2025.03.10",
    views: 235,
    rating: 4.5,
    content: "정말 마음에 들어요! 색상도 예쁘고 착용감도 좋아서 매일 입고 싶네요. 다음에도 이런 좋은 제품 부탁드립니다~",
    image: "https://via.placeholder.com/150x100?text=속옷이미지",
    type: '전체',
    authorFundingCount: 5
  },
  {
    id: 2,
    title: "제 워너비 복장입니다 사주세요 !!!",
    author: "정도현",
    date: "2025.03.01",
    views: 124,
    rating: 5.0,
    content: "드디어 제가 원하던 스타일을 찾았어요! 핏이 너무 좋고 소재도 고급스러워요. 여러분도 꼭 한번 입어보세요!",
    image: "https://via.placeholder.com/150x100?text=복장이미지",
    type: '전체',
    authorFundingCount: 3
  },
  {
    id: 3,
    title: "노란색이 된 도현이의 속옷을 사주세요 !!!",
    author: "정도현",
    date: "2025.03.10",
    views: 235,
    rating: 4.8,
    content: "색상이 너무 예쁘고 착용감도 좋아요! 배송도 빠르고 포장도 꼼꼼하게 해주셔서 감사합니다. 다음에 또 구매할게요!",
    image: "https://via.placeholder.com/150x100?text=속옷이미지",
    type: '전체',
    authorFundingCount: 4
  },
  {
    id: 4,
    title: "노란색이 된 도현이의 속옷을 사주세요 !!!",
    author: "정도현",
    date: "2025.03.10",
    views: 235,
    rating: 4.2,
    content: "품질이 정말 좋네요! 가격대비 만족도가 높아서 주변 친구들에게도 추천했어요. 다음에도 좋은 제품 기대할게요~",
    image: "https://via.placeholder.com/150x100?text=속옷이미지",
    type: '전체',
    authorFundingCount: 2
  }
];

// 후기 유형 필터 옵션
const REVIEW_TYPES: ReviewType[] = ['전체', '배송/포장', '제품 품질', '고객 서비스'];

// 별점 컴포넌트
const StarRating = ({ rating }: { rating?: number }) => {
  if (!rating) return null; // rating이 없으면 아무것도 표시하지 않음

  return (
    <div className="flex items-center">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${star <= rating
                ? 'text-yellow-400'
                : star - 0.5 <= rating
                  ? 'text-yellow-400'
                  : 'text-gray-300'
              }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="ml-2 text-sm font-medium text-gray-600">
        {rating.toFixed(1)}
      </span>
    </div>
  );
};

function FundingReviewPage() {
  // 상태 관리
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [selectedType, setSelectedType] = useState<ReviewType>('전체');

  // API 호출 함수
  const fetchReviews = async (pageNum: number) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get<ReviewResponse>(
        `${import.meta.env.VITE_BASE_URL}/api/funding/reviews`,
        {
          params: {
            page: pageNum,
            size: 10,
            sort: 'createdAt,desc'
          }
        }
      );

      if (pageNum === 0) {
        setReviews(response.data.content);
      } else {
        setReviews(prev => [...prev, ...response.data.content]);
      }

      setHasMore(!response.data.last);
      setPage(response.data.number);
    } catch (err) {
      setError('후기를 불러오는데 실패했습니다. 다시 시도해주세요.');
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  // 초기 데이터 로드
  useEffect(() => {
    fetchReviews(0);
  }, []);

  // 더보기 핸들러
  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchReviews(page + 1);
    }
  };

  // 필터링된 리뷰 목록 계산
  const filteredReviews = reviews.filter(review =>
    selectedType === '전체' || review.type === selectedType
  );

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

      {/* 후기 유형 필터 추가 */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {REVIEW_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors
                ${selectedType === type
                  ? 'bg-rose-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* 후기 목록 섹션 */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 에러 메시지 */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {/* 로딩 중 표시 */}
        {loading && reviews.length === 0 && (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-rose-500"></div>
          </div>
        )}

        <div className="space-y-6">
          {filteredReviews.map((item) => (
            <Link
              to={`/funding/review/${item.id}`}
              key={item.id}
              className="block bg-white rounded-lg overflow-hidden shadow-sm 
                hover:shadow-md transition-shadow duration-200 border border-gray-100"
            >
              <div className="flex p-6 gap-6">
                {/* 후기 이미지 */}
                <div className="w-48 h-36 flex-shrink-0 overflow-hidden rounded-lg">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover hover:scale-105 
                      transition-transform duration-200"
                  />
                </div>

                {/* 후기 내용 */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <h2 className="text-xl font-bold text-gray-800 
                          hover:text-rose-500 transition-colors">
                          {item.title}
                        </h2>
                        {/* 후기 유형 태그 */}
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          {item.type}
                        </span>
                      </div>
                      <StarRating rating={item.rating} />
                    </div>

                    {/* 후기 내용 미리보기 */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {item.content}
                    </p>

                    <div className="flex items-center space-x-3 text-sm text-gray-500">
                      <span className="inline-flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                        </svg>
                        {item.author}
                      </span>
                      {/* 펀딩 참여 수 표시 */}
                      <span className="text-rose-500 font-medium">
                        {item.authorFundingCount}개의 펀딩 참여
                      </span>
                      <span>•</span>
                      <span>{item.date}</span>
                      <span>•</span>
                      <span className="inline-flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
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
        {reviews.length > 0 && (
          <div className="text-center mt-10">
            <button
              onClick={handleLoadMore}
              disabled={loading || !hasMore}
              className={`px-6 py-3 border-2 border-gray-300 rounded-md
                font-medium transition-colors
                ${loading
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-600 hover:bg-gray-50'
                }`}
            >
              {loading ? '로딩 중...' : hasMore ? '더 많은 후기 보기' : '모든 후기를 불러왔습니다'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default FundingReviewPage;