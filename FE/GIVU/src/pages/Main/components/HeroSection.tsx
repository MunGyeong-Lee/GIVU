import { useState, useEffect, useMemo } from "react";
import { allFundingItems } from "../../Funding/data/dummyData";

// 선물 상자를 구성하는 개별 펀딩 이미지 컴포넌트
const FundingImage = ({
  position,
  imageUrl,
  title,
  scale = 1,
  delay = 0,
  onHover,
  onLeave,
  id
}: {
  position: { x: number; y: number; };
  imageUrl: string;
  title: string;
  scale?: number;
  delay?: number;
  onHover: (id: number, position: { x: number; y: number; }) => void;
  onLeave: () => void;
  id: number;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    onHover(id, position);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onLeave();
  };

  return (
    <div
      className={`absolute transition-all duration-300 ease-out transform
        ${isHovered ? 'scale-[1.2] z-50' : 'scale-100 z-10'}
        ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      style={{
        transform: `translate(${position.x}px, ${position.y}px) scale(${isHovered ? 1.2 : 1})`,
        transitionDelay: `${delay}ms`,
        width: `${scale}px`,
        height: `${scale}px`,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="w-full h-full overflow-hidden rounded-md shadow-md relative">
        {/* 펀딩 이미지 */}
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

// 선택된 펀딩 상세 정보 표시 컴포넌트
const FeaturedFunding = ({
  item,
  position
}: {
  item: any | null;
  position: { x: number; y: number; } | null;
}) => {
  if (!item || !position) return null;

  // 마우스 위치 기준으로 표시 위치 계산
  // position은 회전하는 원 안의 좌표이므로 적절히 변환
  // 스크린의 오른쪽이나 아래쪽 가장자리에 가까우면 다른 방향으로 표시
  const posX = position.x;
  const posY = position.y;

  // 표시 방향 결정 (기본: 오른쪽 위)
  const offsetX = 100;
  const offsetY = -120;

  return (
    <div
      className="absolute z-40 bg-white rounded-xl shadow-2xl overflow-hidden transition-all duration-300 ease-in-out opacity-95 w-60"
      style={{
        transform: `translate(${posX + offsetX}px, ${posY + offsetY}px)`,
        maxWidth: '260px',
      }}
    >
      <div className="w-full h-32 overflow-hidden">
        <img
          src={item.imageUrl}
          alt={item.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-3">
        <h3 className="text-sm font-bold text-gray-800 mb-1 line-clamp-2">{item.title}</h3>
        <div className="flex items-center justify-between text-xs">
          <div>
            <div className="text-gray-500">달성률</div>
            <div className="font-semibold">{item.progressPercentage}%</div>
          </div>
          <div>
            <div className="text-gray-500">참여자</div>
            <div className="font-semibold">{item.parcitipantsNumber}명</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 선물 상자 컴포넌트
const GiftBoxShape = () => {
  const [rotation, setRotation] = useState(0);
  const [hoveredItem, setHoveredItem] = useState<null | number>(null);
  const [hoveredPosition, setHoveredPosition] = useState<null | { x: number; y: number; }>(null);

  // 랜덤하게 선별된 펀딩 아이템들 - useMemo로 고정
  const { selectedItems, itemPositions, itemScales } = useMemo(() => {
    // 필터링된 펀딩 아이템
    const filteredItems = allFundingItems
      .filter(item => item.imageUrl && typeof item.imageUrl === 'string')
      .sort(() => Math.random() - 0.5)
      .slice(0, 200);

    // 위치 좌표 생성
    const positions: { x: number, y: number }[] = [];

    // 선물 상자의 윗면 (사다리꼴 모양)
    for (let x = -200; x <= 200; x += 20) {
      for (let y = -250; y <= -150; y += 20) {
        // 사다리꼴 형태를 만들기 위한 조건
        const topWidth = Math.abs(y + 250) / 2;
        if (Math.abs(x) <= 100 + topWidth) {
          positions.push({ x, y });
        }
      }
    }

    // 선물 상자의 아랫면 (직사각형)
    for (let x = -150; x <= 150; x += 20) {
      for (let y = -150; y <= 150; y += 20) {
        // 상자 안쪽은 비워둠
        if (Math.abs(x) > 140 || Math.abs(y) > 140 || Math.abs(y) < 50) {
          positions.push({ x, y });
        }
      }
    }

    // 선물 상자의 리본 (수직)
    for (let x = -10; x <= 10; x += 10) {
      for (let y = -250; y <= 150; y += 20) {
        positions.push({ x, y });
      }
    }

    // 선물 상자의 리본 (수평)
    for (let x = -150; x <= 150; x += 20) {
      for (let y = -10; y <= 10; y += 10) {
        positions.push({ x, y });
      }
    }

    // 리본 고리 (위)
    const bowRadius = 60;
    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 12) {
      const bowX = Math.cos(angle) * bowRadius - 60;
      const bowY = Math.sin(angle) * bowRadius - 180;
      positions.push({ x: bowX, y: bowY });
    }

    // 리본 고리 (오른쪽)
    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 12) {
      const bowX = Math.cos(angle) * bowRadius + 60;
      const bowY = Math.sin(angle) * bowRadius - 180;
      positions.push({ x: bowX, y: bowY });
    }

    // 임의로 섞은 뒤 필요한 수만큼 가져옴
    const shuffledPositions = [...positions].sort(() => Math.random() - 0.5).slice(0, filteredItems.length);

    // 각 아이템별 크기도 미리 계산해서 고정
    const scales = Array.from({ length: filteredItems.length }, () =>
      60 * (Math.random() * 0.3 + 0.7) // 42 ~ 60px 사이의 랜덤 크기
    );

    return {
      selectedItems: filteredItems,
      itemPositions: shuffledPositions,
      itemScales: scales
    };
  }, []); // 빈 의존성 배열로 마운트 시 한 번만 실행

  // 호버된 아이템 처리 함수
  const handleItemHover = (id: number, position: { x: number; y: number; }) => {
    setHoveredItem(id);
    setHoveredPosition(position);
  };

  // 호버 종료 처리 함수
  const handleItemLeave = () => {
    setHoveredItem(null);
    setHoveredPosition(null);
  };

  // 선택된 펀딩 아이템 가져오기
  const selectedFunding = hoveredItem
    ? selectedItems.find(item => item.id === hoveredItem)
    : null;

  // 회전 애니메이션
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 0.1) % 360);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-screen flex items-center justify-center">
        <div
          className="relative scale-125"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {selectedItems.map((item, index) => {
            if (index < itemPositions.length && item.imageUrl) {
              return (
                <FundingImage
                  key={item.id}
                  id={item.id}
                  position={itemPositions[index]}
                  imageUrl={item.imageUrl}
                  title={item.title}
                  scale={itemScales[index]}
                  delay={index * 10}  // 순차적으로 나타나도록 지연 효과
                  onHover={handleItemHover}
                  onLeave={handleItemLeave}
                />
              );
            }
            return null;
          })}
        </div>
      </div>

      {/* 선택된 펀딩 정보 표시 - 호버된 이미지 주변에 표시 */}
      <FeaturedFunding item={selectedFunding} position={hoveredPosition} />
    </>
  );
};

const HeroSection = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-white">
      {/* 선물 상자 이미지들 */}
      <GiftBoxShape />
    </div>
  );
};

export default HeroSection; 