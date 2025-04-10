import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFundingReviews, getFundingData } from '../../services/review.service';
import axios from 'axios';
import { motion } from 'framer-motion'; // 애니메이션을 위한 framer-motion 추가

// 리뷰 아이템 타입 수정
interface ReviewItem {
  id?: number;
  reviewId?: number;
  fundingId?: number;
  fundingTitle?: string;
  title?: string;
  author?: string;
  date?: string;
  content?: string;
  image?: string;
  creator?: boolean;
  // 펀딩 이미지를 저장할 필드 추가
  fundingImage?: string;
  // API 응답에 맞게 추가 필드 허용
  [key: string]: any;
}

// 펀딩 아이템 타입 정의
interface FundingItem {
  id: number;
  title: string;
  status: string;
  endDate: string;
  hasReview: boolean;
  achievementRate?: number; // 달성률 추가
  // 펀딩 이미지 필드 추가
  image?: string;
  thumbnailImage?: string;
  product?: {
    id: number;
    productName: string;
    price: number;
    image: string;
  };
}

// 기본 이미지 경로 상수로 정의 - 절대 경로 사용
const DEFAULT_IMAGE = '/default-finding-image.jpg';
const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/600x400?text=이미지+준비중';

// 별점 컴포넌트 - 개선된 디자인
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
                ? 'text-yellow-400 drop-shadow-sm' // 그림자 추가
                : star - 0.5 <= rating
                ? 'text-yellow-400 drop-shadow-sm'
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

// 빈 상태 일러스트레이션 컴포넌트
const EmptyState = ({ message }: { message: string }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="text-center py-12 bg-white rounded-xl shadow-sm"
  >
    <div className="w-24 h-24 mx-auto mb-4 bg-rose-50 rounded-full flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    </div>
    <h3 className="text-xl font-semibold text-gray-800 mb-2">아직 내용이 없어요</h3>
    <p className="text-gray-500">{message}</p>
  </motion.div>
);

