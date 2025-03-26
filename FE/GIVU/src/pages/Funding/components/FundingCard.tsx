import React, { useState } from 'react';
// 로컬 이미지 import
import defaultImage from '../../../assets/images/default-funding-image.jpg';
// React Icons 추가
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';

// 펀딩 카드에 필요한 props 타입 정의
interface FundingCardProps {
  id: number;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  progressPercentage?: number;
  imageUrl?: string;
  creatorName: string; // 카카오 유저 닉네임 추가
  onClick?: () => void;
  status?: string; // 펀딩 상태 추가 (PENDING, COMPLETED 등)
}

const FundingCard: React.FC<FundingCardProps> = ({
  id,
  title,
  description,
  targetAmount,
  currentAmount,
  progressPercentage,
  imageUrl,
  creatorName,
  onClick,
  status
}) => {
  // 찜하기 상태 관리
  const [isLiked, setIsLiked] = useState(false);
  // 이미지 로딩 상태 관리
  const [imageError, setImageError] = useState(false);
  // 애니메이션 상태 관리
  const [isAnimating, setIsAnimating] = useState(false);
  const [heartScale, setHeartScale] = useState(1);

  // 펀딩 완료 상태 확인
  const isCompleted = status === 'COMPLETED';

  // 백엔드에서 주지 않을 경우 프론트에서 계산 (안전장치)
  const getProgressPercentage = () => {
    if (progressPercentage !== undefined) return Math.min(progressPercentage, 100);
    return Math.min(Math.round((currentAmount / targetAmount) * 100), 100);
  };

  // 찜하기 토글 핸들러
  const handleLikeToggle = (e: React.MouseEvent) => {
    e.stopPropagation();

    // 이미 애니메이션 중이면 반응하지 않음
    if (isAnimating) return;

    // 애니메이션 시작
    setIsAnimating(true);
    setHeartScale(0.5); // 작아지는 효과

    // 작아진 후 커지면서 상태 변경
    setTimeout(() => {
      setIsLiked(!isLiked);
      setHeartScale(1.2); // 커지는 효과

      // 원래 크기로 복귀
      setTimeout(() => {
        setHeartScale(1);
        setIsAnimating(false);
      }, 200);
    }, 200);
  };

  // 이미지 로드 실패 핸들러
  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div
      className="rounded-lg overflow-hidden transition-all duration-200 cursor-pointer flex flex-col hover:shadow-md active:shadow-inner"
      style={{ height: '320px' }}
      onClick={onClick}
    >
      {/* 이미지 영역 - 고정 비율로 변경 + 호버 효과 */}
      <div className="relative w-full overflow-hidden" style={{ height: '180px' }}>
        <div className="w-full h-full flex items-center justify-center bg-gray-100 overflow-hidden">
          <img
            src={imageError ? defaultImage : (imageUrl || defaultImage)}
            alt={title}
            className={`w-full h-full object-cover transition-transform duration-300 hover-zoom ${isCompleted ? 'opacity-80' : ''}`}
            style={{
              objectPosition: 'center',
              transformOrigin: 'center'
            }}
            onMouseOver={(e) => {
              if (!isCompleted) {
                e.currentTarget.style.transform = 'scale(1.1)';
              }
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
            onError={handleImageError}
            draggable="false"
          />
        </div>

        {/* 완료된 펀딩 오버레이 */}
        {isCompleted && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white bg-opacity-90 py-1.5 px-4 rounded-md text-gray-900 font-medium text-sm shadow-md">
              완료된 펀딩입니다
            </div>
          </div>
        )}

        {/* 찜하기 버튼 - 백그라운드 제거 및 아웃라인 유지 */}
        <div
          onClick={handleLikeToggle}
          className="absolute top-2 right-2 z-10 cursor-pointer transition-all"
        >
          <div
            className="relative transition-transform duration-200"
            style={{ transform: `scale(${heartScale})` }}
          >
            {isLiked ? (
              <>
                <AiFillHeart size={24} className="text-red-500" />
                <AiOutlineHeart size={24} className="text-white absolute top-0 left-0" />
              </>
            ) : (
              <AiOutlineHeart size={24} className="text-white" />
            )}
          </div>
        </div>
      </div>

      {/* 콘텐츠 영역 - 패딩 축소 */}
      <div className="p-3 flex-1 flex flex-col justify-between">
        {/* 상단 정보 - 제목 고정 높이 */}
        <div>
          {/* 제목 - 정확히 2줄 높이로 고정 */}
          <h2 className="font-medium text-sm leading-tight mb-1 line-clamp-2 h-[32px] overflow-hidden">{title}</h2>

          {/* 카카오 유저 닉네임 */}
          <p className="text-gray-500 text-xs">{creatorName}</p>
        </div>

        {/* 하단 정보 - 카드 하단에 고정 */}
        <div>
          {/* 프로그레스 바 */}
          <div className="w-full bg-gray-200 rounded-full h-1 mb-1.5">
            <div
              className="h-1 rounded-full"
              style={{
                width: `${getProgressPercentage()}%`,
                backgroundColor: isCompleted ? '#9CA3AF' : '#FF5B61'
              }}
            ></div>
          </div>

          {/* 달성률과 모금액을 한 줄에 배치 - 텍스트 크기 축소 */}
          <div className="flex justify-between items-center">
            <div className="font-bold text-sm" style={{ color: isCompleted ? '#9CA3AF' : '#FF5B61' }}>
              {getProgressPercentage().toLocaleString()}% 달성
            </div>
            <div className="text-xs text-gray-700">
              {currentAmount.toLocaleString()}원
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          .hover-zoom {
            transition: transform 300ms;
          }
          .hover-zoom:hover {
            transform: scale(1.08);
          }
          
          /* 카드 hover 및 active 상태 효과 */
          .cursor-pointer {
            transition: all 0.2s ease-in-out;
          }
          .cursor-pointer:hover {
            transform: translateY(-2px);
          }
          .cursor-pointer:active {
            transform: translateY(0px);
          }
        `}
      </style>
    </div>
  );
};

export default FundingCard;