import React, { useState, useEffect } from 'react';
import FundingGrid, { FundingItem } from './components/FundingGrid';
import CategoryTabs, { CategoryItem } from './components/CategoryTabs';
import SortOptions, { SortOption } from './components/SortOptions';
import FundingHighlights, { HighlightItem } from './components/FundingHighlights';
import LoadingSpinner from './components/LoadingSpinner';

function FundingListPage() {
  // 선택된 카테고리 상태 관리
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  // 선택된 정렬 옵션 상태 관리
  const [selectedSort, setSelectedSort] = useState<string>('latest');
  // 로딩 상태 관리
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 하이라이트 인기 펀딩 더미 데이터
  const popularHighlightItems: HighlightItem[] = [
    {
      id: 101,
      title: '맨손 설거지 가능한',
      description: '100% 천연 설거지바',
      targetAmount: 1000000,
      currentAmount: 700000,
      progressPercentage: 70,
      badgeText: '인기 TOP',
      badgeColor: '#FF5B61',
      imageUrl: 'https://images.unsplash.com/photo-1580757468214-c73f7062a5cb?w=800'
    },
    {
      id: 102,
      title: '미끌림 없는 욕실 바닥',
      description: '2만원으로 완성 뽀송하게',
      targetAmount: 1500000,
      currentAmount: 900000,
      progressPercentage: 60,
      badgeText: '인기 TOP',
      badgeColor: '#FF5B61',
      imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800'
    },
    {
      id: 103,
      title: '미니멀리스트를 위한',
      description: '심플한 데일리 백팩',
      targetAmount: 2000000,
      currentAmount: 1800000,
      progressPercentage: 90,
      badgeText: '인기 TOP',
      badgeColor: '#FF5B61',
      imageUrl: 'https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?w=800'
    },
    {
      id: 104,
      title: '디자이너 협업 컬렉션',
      description: '한정판 아트워크 티셔츠',
      targetAmount: 3000000,
      currentAmount: 1500000,
      progressPercentage: 50,
      badgeText: '인기 TOP',
      badgeColor: '#FF5B61',
      imageUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800'
    },
    {
      id: 105,
      title: '어디서나 완벽한 커피',
      description: '휴대용 에스프레소 메이커',
      targetAmount: 5000000,
      currentAmount: 3000000,
      progressPercentage: 60,
      badgeText: '인기 TOP',
      badgeColor: '#FF5B61',
      imageUrl: 'https://images.unsplash.com/photo-1559496417-e7f25cb247f3?w=800'
    }
  ];

  // 하이라이트 달성 임박 더미 데이터
  const achievementHighlightItems: HighlightItem[] = [
    {
      id: 201,
      title: '목표 달성 임박 프로젝트',
      description: '목표 금액 달성이 임박한 프로젝트입니다.',
      targetAmount: 800000,
      currentAmount: 760000,
      progressPercentage: 95,
      badgeText: '달성 임박',
      badgeColor: '#4CAF50',
      imageUrl: 'https://images.unsplash.com/photo-1581622558663-b2e33377dfb2?w=800'
    },
    {
      id: 202,
      title: '당신의 건강을 위한 모닝 그래놀라 키트',
      description: '마지막 기회를 놓치지 마세요!',
      targetAmount: 3000000,
      currentAmount: 2900000,
      progressPercentage: 96,
      badgeText: '달성 임박',
      badgeColor: '#4CAF50',
      imageUrl: 'https://images.unsplash.com/photo-1556761223-4c4282c73f77?w=800'
    },
    {
      id: 203,
      title: '환경을 생각한 대나무 칫솔',
      description: '플라스틱 없는 욕실을 위한 첫걸음',
      targetAmount: 1000000,
      currentAmount: 950000,
      progressPercentage: 95,
      badgeText: '달성 임박',
      badgeColor: '#4CAF50',
      imageUrl: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=800'
    },
    {
      id: 204,
      title: '초고속 무선 충전기',
      description: '30분 만에 100% 충전 완료',
      targetAmount: 2500000,
      currentAmount: 2250000,
      progressPercentage: 90,
      badgeText: '달성 임박',
      badgeColor: '#4CAF50',
      imageUrl: 'https://images.unsplash.com/photo-1618478594486-c65b899c4936?w=800'
    },
    {
      id: 205,
      title: '신개념 스마트 플랜터',
      description: '식물 키우기가 처음인 당신을 위한',
      targetAmount: 1500000,
      currentAmount: 1425000,
      progressPercentage: 95,
      badgeText: '달성 임박',
      badgeColor: '#4CAF50',
      imageUrl: 'https://images.unsplash.com/photo-1462530260150-362f94a9ab66?w=800'
    }
  ];

  // 카테고리 더미 데이터
  const categories: CategoryItem[] = [
    { id: 'all', name: '전체' },
    { id: 'birthday', name: '생일' },
    { id: 'wedding', name: '결혼' },
    { id: 'job', name: '취직' },
    { id: 'anniversary', name: '기념일' }
  ];

  // 정렬 옵션 더미 데이터
  const sortOptions: SortOption[] = [
    { id: 'latest', name: '최신순' },
    { id: 'deadline', name: '마감임박순' },
    { id: 'achievement', name: '달성률순' }
  ];

  // 카테고리 변경 핸들러
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    // 여기에 카테고리 필터링 로직 추가 예정
  };

  // 정렬 옵션 변경 핸들러
  const handleSortChange = (sortId: string) => {
    setSelectedSort(sortId);
    // 여기에 정렬 로직 추가 예정
  };

  // 컴포넌트 내부에 더미 데이터 추가
  const dummyFundings: FundingItem[] = [
    {
      id: 1,
      title: '돌비오디오 장착! 20만원대 초격차 풀스펙 귀멍 빔프로젝터',
      description: '이 펀딩 프로젝트는 여러분의 도움이 필요합니다.',
      targetAmount: 500000,
      currentAmount: 500000,
      progressPercentage: 100,
      imageUrl: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=800',
      creatorName: 'UVISION'
    },
    {
      id: 2,
      title: '고품격 향수 브랜드가 만들면 다른 "1초컷" 냄새 지우개!',
      description: '목표 달성이 얼마 남지 않았습니다!',
      targetAmount: 500000,
      currentAmount: 450000,
      progressPercentage: 90,
      imageUrl: 'https://images.unsplash.com/photo-1563170423-1765d525ecf1?w=800',
      creatorName: '먼슬리121'
    },
    {
      id: 3,
      title: '아이폰 최고의 파트너! 터치할 때마다 만족스러운 15 케이스',
      description: '새로운 프로젝트가 시작되었습니다.',
      targetAmount: 800000,
      currentAmount: 1200000,
      progressPercentage: 50,
      imageUrl: 'https://images.unsplash.com/photo-1592750475358-e33914b17f02?w=800',
      creatorName: '애플친구들'
    },
    {
      id: 4,
      title: '매일 아침 5분이면 충분한 완벽 구강케어 시스템',
      description: '특별한 이벤트를 위한 펀딩입니다.',
      targetAmount: 1500000,
      currentAmount: 3000000,
      progressPercentage: 20,
      imageUrl: 'https://images.unsplash.com/photo-1588528402605-1f9d0eb3a3cd?w=800',
      creatorName: '덴탈케어'
    },
    {
      id: 5,
      title: '안녕, 여름! 올여름 필수템 쿨링 에코백',
      description: '작은 도움이 모여 큰 기쁨이 됩니다.',
      targetAmount: 2000000,
      currentAmount: 1200000,
      progressPercentage: 60,
      imageUrl: 'https://images.unsplash.com/photo-1587467512961-120760940315?w=800',
      creatorName: '여름상점'
    },
    {
      id: 6,
      title: '당신의 건강을 위한 모닝 그래놀라 키트',
      description: '마지막 기회를 놓치지 마세요!',
      targetAmount: 3000000,
      currentAmount: 2900000,
      progressPercentage: 96,
      imageUrl: 'https://images.unsplash.com/photo-1517093157656-b9facb6f8676?w=800',
      creatorName: '건강한아침'
    }
  ];

  // 컴포넌트 로드 시 디버깅 로그
  useEffect(() => {
    console.log("FundingListPage 컴포넌트 마운트됨");
  }, []);

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
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
        </div>

        {/* 정렬 옵션 */}
        <div className="mb-8">
          <SortOptions
            options={sortOptions}
            selectedOption={selectedSort}
            onSortChange={handleSortChange}
          />
        </div>

        {/* 펀딩 목록 */}
        <div className="mb-12">
          <FundingGrid
            fundings={dummyFundings}
            isLoading={isLoading}
            onItemClick={(id) => console.log(`펀딩 ${id} 클릭됨`)}
          />
        </div>

        {/* 무한 스크롤 로딩 표시 */}
        {isLoading && <LoadingSpinner className="my-10" />}
      </div>
    </div>
  );
}

export default FundingListPage;