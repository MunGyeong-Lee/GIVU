import { FundingItem } from '../components/FundingGrid';
import { allFundingItems } from './dummyData';
import { HighlightItem } from '../components/FundingHighlights';

// FundingItem을 HighlightItem으로 변환
const mapToHighlightItem = (item: FundingItem, badgeText: string, badgeColor: string): HighlightItem => ({
  id: item.id,
  title: item.title,
  description: item.description,
  targetAmount: item.targetAmount || 0,
  currentAmount: item.currentAmount,
  progressPercentage: item.progressPercentage || 0,
  imageUrl: item.imageUrl,
  type: 'popular',
  remainingDays: 0,
  participantsCount: item.parcitipantsNumber || 0,
  badgeText,
  badgeColor
});

// 인기 펀딩 필터링
export const getPopularFundings = (): HighlightItem[] => {
  return allFundingItems
    .filter(item => item.isPopular)
    .slice(0, 5)
    .map(item => mapToHighlightItem(item, '인기 TOP', '#FF5B61'));
};

// 달성 임박 펀딩 필터링
export const getAchievementFundings = (): HighlightItem[] => {
  return allFundingItems
    .filter(item => item.isAchievement || (item.progressPercentage ?? 0) >= 90)
    .slice(0, 5)
    .map(item => mapToHighlightItem(item, '달성 임박', '#4CAF50'));
};

// 카테고리별 필터링
export const getFundingsByCategory = (category: string): FundingItem[] => {
  if (category === 'all') return allFundingItems;
  return allFundingItems.filter(item => item.category === category);
};

// 상태별 필터링 (전체/진행중/완료)
export const getFundingsByStatus = (status: 'all' | 'pending' | 'completed'): FundingItem[] => {
  if (status === 'all') return allFundingItems;
  
  if (status === 'pending') {
    return allFundingItems.filter(item => 
      item.status === 'PENDING' || item.status === 'IN_PROGRESS'
    );
  }
  
  return allFundingItems.filter(item => 
    ['COMPLETED', 'CANCELED', 'SHIPPING', 'DELIVERED'].includes(item.status || '')
  );
};

// 정렬 함수
export const sortFundings = (
  fundings: FundingItem[], 
  sortOption: 'latest' | 'oldest' | 'popular' | 'achievement'
): FundingItem[] => {
  switch (sortOption) {
    case 'latest':
      return [...fundings].sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
    case 'oldest':
      return [...fundings].sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateA - dateB;
      });
    case 'popular':
      return [...fundings].sort((a, b) => 
        (b.parcitipantsNumber || 0) - (a.parcitipantsNumber || 0)
      );
    case 'achievement':
      return [...fundings].sort((a, b) => 
        (b.progress || b.progressPercentage || 0) - (a.progress || a.progressPercentage || 0)
      );
    default:
      return fundings;
  }
};
