import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getReviewDetail, getFundingData } from '../../services/review.service';

interface ReviewDetail {
  id: number;
  title: string;
  author: string;
  date: string;
  content: string;
  images: string[];
  creator?: boolean;
  relatedFunding: {
    id: number;
    title: string;
    amount: number;
    target: number;
    percentage: number;
  };
}

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
        content: reviewData.comment || '',
        images: reviewData.image ? [reviewData.image] : [],
        creator: reviewData.creator || false,
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

      {/* 후기 제목 및 메타 정보 - 카드 형태로 개선 */}
      <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-gray-800">{review.title}</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mt-3">
          <div className="flex items-center bg-gray-50 px-3 py-1.5 rounded-full">
            <svg className="w-4 h-4 mr-1 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
            </svg>
            <span className="font-medium">{review.author}</span>
            {review.creator && (
              <span className="ml-1 bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 rounded-full">
                작성자
              </span>
            )}
          </div>
          
          <div className="bg-gray-50 px-3 py-1.5 rounded-full">
            {review.date}
          </div>
        </div>
      </div>

      {/* 후기 내용 */}
      <div className="mb-8 bg-white rounded-xl overflow-hidden shadow-sm">
        {review.images.length > 0 && (
          <div className="flex justify-center p-4">
            <div className="max-w-lg w-full">
              <img
                src={review.images[0]}
                alt={`후기 이미지`}
                className="w-full h-auto rounded-lg object-contain max-h-[400px] mx-auto"
              />
            </div>
          </div>
        )}

        <div className="whitespace-pre-line text-gray-800 leading-relaxed p-6">
          {review.content}
        </div>
      </div>
    </div>
  );
}

export default FundingReviewDetailPage; 