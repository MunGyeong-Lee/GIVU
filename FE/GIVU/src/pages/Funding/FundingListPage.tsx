import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import FundingGrid from './components/FundingGrid';
import CategoryTabs from './components/CategoryTabs';
import SortOptions from './components/SortOptions';
import FundingHighlights from './components/FundingHighlights';
import LoadingSpinner from './components/LoadingSpinner';
import StatusFilter from './components/StatusFilter';
import { FundingItem as FundingGridItem } from './components/FundingGrid';
import { HighlightItem } from './components/FundingHighlights';


// API 응답 인터페이스 정의
interface User {
  userId: number;
  nickName: string;
  image: string;
}

interface Product {
  id: number;
  productName: string;
  price: number;
  image: string;
}

interface FundingItemAPI {
  fundingId: number;
  user: User;
  product: Product;
  title: string;
  description: string;
  category: string;
  categoryName: string;
  scope: string;
  participantsNumber: number;
  fundedAmount: number;
  status: string;
  image: string[];
  createdAt: string;
  updatedAt: string;
}

// API 응답을 FundingGrid 컴포넌트 형식으로 변환하는 함수
const mapToFundingGridItem = (item: FundingItemAPI): FundingGridItem => {
  if (!item) return null as any; // 아이템이 없는 경우 처리

  // 진행률 계산 (현재는 더미로, 실제로는 API에서 목표액이 제공되어야 함)
  const targetAmount = 100000; // 임시 목표액
  const progressPercentage = Math.round(((item.fundedAmount || 0) / targetAmount) * 100);

  return {
    id: item.fundingId,
    title: item.title || '',
    description: item.description || '',
    targetAmount: targetAmount, // 임시 목표액
    currentAmount: item.fundedAmount || 0,
    progressPercentage: progressPercentage,
    // 대표 이미지를 product.image에서 가져옴
    imageUrl: item.product?.image || '',
    creatorName: item.user?.nickName || '',
    category: item.category || '',
    status: item.status || '',
    createdAt: item.createdAt || '',
    parcitipantsNumber: item.participantsNumber || 0, // 오타 주의: parcitipantsNumber로 되어 있음
  };
};

// API 응답을 하이라이트 아이템 형식으로 변환하는 함수
const mapToHighlightItem = (item: FundingItemAPI, badgeType: 'popular' | 'achievement'): HighlightItem => {
  if (!item) return null as any; // 아이템이 없는 경우 처리

  // 진행률 계산 (현재는 더미로, 실제로는 API에서 목표액이 제공되어야 함)
  const targetAmount = 100000; // 임시 목표액
  const progressPercentage = Math.round(((item.fundedAmount || 0) / targetAmount) * 100);

  // 배지 설정
  const badgeConfig = {
    'popular': {
      text: '인기 펀딩',
      color: '#FF5B61'
    },
    'achievement': {
      text: '달성 임박',
      color: '#4CAF50'
    }
  };

  return {
    id: item.fundingId,
    title: item.title || '',
    description: item.description || '',
    targetAmount: targetAmount, // 임시 목표액
    currentAmount: item.fundedAmount || 0,
    progressPercentage: progressPercentage,
    // 대표 이미지를 product.image에서 가져옴
    imageUrl: item.product?.image || '',
    badgeText: badgeConfig[badgeType].text,
    badgeColor: badgeConfig[badgeType].color
  };
};

