import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFundingReviews } from '../../services/review.service';
import axios from 'axios';
import { motion } from 'framer-motion'; // 애니메이션을 위한 framer-motion 추가

// 리뷰 아이템 타입 수정
interface ReviewItem {
  id?: number;
  title?: string;
  author?: string;
  date?: string;
  views?: number;
  rating?: number;
  content?: string;
  image?: string;
  authorFundingCount?: number;
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
}

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
  const [myFundings, setMyFundings] = useState<FundingItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [showMyFundings, setShowMyFundings] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'my'>('all');

  // API 호출 함수
  const fetchReviews = async (pageNum: number) => {
    try {
      setLoading(true);
      setError(null);
      
      // 실제 API 호출
      const response = await getFundingReviews('all', pageNum, 10);
      
      if (pageNum === 0) {
        setReviews(response.content || []);
      } else {
        setReviews(prev => [...prev, ...(response.content || [])]);
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

  // 내 펀딩 목록 가져오기
  const fetchMyFundings = async () => {
    try {
      setMyFundings([]); // 초기화

      // 토큰 확인
      const token = localStorage.getItem('auth_token');
      if (!token) {
        console.error('로그인이 필요합니다.');
        return;
      }

      // API Base URL 확인
      const API_BASE_URL = import.meta.env.VITE_BASE_URL || import.meta.env.VITE_API_BASE_URL;
      if (!API_BASE_URL) {
        console.error('API BASE URL이 설정되지 않았습니다.');
        return;
      }

      console.log('내 펀딩 목록 API 호출');
      
      // 내가 만든 펀딩 목록 API 호출
      const response = await axios.get(
        `${API_BASE_URL}/mypage/myfundings`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      console.log('내 펀딩 목록 응답:', response.data);
      
      if (response.data && response.data.code === 'SUCCESS' && Array.isArray(response.data.data)) {
        // API 응답 데이터를 FundingItem 타입으로 변환
        const fundingItems: FundingItem[] = response.data.data.map((item: any) => {
          // 종료 상태 판단 (백엔드 데이터에 따라 조정 필요)
          const status = item.status === 'COMPLETED' ? '종료' : '진행 중';
          
          return {
            id: item.fundingId,
            title: item.title,
            status: status,
            endDate: new Date(item.createdAt).toLocaleDateString(), // 종료일 정보가 없는 경우 생성일 사용
            hasReview: false // 후기 작성 여부는 백엔드에서 제공하지 않을 경우 기본값
          };
        });
        
        setMyFundings(fundingItems);
      } else {
        // 응답이 없거나 오류인 경우 빈 배열로 설정
        setMyFundings([]);
      }
    } catch (err) {
      console.error('내 펀딩 목록 조회 실패:', err);
      setMyFundings([]); // 에러 시 빈 배열로 초기화
    }
  };

  // 초기 데이터 로드
  useEffect(() => {
    fetchReviews(0);
    fetchMyFundings();
  }, []);

  // 더보기 핸들러
  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchReviews(page + 1);
    }
  };

  // 탭 변경 핸들러
  const handleTabChange = (tab: 'all' | 'my') => {
    setActiveTab(tab);
    setShowMyFundings(tab === 'my');
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
          
          {/* 탭 네비게이션 - 개선된 디자인 */}
          <div className="inline-flex bg-white p-1 rounded-xl shadow-md">
            <button
              onClick={() => handleTabChange('all')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                activeTab === 'all'
                  ? "bg-rose-500 text-white shadow-sm" 
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              모든 후기
            </button>
            <button
              onClick={() => handleTabChange('my')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                activeTab === 'my'
                  ? "bg-rose-500 text-white shadow-sm" 
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              내 펀딩
            </button>
          </div>
        </div>
      </div>

      {/* 내 펀딩 목록 섹션 */}
      {showMyFundings && (
        <div className="max-w-4xl mx-auto px-4 py-8">
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-gray-800 mb-6 flex items-center"
          >
            <span className="mr-2">💝</span> 내가 만든 펀딩
          </motion.h2>
          
          {myFundings.length > 0 ? (
            <div className="space-y-4">
              {myFundings.map((funding, index) => (
                <motion.div
                  key={funding.id}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={cardVariants}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-1">{funding.title}</h3>
                      <div className="flex items-center text-sm text-gray-500">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          funding.status === "종료" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                        }`}>
                          {funding.status}
                        </span>
                        <span className="mx-2">•</span>
                        <span>종료일: {funding.endDate}</span>
                      </div>
                    </div>
                    <div>
                      {!funding.hasReview && funding.status === "종료" && (
                        <Link
                          to={`/funding/review/write?fundingId=${funding.id}`}
                          className="inline-flex items-center px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors shadow-sm hover:shadow"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          후기 작성하기
                        </Link>
                      )}
                      {funding.hasReview && (
                        <span className="inline-flex items-center px-3 py-1 rounded-lg bg-gray-100 text-gray-700">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          후기 작성 완료
                        </span>
                      )}
                      {funding.status !== "종료" && (
                        <span className="inline-flex items-center px-3 py-1 rounded-lg bg-gray-100 text-gray-700">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          펀딩 진행 중
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <EmptyState message="아직 만든 펀딩이 없습니다. 펀딩을 생성해보세요!" />
          )}
          
          {/* 새 펀딩 만들기 버튼 */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center"
          >
            <Link
              to="/funding/create"
              className="inline-flex items-center px-6 py-3 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors shadow-sm hover:shadow"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              새 펀딩 만들기
            </Link>
          </motion.div>
        </div>
      )}

      {!showMyFundings && (
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

          {/* 후기 목록 */}
          {!loading && reviews.length === 0 ? (
            <EmptyState message="아직 작성된 후기가 없습니다. 첫 번째 후기를 작성해보세요!" />
          ) : (
            <div className="space-y-6">
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
                    <div className="flex flex-col md:flex-row p-0">
                      {/* 후기 이미지 */}
                      <div className="w-full md:w-64 h-48 md:h-36 flex-shrink-0 overflow-hidden">
                        <img 
                          src={item.image || 'https://via.placeholder.com/400x300?text=No+Image'} 
                          alt={item.title || '후기 이미지'} 
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      
                      {/* 후기 내용 */}
                      <div className="flex-1 p-4">
                        <div className="flex flex-col justify-between h-full">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <h2 className="text-xl font-bold text-gray-800 group-hover:text-rose-500 line-clamp-1">
                                {item.title || (
                                  <>
                                    펀딩 후기 #{item.id}
                                  </>
                                )}
                              </h2>
                              <StarRating rating={item.rating} />
                            </div>
                            
                            {/* 후기 내용 미리보기 */}
                            <p className="text-gray-600 text-xs mb-2 line-clamp-2">
                              {item.content || '내용이 없습니다.'}
                            </p>
                          </div>
                          
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center space-x-2 text-gray-500">
                              <span className="inline-flex items-center">
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/>
                                </svg>
                                {item.author || '익명'}
                              </span>
                              {/* 펀딩 참여 수 표시 */}
                              <span className="text-rose-500 font-medium">
                                {item.authorFundingCount || 0}회 펀딩 참여
                              </span>
                            </div>
                            
                            <div className="flex items-center space-x-2 text-gray-500">
                              <span>{item.date || '날짜 정보 없음'}</span>
                              <span>•</span>
                              <span className="inline-flex items-center">
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                                </svg>
                                조회 {item.views || 0}
                              </span>
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
      )}
      
      {/* 하단 작은 장식 요소 */}
      <div className="w-full h-4 bg-gradient-to-r from-rose-100 to-pink-100"></div>
    </motion.div>
  );
}

export default FundingReviewPage;