function FundingReviewPage() {
  // 상태 관리
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // API 호출 함수
  const fetchReviews = async (pageNum: number) => {
    try {
      setLoading(true);
      setError(null);
      
      // 실제 API 호출
      const response = await getFundingReviews('all', pageNum, 10);
      console.log('리뷰 목록 API 응답:', response);
      
      // 펀딩 데이터를 가져오기 위한 처리
      const reviewsWithFundingData = await Promise.all(
        (response.content || []).map(async (review: ReviewItem) => {
          if (!review.fundingId) {
            console.log(`펀딩 ID가 없는 리뷰:`, review);
            return {
              ...review,
              fundingTitle: '제목 없음',
              fundingImage: null
            };
          }
          
          try {
            // 펀딩 정보 가져오기
            console.log(`펀딩 ID ${review.fundingId} 데이터 요청 중...`);
            const fundingData = await getFundingData(review.fundingId);
            console.log(`펀딩 ID ${review.fundingId} 데이터:`, fundingData);
            
            // 이미지 소스 결정 로직
            let fundingImage = null;
            
            // 펀딩 이미지 확인
            if (fundingData?.image && typeof fundingData.image === 'string' && 
                fundingData.image !== 'null' && fundingData.image !== 'undefined') {
              fundingImage = fundingData.image;
              console.log(`펀딩 ${review.fundingId} 이미지 사용:`, fundingImage);
            } 
            // 썸네일 이미지 확인
            else if (fundingData?.thumbnailImage && typeof fundingData.thumbnailImage === 'string' && 
                    fundingData.thumbnailImage !== 'null' && fundingData.thumbnailImage !== 'undefined') {
              fundingImage = fundingData.thumbnailImage;
              console.log(`펀딩 ${review.fundingId} 썸네일 이미지 사용:`, fundingImage);
            }
            // 제품 이미지 확인
            else if (fundingData?.product?.image && typeof fundingData.product.image === 'string' && 
                    fundingData.product.image !== 'null' && fundingData.product.image !== 'undefined') {
              fundingImage = fundingData.product.image;
              console.log(`펀딩 ${review.fundingId} 제품 이미지 사용:`, fundingImage);
            }
            
            return {
              ...review,
              fundingTitle: fundingData?.title || `펀딩 #${review.fundingId}`,
              fundingImage: fundingImage
            };
          } catch (error) {
            console.error(`펀딩 ID ${review.fundingId}의 정보를 가져오는데 실패:`, error);
            return {
              ...review,
              fundingTitle: `펀딩 후기 #${review.reviewId || review.id || ''}`,
              fundingImage: null
            };
          }
        })
      );
      
      // 최신순으로 정렬 (ID가 클수록, 날짜가 최신일수록 위에 표시)
      const sortedReviews = [...reviewsWithFundingData].sort((a, b) => {
        // ID 기준 정렬 (ID가 클수록 더 최신)
        if (a.id && b.id) return b.id - a.id;
        
        // 날짜 기준 정렬
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        
        if (dateA && dateB) return dateB - dateA;
        
        // createdAt 필드 기준 정렬 (API 응답에 있을 경우)
        const createdAtA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const createdAtB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        
        if (createdAtA && createdAtB) return createdAtB - createdAtA;
        
        // 그 외 경우 원래 순서 유지
        return 0;
      });
      
      console.log('처리된 리뷰 데이터 (정렬 후):', sortedReviews);

      if (pageNum === 0) {
        setReviews(sortedReviews);
      } else {
        setReviews(prev => [...prev, ...sortedReviews]);
      }

      setHasMore(!response.last);
      setPage(pageNum);
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

  // 스크롤 시 애니메이션 효과
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full min-h-screen bg-gray-50 p-0 m-0 overflow-hidden relative"
    >
      {/* 상단 히어로 섹션 */}
      <div className="bg-gradient-to-r from-rose-100 to-pink-100 py-8 relative overflow-hidden">
        {/* 배경 장식 요소들 */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-10 left-10 w-24 h-24 bg-yellow-100 rounded-full opacity-40"></div>
          <div className="absolute bottom-10 right-20 w-32 h-32 bg-rose-200 rounded-full opacity-30"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-blue-100 rounded-full opacity-20"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-3xl font-extrabold text-gray-800 mb-4 tracking-tight"
          >
            펀딩 후기 모음
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-700 text-sm mb-4 max-w-2xl mx-auto"
          >
            여러분의 소중한 경험을 나누고, 다른 사람들의 이야기를 들어보세요!
          </motion.p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 에러 메시지 */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 shadow-sm"
          >
            <div className="flex">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          </motion.div>
        )}

        {/* 로딩 중 표시 */}
        {loading && reviews.length === 0 && (
          <div className="flex justify-center items-center h-48">
            <div className="loader">
              <div className="animate-ping relative h-10 w-10 rounded-full bg-rose-400 opacity-75"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-rose-500"></div>
            </div>
          </div>
        )}

        {/* 후기 목록 - 2줄 그리드 형태로 변경 */}
        {!loading && reviews.length === 0 ? (
          <EmptyState message="아직 작성된 후기가 없습니다. 첫 번째 후기를 작성해보세요!" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {reviews.map((item, index) => (
              <motion.div
                key={item.id}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={cardVariants}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Link 
                  to={`/funding/review/${item.id}`} 
                  className="block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                >
                  <div className="p-0">
                    {/* 후기 이미지 */}
                    <div className="w-full h-48 flex-shrink-0 overflow-hidden bg-gray-100">
                      {index === 0 && (() => {
                        console.log('첫 번째 아이템 이미지 정보:', {
                          id: item.id,
                          fundingId: item.fundingId,
                          image: item.image,
                          fundingImage: item.fundingImage
                        });
                        return null;
                      })()}
                      <img 
                        src={
                          // 이미지 우선순위: 리뷰 이미지 > 펀딩 이미지 > 기본 이미지
                          (item.image && item.image !== 'null' && item.image !== 'undefined')
                            ? item.image
                            : (item.fundingImage && item.fundingImage !== 'null' && item.fundingImage !== 'undefined')
                              ? item.fundingImage
                              : DEFAULT_IMAGE
                        } 
                        alt={item.title || item.fundingTitle || '후기 이미지'} 
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          if (!e.currentTarget) return;
                          
                          // 무한 루프 방지
                          e.currentTarget.onerror = null;
                          console.log(`이미지 로드 실패. 대체 이미지 사용: ${PLACEHOLDER_IMAGE}`);
                          
                          // 플레이스홀더 이미지로 대체
                          e.currentTarget.src = PLACEHOLDER_IMAGE;
                        }}
                      />
                    </div>
                    
                    {/* 후기 내용 */}
                    <div className="p-4">
                      <div className="flex flex-col justify-between h-full">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <h2 className="text-xl font-bold text-gray-800 group-hover:text-rose-500 line-clamp-1">
                              {item.fundingTitle || item.title || (
                                <>
                                  펀딩 후기 #{item.id}
                                </>
                              )}
                            </h2>
                          </div>
                          
                          {/* 별점 표시 추가 */}
                          {item.rating && <StarRating rating={item.rating} />}
                          
                          {/* 후기 내용 미리보기 */}
                          <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                            {item.content || '내용이 없습니다.'}
                          </p>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <div className="flex items-center bg-gray-100 px-2 py-1 rounded-full">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/>
                            </svg>
                            {item.author || '익명'}
                            {item.creator && (
                              <span className="ml-1 bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 rounded-full">
                                작성자
                              </span>
                            )}
                          </div>
                          
                          <div className="bg-gray-100 px-2 py-1 rounded-full">
                            {item.date || '날짜 정보 없음'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* 더보기 버튼 */}
        {reviews.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-10"
          >
            <button 
              onClick={handleLoadMore}
              disabled={loading || !hasMore}
              className={`px-8 py-3 rounded-full font-medium transition-all duration-300 ${
                loading 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : hasMore 
                    ? 'bg-rose-500 text-white hover:bg-rose-600 shadow-md hover:shadow-lg' 
                    : 'bg-gray-200 text-gray-600'
              }`}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  로딩 중...
                </span>
              ) : (
                hasMore ? '더 많은 후기 보기' : '모든 후기를 불러왔습니다'
              )}
            </button>
          </motion.div>
        )}
      </div>
      
      {/* 하단 작은 장식 요소 */}
      <div className="w-full h-4 bg-gradient-to-r from-rose-100 to-pink-100"></div>
    </motion.div>
  );
}

export default FundingReviewPage;