function FundingListPage() {
  // 추가: useNavigate 훅 사용
  const navigate = useNavigate();

  // API에서 가져온 전체 펀딩 데이터
  const [fundings, setFundings] = useState<FundingItemAPI[]>([]);
  // 선택된 카테고리 상태 관리
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  // 선택된 정렬 옵션 상태 관리
  const [selectedSort, setSelectedSort] = useState<string>('latest');
  // 로딩 상태 관리
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // 선택된 상태 필터 (전체/진행중/완료)
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'pending' | 'completed'>('pending');

  // 하이라이트용 데이터
  const [popularHighlightItems, setPopularHighlightItems] = useState<HighlightItem[]>([]);
  const [achievementHighlightItems, setAchievementHighlightItems] = useState<HighlightItem[]>([]);

  // 무한 스크롤 관련 상태
  const [visibleCount, setVisibleCount] = useState<number>(12); // 초기에 12개 아이템
  const [hasMore, setHasMore] = useState<boolean>(true); // 더 로드할 항목이 있는지
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null); // 관찰할 요소 참조

  // API에서 펀딩 데이터 가져오기
  const fetchFundings = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log('펀딩 데이터 가져오기 시작');

      // 토큰 가져오기 - 로컬 스토리지에서 올바른 토큰 가져오기
      // 로그에서 사용자 정보가 'token'이 아닌 다른 키로 저장된 것으로 보임
      const accessToken = localStorage.getItem('access_token') ||
        localStorage.getItem('auth_token') ||
        localStorage.getItem('jwt_token');

      // Redux 스토어에서 토큰 정보 확인 (디버깅용)
      console.log('로컬 스토리지 토큰:', accessToken);

      // API 요청 URL 및 옵션 설정
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/fundings/list`;
      console.log('API 요청 URL:', apiUrl);

      // 인증 헤더 설정 - Bearer 토큰 형식으로 전송
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };

      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }

      const config = {
        headers,
        withCredentials: true // 쿠키 전송 (필요한 경우)
      };

      console.log('API 요청 설정:', {
        hasToken: !!accessToken,
        withCredentials: true,
        tokenHeader: accessToken ? 'Bearer ' + accessToken.substring(0, 10) + '...' : 'none'
      });

      // 요청 전송
      const response = await axios.get(apiUrl, config);
      const data = response.data;

      console.log('API 응답 데이터:', data);

      // 응답이 배열인지 확인하고 처리
      const fundingList = Array.isArray(data) ? data : [];
      console.log('처리할 데이터 개수:', fundingList.length);
      setFundings(fundingList);

      // 데이터가 비어있는 경우 빈 배열 처리
      if (fundingList.length === 0) {
        console.log('API에서 데이터 없음');
        setPopularHighlightItems([]);
        setAchievementHighlightItems([]);
        return;
      }

      // 인기 펀딩과 달성 임박 펀딩 설정 (참여자 수와 펀딩액 기준으로)
      const sortedByPopularity = [...fundingList].sort((a, b) =>
        (b.participantsNumber || 0) - (a.participantsNumber || 0)
      ).slice(0, 5);

      console.log('인기 펀딩 데이터:', sortedByPopularity);

      const sortedByAchievement = [...fundingList].sort((a, b) =>
        (b.fundedAmount || 0) - (a.fundedAmount || 0)
      ).slice(0, 5);

      console.log('달성 임박 펀딩 데이터:', sortedByAchievement);

      // 하이라이트 아이템 형식으로 변환
      const popularHighlights = sortedByPopularity.map(item =>
        mapToHighlightItem(item, 'popular')
      ).filter(Boolean); // null 값 제거

      console.log('변환된 인기 하이라이트:', popularHighlights);

      const achievementHighlights = sortedByAchievement.map(item =>
        mapToHighlightItem(item, 'achievement')
      ).filter(Boolean); // null 값 제거

      console.log('변환된 달성 하이라이트:', achievementHighlights);

      setPopularHighlightItems(popularHighlights);
      setAchievementHighlightItems(achievementHighlights);
    } catch (error) {
      console.error('펀딩 데이터 가져오기 실패:', error);
      // 에러 상세 로깅
      if (axios.isAxiosError(error)) {
        console.error('API 에러 상세:', {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data
        });
      }
      // 에러 시 빈 배열로 초기화
      setFundings([]);
      setPopularHighlightItems([]);
      setAchievementHighlightItems([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 컴포넌트 마운트 시 데이터 가져오기
  useEffect(() => {
    console.log("FundingListPage 컴포넌트 마운트됨");
    fetchFundings();
  }, [fetchFundings]);

  // 카테고리 변경 핸들러
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    // 카테고리 변경 시 필터링 초기화
    resetPagination();
  };

  // 정렬 옵션 변경 핸들러
  const handleSortChange = (sortId: string) => {
    setSelectedSort(sortId);
    // 정렬 변경 시 필터링 초기화
    resetPagination();
  };

  // 상태 필터 변경 핸들러
  const handleStatusChange = (status: 'all' | 'pending' | 'completed') => {
    setSelectedStatus(status);
    // 상태 필터 변경 시 필터링 초기화
    resetPagination();
  };

  // 페이지네이션 초기화
  const resetPagination = () => {
    setVisibleCount(12);
    setHasMore(true);
  };

  // 상태별 필터링 (API 값에 맞게 수정)
  const filterByStatus = (items: FundingItemAPI[]) => {
    // 항상 배열인지 확인
    if (!Array.isArray(items)) return [];

    // status 값 디버깅
    if (items.length > 0) {
      console.log('첫 번째 아이템 status 값:', items[0].status);
    }

    // API의 status 값이 한글로 변경됨
    // 전체: 대기, 완료, 배송 중, 배송 완료 (취소 제외)
    // 진행중: 대기
    // 완료: 완료, 배송 중, 배송 완료
    if (selectedStatus === 'all') {
      // '취소' 상태만 제외하고 모두 표시
      return items.filter(item => item && item.status !== '취소');
    } else if (selectedStatus === 'pending') {
      // 진행중: 대기
      return items.filter(item => item && item.status === '대기');
    } else if (selectedStatus === 'completed') {
      // 완료: 완료, 배송 중, 배송 완료
      return items.filter(item =>
        item && (item.status === '완료' || item.status === '배송 중' || item.status === '배송 완료')
      );
    }

    return items;
  };

  // 정렬 함수
  const sortItems = (items: FundingItemAPI[]) => {
    // 항상 배열인지 확인
    if (!Array.isArray(items)) return [];

    switch (selectedSort) {
      case 'latest':
        return [...items].sort((a, b) =>
          new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
        );
      case 'deadline':
        // 마감임박순 (API에 마감일 필드가 없으면 수정 필요)
        return [...items];
      case 'achievement':
        // 달성률순 (API에 목표액 필드가 없으면 수정 필요)
        return [...items].sort((a, b) => (b.fundedAmount || 0) - (a.fundedAmount || 0));
      default:
        return items;
    }
  };

  // 필터링 및 정렬 적용
  const filteredByStatus = filterByStatus(fundings || []);

  // 카테고리 필터링
  const filteredItems = Array.isArray(filteredByStatus)
    ? filteredByStatus.filter(item =>
      item && (selectedCategory === 'all' || item.category === selectedCategory)
    )
    : [];

  // 최종 정렬된 데이터
  const processedFundings = sortItems(filteredItems);

  // API 응답을 그리드 컴포넌트에 맞게 변환
  const mappedFundings = processedFundings.slice(0, visibleCount)
    .map(mapToFundingGridItem)
    .filter(Boolean); // null 값 제거

  // 더 로드할 데이터 확인
  useEffect(() => {
    if (visibleCount >= processedFundings.length) {
      setHasMore(false);
    } else {
      setHasMore(true);
    }
  }, [visibleCount, processedFundings.length]);

  // 추가 데이터 로드 함수
  const loadMoreItems = useCallback(() => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);

    // 실제 API 페이지네이션 대신 클라이언트 사이드 페이지네이션 사용
    setTimeout(() => {
      setVisibleCount(prevCount => prevCount + 8); // 8개씩 추가 로드
      setIsLoading(false);
    }, 800);
  }, [isLoading, hasMore]);

  // Intersection Observer 설정
  useEffect(() => {
    // Observer 콜백 함수
    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !isLoading) {
        loadMoreItems();
      }
    };

    // Observer 인스턴스 생성
    const observer = new IntersectionObserver(handleObserver, {
      root: null, // 뷰포트를 root로 사용
      rootMargin: '0px',
      threshold: 0.1 // 10% 정도 보이면 콜백 실행
    });

    // Observer 연결
    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    // 정리 함수
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, isLoading, loadMoreItems]);

  // 펀딩 아이템 클릭 핸들러
  const handleItemClick = (id: number) => {
    navigate(`/funding/${id}`);
  };

  return (
    <div className="w-full p-0 m-0 overflow-hidden relative">
      {/* 상단 하이라이트 섹션 - 와디즈 스타일로 풀스크린 너비로 변경 */}
      <div
        className="w-full"
        style={{
          position: 'relative',
          height: '440px',
          margin: 0,
          padding: 0,
          overflow: 'visible'
        }}
      >
        <FundingHighlights
          popularItems={popularHighlightItems}
          achievementItems={achievementHighlightItems}
        />
      </div>

      {/* 메인 콘텐츠 영역 - 와디즈 스타일로 최대 너비 설정 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        {/* 카테고리 탭 */}
        <div className="mb-8">
          <CategoryTabs
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
        </div>

        {/* 필터 및 정렬 영역 */}
        <div className="flex justify-between items-center mb-6">
          <StatusFilter
            selectedStatus={selectedStatus}
            onStatusChange={handleStatusChange}
          />
          <SortOptions
            selectedSort={selectedSort}
            onSortChange={handleSortChange}
          />
        </div>

        {/* 펀딩 목록 */}
        <div className="mb-12">
          <FundingGrid
            fundings={mappedFundings}
            isLoading={isLoading}
            onItemClick={(id) => handleItemClick(id)}
          />
        </div>

        {/* 무한 스크롤 로딩 표시 - 이 요소가 화면에 보이면 추가 로딩 시작 */}
        <div ref={loadingRef} className="w-full flex justify-center my-8 pb-4">
          {isLoading && <LoadingSpinner className="my-10" />}
          {!isLoading && !hasMore && mappedFundings.length > 0 && (
            <div className="text-gray-500 text-sm my-3">
              모든 펀딩을 불러왔습니다.
            </div>
          )}
          {!isLoading && !hasMore && mappedFundings.length === 0 && (
            <div className="text-gray-500 text-sm my-3 p-8 text-center w-full">
              해당 조건에 맞는 펀딩이 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FundingListPage;