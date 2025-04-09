import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getReviewDetail, getFundingData } from '../../services/review.service';

interface ReviewDetail {
  id: number;
  title: string;
  author: string;
  date: string;
  views: number;
  rating: number;
  authorFundingCount: number;
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

// StarRating 컴포넌트 정의
const StarRating = ({ rating }: { rating?: number }) => {
  if (!rating) return null;

  return (
    <div className="flex items-center">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-5 h-5 ${
              star <= rating
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
      <span className="ml-2 text-sm font-medium text-gray-700">
        {rating.toFixed(1)}
      </span>
    </div>
  );
};

function FundingReviewDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [review, setReview] = useState<ReviewDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fundingTitle, setFundingTitle] = useState<string>('');

  // API 호출 함수
  const fetchReviewDetail = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!id) {
        setError('후기 ID가 잘못되었습니다.');
        return;
      }

      // 리뷰 상세 정보 가져오기
      const reviewData = await getReviewDetail(id);
      
      // 펀딩 정보 가져오기
      try {
        const fundingData = await getFundingData(reviewData.fundingId);
        setFundingTitle(fundingData.title || `펀딩 #${reviewData.fundingId}`);
        
        // 관련 펀딩 정보 업데이트
        reviewData.relatedFunding = {
          ...reviewData.relatedFunding,
          title: fundingData.title || `펀딩 #${reviewData.fundingId}`,
          amount: fundingData.fundedAmount || 150000,
          target: fundingData.targetAmount || 300000,
          percentage: fundingData.fundedAmount && fundingData.targetAmount 
            ? Math.floor((fundingData.fundedAmount / fundingData.targetAmount) * 100) 
            : 50
        };
      } catch (err) {
        console.error('펀딩 정보를 가져오는데 실패했습니다:', err);
        // 펀딩 정보를 가져오지 못해도 리뷰는 표시
      }
      
      // 백엔드 응답을 ReviewDetail 형식으로 변환
      const reviewDetail: ReviewDetail = {
        id: reviewData.reviewId,
        title: fundingTitle || `펀딩 후기 #${reviewData.reviewId}`, // 펀딩 제목 또는 기본값
        author: reviewData.user?.nickName || '익명',
        date: new Date(reviewData.createdAt).toLocaleDateString(),
        views: reviewData.visit || 0,
        rating: 5, // 백엔드에서 제공하지 않는 경우 기본값
        authorFundingCount: 1, // 백엔드에서 제공하지 않는 경우 기본값
        content: reviewData.comment || '',
        images: reviewData.image ? [reviewData.image] : [],
        relatedFunding: {
          id: reviewData.fundingId,
          title: fundingTitle || '관련 펀딩', // 펀딩 제목 또는 기본값
          amount: 150000, // 백엔드에서 제공하지 않는 경우 기본값
          target: 300000, // 백엔드에서 제공하지 않는 경우 기본값
          percentage: 50 // 백엔드에서 제공하지 않는 경우 기본값
        }
      };

      setReview(reviewDetail);
    } catch (err: any) {
      setError(err.message || '후기를 불러오는데 실패했습니다. 다시 시도해주세요.');
      console.error('Error fetching review:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchReviewDetail();
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
            {review.authorFundingCount}회 펀딩 참여
          </span>
          <span>•</span>
          <span>{review.date}</span>
          <span>•</span>
          <span>조회 {review.views}</span>
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
    </div>
  );
}

export default FundingReviewDetailPage; 