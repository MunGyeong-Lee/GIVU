import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import FundingGrid from './components/FundingGrid';
import CategoryTabs from './components/CategoryTabs';
import SortOptions from './components/SortOptions';
import FundingHighlights from './components/FundingHighlights';
import LoadingSpinner from './components/LoadingSpinner';
import StatusFilter from './components/StatusFilter';
import { FundingItem as FundingGridItem } from './components/FundingGrid';
import { HighlightItem } from './components/FundingHighlights';
import { FaSearch } from 'react-icons/fa';


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
  hidden: boolean; // 친구만 볼 수 있는 펀딩 여부
}

// API 응답을 FundingGrid 컴포넌트 형식으로 변환하는 함수
const mapToFundingGridItem = (item: FundingItemAPI): FundingGridItem => {
  if (!item) return null as any; // 아이템이 없는 경우 처리

  // 진행률 계산 (상품 가격 대비 펀딩액 비율로 계산)
  const targetAmount = item.product?.price || 100000; // 상품 가격을 목표액으로 사용
  const progressPercentage = Math.min(Math.round(((item.fundedAmount || 0) / targetAmount) * 100), 100);

  return {
    id: item.fundingId,
    title: item.title || '',
    description: item.description || '',
    currentAmount: item.fundedAmount || 0,
    progressPercentage: progressPercentage,
    // 대표 이미지를 product.image에서 가져옴
    imageUrl: item.product?.image || '',
    creatorName: item.user?.nickName || '',
    category: item.category || '',
    status: item.status || '',
    createdAt: item.createdAt || '',
    parcitipantsNumber: item.participantsNumber || 0, // 오타 주의: parcitipantsNumber로 되어 있음
    hidden: item.hidden || false, // hidden 속성 추가
  };
};

/**
 * 종료일까지 남은 일수를 계산하는 함수
 * @param endDate 종료일(문자열)
 * @returns 남은 일수(정수)
 */
const calculateDaysLeft = (endDate: string): number => {
  if (!endDate) return 0;

  const today = new Date();
  const end = new Date(endDate);

  // 날짜 차이 계산 (밀리초)
  const diffTime = end.getTime() - today.getTime();

  // 일수로 변환
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // 음수일 경우 0 반환
  return diffDays < 0 ? 0 : diffDays;
};

/**
 * API 응답을 하이라이트 아이템으로 변환하는 함수
 */
const mapToHighlightItem = (item: FundingItemAPI): HighlightItem => {
  if (!item) return null as any;

  const targetAmount = item.product?.price || 100000;
  const progressPercentage = Math.min(Math.round(((item.fundedAmount || 0) / targetAmount) * 100), 100);

  return {
    id: item.fundingId,
    title: item.title || '',
    imageUrl: item.product?.image || '/placeholder-image.jpg',
    progressPercentage: progressPercentage,
    targetAmount: targetAmount,
    currentAmount: item.fundedAmount || 0,
    type: progressPercentage >= 100 ? 'achievement' : 'popular',
    remainingDays: calculateDaysLeft(item.createdAt),
    participantsCount: item.participantsNumber || 0,
    description: item.description || '',
    badgeText: progressPercentage >= 100 ? '달성' : `${progressPercentage}%`,
    badgeColor: progressPercentage >= 100 ? 'bg-green-500' : 'bg-primary',
    hidden: item.hidden || false // hidden 속성 추가
  };
};

