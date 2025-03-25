import React from 'react';
import FundingCard from './FundingCard';

// 그리드에 표시할 펀딩 타입 정의
export interface FundingItem {
  id: number;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  progressPercentage?: number;
  imageUrl?: string;
  creatorName: string;
}

interface FundingGridProps {
  fundings: FundingItem[];
  isLoading?: boolean;
  onItemClick?: (id: number) => void;
}

const FundingGrid: React.FC<FundingGridProps> = ({
  fundings = [],
  isLoading = false,
  onItemClick
}) => {
  // 펀딩 카드 클릭 핸들러
  const handleCardClick = (id: number) => {
    if (onItemClick) {
      onItemClick(id);
    }
  };

  // 로딩 중 스켈레톤 UI
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
          <div key={item} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <div className="aspect-w-16 aspect-h-9 bg-gray-200 animate-pulse"></div>
            <div className="p-4">
              <div className="h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse mb-4 w-2/3"></div>
              <div className="flex justify-between mb-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4"></div>
              </div>
              <div className="h-2 bg-gray-200 rounded animate-pulse mb-4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {fundings.map((funding) => (
        <div key={funding.id} onClick={() => handleCardClick(funding.id)}>
          <FundingCard
            id={funding.id}
            title={funding.title}
            description={funding.description}
            targetAmount={funding.targetAmount}
            currentAmount={funding.currentAmount}
            progressPercentage={funding.progressPercentage}
            imageUrl={funding.imageUrl}
            creatorName={funding.creatorName}
          />
        </div>
      ))}

      {/* 데이터가 없을 때 보여줄 메시지 */}
      {fundings.length === 0 && !isLoading && (
        <div className="col-span-full text-center py-12">
          <div className="text-gray-500">펀딩 프로젝트가 없습니다.</div>
        </div>
      )}
    </div>
  );
};

export default FundingGrid;
