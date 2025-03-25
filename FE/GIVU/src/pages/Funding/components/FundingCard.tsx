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
}

const FundingCard: React.FC<FundingCardProps> = ({
  id,
  title,
  description,
  targetAmount,
  currentAmount,
  progressPercentage,
  imageUrl,
  creatorName
}) => {
  // 찜하기 상태 관리
  const [isLiked, setIsLiked] = useState(false);
  // 이미지 로딩 상태 관리
  const [imageError, setImageError] = useState(false);
  // 애니메이션 상태 관리
  const [isAnimating, setIsAnimating] = useState(false);
  const [heartScale, setHeartScale] = useState(1);

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
    <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer">
      {/* 이미지 영역 */}
      <div className="relative">
        <div className="aspect-w-16 aspect-h-9 bg-gray-100">
          {imageError ? (
            // 이미지 로드 실패 시 로컬 기본 이미지 표시
            <img
              src={defaultImage}
              alt={title}
              className="object-cover w-full h-full"
              draggable="false"
            />
          ) : (
            // 실제 이미지 또는 로컬 기본 이미지
            <img
              src={imageUrl || defaultImage}
              alt={title}
              className="object-cover w-full h-full"
              onError={handleImageError}
              draggable="false"
            />
          )}
        </div>

        {/* 찜하기 버튼 - 와디즈 스타일 적용(흰색 테두리, 투명 검정 채움), 크기 증가, 애니메이션 추가 */}
        <div
          onClick={handleLikeToggle}
          className="absolute top-3 right-3 z-10 cursor-pointer"
          style={{ outline: 'none' }}
        >
          <div
            className="relative transition-transform duration-200"
            style={{ transform: `scale(${heartScale})` }}
          >
            {isLiked ? (
              <>
                <AiFillHeart size={32} className="text-red-500" />
                <AiOutlineHeart size={32} className="text-white absolute top-0 left-0" />
              </>
            ) : (
              <>
                <AiFillHeart size={32} className="text-black opacity-40" />
                <AiOutlineHeart size={32} className="text-white absolute top-0 left-0" />
              </>
            )}
          </div>
        </div>
      </div>

      {/* 콘텐츠 영역 */}
      <div className="p-4">
        {/* 달성률과 모금액을 한 줄에 배치 - 달성률 텍스트 크기 증가 */}
        <div className="flex justify-between items-center mb-1">
          <div className="font-extrabold text-xl" style={{ color: '#FF5B61' }}>
            {getProgressPercentage().toLocaleString()}% 달성
          </div>
          <div className="text-sm font-semibold text-gray-700">
            {currentAmount.toLocaleString()}원
          </div>
        </div>

        {/* 프로그레스 바 */}
        <div className="w-full bg-gray-200 rounded-full h-1 mb-3">
          <div
            className="h-1 rounded-full"
            style={{
              width: `${getProgressPercentage()}%`,
              backgroundColor: '#FF5B61'
            }}
          ></div>
        </div>

        {/* 제목 - 볼드 감소 */}
        <h2 className="font-semibold text-lg mb-1">{title}</h2>

        {/* 카카오 유저 닉네임 */}
        <p className="text-gray-500 text-sm">{creatorName}</p>
      </div>
    </div>
  );
};

export default FundingCard;