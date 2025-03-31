import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import FundingGrid from './components/FundingGrid';
import CategoryTabs from './components/CategoryTabs';
import SortOptions from './components/SortOptions';
import FundingHighlights from './components/FundingHighlights';
import LoadingSpinner from './components/LoadingSpinner';
import StatusFilter from './components/StatusFilter';
import {
  getPopularFundings,
  getAchievementFundings,
  // getFundingsByCategory,
  getFundingsByStatus,
  sortFundings
} from './data/dataUtils';

function FundingListPage() {
  // 추가: useNavigate 훅 사용
  const navigate = useNavigate();

  // 선택된 카테고리 상태 관리
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  // 선택된 정렬 옵션 상태 관리
  const [selectedSort, setSelectedSort] = useState<string>('latest');
  // 로딩 상태 관리
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // 선택된 상태 필터 (전체/진행중/완료)
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'pending' | 'completed'>('pending');

  // 무한 스크롤 관련 상태
  const [visibleCount, setVisibleCount] = useState<number>(12); // 초기에 12개 아이템
  const [hasMore, setHasMore] = useState<boolean>(true); // 더 로드할 항목이 있는지
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null); // 관찰할 요소 참조

  // 인기 펀딩과 달성 임박 펀딩 데이터 가져오기 (하이라이트용)
  const popularHighlightItems = getPopularFundings();
  const achievementHighlightItems = getAchievementFundings();

  // 정렬 옵션 더미 데이터
  // const sortOptions = [
  //   { id: 'latest', name: '최신순' },
  //   { id: 'deadline', name: '마감임박순' },
  //   { id: 'achievement', name: '달성률순' }
  // ] as any;

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

  // 필터링 및 정렬된 펀딩 목록
  // const filteredByCategory = getFundingsByCategory(selectedCategory);
  const filteredByStatus = getFundingsByStatus(selectedStatus);

  // 카테고리와 상태 모두로 필터링된 결과
  const filteredItems = filteredByStatus.filter(item =>
    selectedCategory === 'all' || item.category === selectedCategory
  );

  // 최종 정렬된 데이터
  const processedFundings = sortFundings(filteredItems, selectedSort as any);

  // 현재 보여줄 데이터
  const visibleFundings = processedFundings.slice(0, visibleCount);

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

    // 로딩 딜레이 시뮬레이션 (실제 API 호출 시에는 이 부분이 API 호출로 대체됨)
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

  // 컴포넌트 로드 시 디버깅 로그
  useEffect(() => {
    console.log("FundingListPage 컴포넌트 마운트됨");

    // 초기 로딩 상태 시뮬레이션
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

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
            fundings={visibleFundings}
            isLoading={visibleFundings.length === 0 && isLoading}
            onItemClick={handleItemClick}
          />
        </div>

        {/* 무한 스크롤 로딩 표시 - 이 요소가 화면에 보이면 추가 로딩 시작 */}
        <div ref={loadingRef} className="w-full flex justify-center my-8 pb-4">
          {isLoading && <LoadingSpinner className="my-10" />}
          {!isLoading && !hasMore && visibleFundings.length > 0 && (
            <div className="text-gray-500 text-sm my-3">
              모든 펀딩을 불러왔습니다.
            </div>
          )}
          {!isLoading && !hasMore && visibleFundings.length === 0 && (
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