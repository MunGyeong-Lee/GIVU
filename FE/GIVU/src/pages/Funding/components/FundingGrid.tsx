import React from 'react';
import FundingCard from './FundingCard';

// 그리드에 표시할 펀딩 타입 정의
export interface FundingItem {
  id: number;
  title: string;
  description: string;
  currentAmount: number;
  progressPercentage: number; // 필수 값으로 변경
  imageUrl?: string;
  creatorName: string;
  isPopular?: boolean;
  isAchievement?: boolean;
  category?: string;
  status?: string;
  createdAt?: string;
  parcitipantsNumber?: number;
  progress?: number;
  targetAmount?: number;
  onClick?: () => void;
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
          <div
            key={item}
            className="rounded-lg overflow-hidden bg-white shadow-sm flex flex-col"
            style={{ height: '320px' }}
          >
            {/* 이미지 영역 스켈레톤 */}
            <div className="relative w-full" style={{ height: '180px' }}>
              <div className="w-full h-full bg-gray-200 animate-pulse"></div>
            </div>

            {/* 콘텐츠 영역 스켈레톤 */}
            <div className="p-3 flex-1 flex flex-col justify-between">
              {/* 상단 정보 스켈레톤 */}
              <div>
                <div className="h-[32px]">
                  <div className="h-3 bg-gray-200 rounded animate-pulse mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
                </div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-1/3 mt-1"></div>
              </div>

              {/* 하단 정보 스켈레톤 - 카드 하단에 고정 */}
              <div>
                <div className="h-1 bg-gray-200 rounded animate-pulse mb-1.5"></div>
                <div className="flex justify-between items-center">
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-1/3"></div>
                  <div className="h-2 bg-gray-200 rounded animate-pulse w-1/4"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {fundings.map((funding) => (
        <FundingCard
          key={funding.id}
          id={funding.id}
          title={funding.title}
          description={funding.description}
          currentAmount={funding.currentAmount}
          progressPercentage={funding.progressPercentage}
          imageUrl={funding.imageUrl}
          creatorName={funding.creatorName}
          status={funding.status}
          onClick={() => handleCardClick(funding.id)}
        />
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