function FundingListPage() {
  // URL 쿼리 파라미터 처리를 위한 훅 추가
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // 검색어 상태 관리 추가
  const [searchTerm, setSearchTerm] = useState<string>('');

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
  const [initialLoading, setInitialLoading] = useState<boolean>(true); // 초기 로딩 상태 추가

  // API에서 펀딩 데이터 가져오기
  const fetchFundings = useCallback(async () => {
    setIsLoading(true);
    setInitialLoading(true); // 초기 데이터 로딩 시에만 true
    try {
      console.log('펀딩 데이터 가져오기 시작');

      // 토큰 가져오기 - 로컬 스토리지에서 올바른 토큰 가져오기
      const accessToken = localStorage.getItem('access_token') ||
        localStorage.getItem('auth_token') ||
        localStorage.getItem('jwt_token');

      // API 요청 URL 및 옵션 설정
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/fundings/list`;

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

      // 요청 전송
      const response = await axios.get(apiUrl, config);
      const data = response.data;

      // 응답이 배열인지 확인하고 처리
      const fundingList = Array.isArray(data) ? data : [];

      // 디버깅: API 응답 데이터 로깅
      console.log('API 응답 데이터:', fundingList);
      // 카테고리 값 확인
      if (fundingList.length > 0) {
        console.log('첫 번째 아이템 카테고리:', fundingList[0].category);
        console.log('첫 번째 아이템 상태:', fundingList[0].status);

        // 모든 고유 카테고리 값 로깅
        const uniqueCategories = [...new Set(fundingList.map(item => item.category))];
        console.log('고유 카테고리 목록:', uniqueCategories);

        // 모든 고유 상태 값 로깅
        const uniqueStatuses = [...new Set(fundingList.map(item => item.status))];
        console.log('고유 상태 목록:', uniqueStatuses);
      }

      setFundings(fundingList);

      // 데이터가 비어있는 경우 빈 배열 처리
      if (fundingList.length === 0) {
        console.log('API에서 데이터 없음');
        setPopularHighlightItems([]);
        setAchievementHighlightItems([]);
        return;
      }

      // 인기 펀딩과 달성 임박 펀딩 설정 (참여자 수와 펀딩액 기준으로)
      // hidden이 false인 펀딩만 필터링
      const publicFundings = fundingList.filter(item => !item.hidden);

      const sortedByPopularity = [...publicFundings].sort((a, b) =>
        (b.participantsNumber || 0) - (a.participantsNumber || 0)
      ).slice(0, 5);

      const sortedByAchievement = [...publicFundings].sort((a, b) =>
        (b.fundedAmount || 0) - (a.fundedAmount || 0)
      ).slice(0, 5);

      // 하이라이트 아이템 형식으로 변환
      const popularHighlights = sortedByPopularity.map(item =>
        mapToHighlightItem(item)
      );

      const achievementHighlights = sortedByAchievement.map(item =>
        mapToHighlightItem(item)
      );

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
      setInitialLoading(false); // 초기 로딩 완료
    }
  }, []);

  // 컴포넌트 마운트 시 데이터 가져오기
  useEffect(() => {
    console.log("FundingListPage 컴포넌트 마운트됨");
    fetchFundings();
  }, [fetchFundings]);

  // 컴포넌트 마운트 시 URL에서 검색어 파라미터 가져오기
  useEffect(() => {
    const queryParam = searchParams.get('q');
    if (queryParam) {
      setSearchTerm(queryParam);
    }
  }, [searchParams]);

  // 카테고리 변경 핸들러
  const handleCategoryChange = (categoryId: string) => {
    console.log('카테고리 변경:', categoryId);
    setSelectedCategory(categoryId);
    // 카테고리 변경 시 필터링 초기화
    setVisibleCount(12);
    setHasMore(true);

    // 카테고리 변경은 클라이언트 사이드 필터링이므로 로딩 상태를 짧게 유지
    setInitialLoading(true);
    setTimeout(() => {
      setInitialLoading(false);
    }, 300);
  };

  // 정렬 옵션 변경 핸들러
  const handleSortChange = (sortId: string) => {
    console.log('정렬 옵션 변경:', sortId);
    setSelectedSort(sortId);
    // 정렬 변경 시 필터링 초기화
    setVisibleCount(12);
    setHasMore(true);

    // 정렬 변경은 클라이언트 사이드 필터링이므로 로딩 상태를 짧게 유지
    setInitialLoading(true);
    setTimeout(() => {
      setInitialLoading(false);
    }, 300);
  };

  // 상태 필터 변경 핸들러
  const handleStatusChange = (status: 'all' | 'pending' | 'completed') => {
    console.log('상태 필터 변경:', status);
    setSelectedStatus(status);
    // 상태 필터 변경 시 필터링 초기화
    setVisibleCount(12);
    setHasMore(true);

    // 상태 필터 변경은 클라이언트 사이드 필터링이므로 로딩 상태를 짧게 유지
    setInitialLoading(true);
    setTimeout(() => {
      setInitialLoading(false);
    }, 300);
  };

  // 페이지네이션 초기화 - 검색 시에만 사용
  const resetPagination = () => {
    setVisibleCount(12);
    setHasMore(true);
    setInitialLoading(true);

    // 타임아웃으로 초기 로딩 상태 리셋
    setTimeout(() => {
      setInitialLoading(false);
    }, 500);
  };

  // 추가: 검색어 필터링 함수
  const filterBySearchTerm = (items: FundingItemAPI[]) => {
    if (!searchTerm.trim()) return items;

    return items.filter(item =>
      (item.title && item.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  // API 카테고리 값을 프론트엔드 카테고리 값으로 매핑하는 함수
  const mapApiCategoryToFrontend = (apiCategory: string): string => {
    // API 카테고리(한글)와 프론트엔드 카테고리(영어) 간의 매핑
    const categoryMap: Record<string, string> = {
      '생일': 'birthday',
      '집들이': 'housewarming',
      '결혼': 'wedding',
      '출산': 'birth',
      '졸업': 'graduation',
      '취직': 'employment',
      '취업': 'employment', // 취업/취직 두 가지 경우 모두 대비
      '기타': 'all'
    };

    // 카테고리 값이 없거나 매핑되지 않은 값인 경우 'all' 반환
    if (!apiCategory || !categoryMap[apiCategory]) {
      console.log('매핑되지 않은 카테고리:', apiCategory);
      return 'all';
    }

    return categoryMap[apiCategory];
  };

  // 상태별 필터링 (API 값에 맞게 수정)
  const filterByStatus = (items: FundingItemAPI[]) => {
    // 항상 배열인지 확인
    if (!Array.isArray(items)) return [];

    console.log('상태 필터링 전 아이템 수:', items.length);
    console.log('현재 선택된 상태:', selectedStatus);

    let filteredResult = [];

    // status가 null 또는 undefined인 경우 기본값 '대기'로 처리
    const safeItems = items.map(item => ({
      ...item,
      status: item.status || '대기'
    }));

    // API의 status 값이 한글로 변경됨
    // 전체: 대기, 완료, 배송 중, 배송 완료 (취소 제외)
    // 진행중: 대기
    // 완료: 완료, 배송 중, 배송 완료
    if (selectedStatus === 'all') {
      // '취소' 상태만 제외하고 모두 표시
      filteredResult = safeItems.filter(item => item.status !== '취소');
    } else if (selectedStatus === 'pending') {
      // 진행중: 대기
      filteredResult = safeItems.filter(item => item.status === '대기');
    } else if (selectedStatus === 'completed') {
      // 완료: 완료, 배송 중, 배송 완료
      filteredResult = safeItems.filter(item =>
        item.status === '완료' || item.status === '배송 중' || item.status === '배송 완료'
      );
    } else {
      filteredResult = safeItems;
    }

    console.log('상태 필터링 후 아이템 수:', filteredResult.length);
    if (filteredResult.length === 0 && items.length > 0) {
      console.log('상태 필터 일치하는 항목 없음. 상태 값 샘플:', items.slice(0, 3).map(item => item.status));
    }

    return filteredResult;
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
      case 'oldest':
        return [...items].sort((a, b) =>
          new Date(a.createdAt || '').getTime() - new Date(b.createdAt || '').getTime()
        );
      case 'popular':
        // 인기순 - 참여자 수 기준
        return [...items].sort((a, b) => (b.participantsNumber || 0) - (a.participantsNumber || 0));
      case 'achievement':
        // 달성률순 계산
        return [...items].sort((a, b) => {
          const aProgress = a.product && a.product.price ? (a.fundedAmount / a.product.price) : 0;
          const bProgress = b.product && b.product.price ? (b.fundedAmount / b.product.price) : 0;
          return bProgress - aProgress;
        });
      default:
        return items;
    }
  };

  // 필터링 및 정렬 적용 부분 수정
  const filteredByStatus = filterByStatus(fundings || []);

  // 검색어 필터링 추가
  const filteredBySearch = filterBySearchTerm(filteredByStatus);

  // 카테고리 필터링
  const filteredItems = Array.isArray(filteredBySearch)
    ? filteredBySearch.filter(item => {
      if (!item) return false;

      if (selectedCategory === 'all') return true;

      // API 카테고리 값(한글)을 프론트엔드 카테고리 값(영어)으로 변환
      const mappedCategory = mapApiCategoryToFrontend(item.category);

      console.log('아이템 한글 카테고리:', item.category);
      console.log('매핑된 카테고리:', mappedCategory);
      console.log('선택된 카테고리:', selectedCategory);

      return mappedCategory === selectedCategory;
    })
    : [];

  console.log('카테고리 필터링 전 아이템 수:', filteredBySearch.length);
  console.log('카테고리 필터링 후 아이템 수:', filteredItems.length);
  if (filteredItems.length === 0 && filteredBySearch.length > 0) {
    console.log('카테고리 일치하는 항목 없음. 선택된 카테고리:', selectedCategory);
    console.log('카테고리 값 샘플:', filteredBySearch.slice(0, 3).map(item => item.category));
  }

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
    // 여기서는 initialLoading은 false로 유지 (초기 로딩이 아닌 추가 로딩)

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

  // 검색 제출 핸들러 추가
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 검색어가 변경되었을 때만 URL 파라미터 업데이트
    if (searchTerm.trim()) {
      // URL 파라미터에 검색어 추가
      setSearchParams({ q: searchTerm.trim(), ...Object.fromEntries(searchParams.entries()) });
    } else {
      // 검색어가 비어있으면 q 파라미터 제거
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('q');
      setSearchParams(newParams);
    }

    // 리스트 초기화
    resetPagination();
  };

  // 필터링 및 정렬 적용 부분 수정
  useEffect(() => {
    // 필터링된 결과가 준비되면 로딩 상태 해제
    setInitialLoading(false);
  }, [processedFundings]);

  // 필터링된 결과가 비어있는 경우 즉시 로딩 상태 해제
  useEffect(() => {
    if (filteredItems.length === 0 && initialLoading) {
      // 필터링된 결과가 없으면 스켈레톤 UI 즉시 해제
      setInitialLoading(false);
    }
  }, [filteredItems, initialLoading]);

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
          isLoading={initialLoading}
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

        {/* 검색바 추가 */}
        <div className="mb-6">
          <form onSubmit={handleSearchSubmit} className="relative max-w-md mx-auto">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="원하는 펀딩을 검색해보세요"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 rounded-full px-5 py-2.5 pr-10 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder-gray-400 text-sm"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                aria-label="검색"
              >
                <FaSearch className="h-4 w-4" />
              </button>
            </div>
            {searchTerm && (
              <div className="text-xs text-gray-500 mt-1 ml-2">
                &ldquo;{searchTerm}&rdquo; 검색 결과
              </div>
            )}
          </form>
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
            isLoading={initialLoading && processedFundings.length > 0} // 결과가 있는 경우에만 스켈레톤 표시
            onItemClick={(id) => handleItemClick(id)}
          />

          {/* 필터링된 결과가 없고, 로딩 중이 아닐 때 메시지 표시 */}
          {!initialLoading && mappedFundings.length === 0 && (
            <div className="text-gray-500 text-sm my-10 p-8 text-center w-full">
              {searchTerm ? `'${searchTerm}'에 대한 검색 결과가 없습니다.` : '해당 조건에 맞는 펀딩이 없습니다.'}
            </div>
          )}
        </div>

        {/* 무한 스크롤 로딩 표시 - 이 요소가 화면에 보이면 추가 로딩 시작 */}
        <div ref={loadingRef} className="w-full flex justify-center my-8 pb-4">
          {isLoading && !initialLoading && mappedFundings.length > 0 && <LoadingSpinner className="my-10" />}
          {!isLoading && !hasMore && mappedFundings.length > 0 && (
            <div className="text-gray-500 text-sm my-3">
              모든 펀딩을 불러왔습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FundingListPage;