import React, { useState, useEffect, useRef } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import defaultImage from '../../../assets/images/default-funding-image.jpg';

// 하이라이트 펀딩 항목 타입 정의
export interface HighlightItem {
  id: number;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  progressPercentage: number;
  imageUrl?: string;
  badgeText: string;
  badgeColor: string;
}

// 펀딩 하이라이트 컴포넌트 props 타입 정의
interface FundingHighlightsProps {
  popularItems?: HighlightItem[];
  achievementItems?: HighlightItem[];
  title?: string;
}

// Slider 확장을 위한 타입 선언
interface CustomSlider extends Slider {
  slickNext(): void;
  slickPrev(): void;
}

const FundingHighlights: React.FC<FundingHighlightsProps> = ({
  popularItems = [],
  achievementItems = [],
  title = '펀딩 하이라이트'
}) => {
  // 탭 상태 관리
  const [activeTab, setActiveTab] = useState<'popular' | 'achievement'>('popular');
  // 슬라이더 레퍼런스
  const sliderRef = useRef<CustomSlider>(null);

  // 현재 활성화된 아이템 배열
  const items = activeTab === 'popular'
    ? (popularItems.length > 0 ? popularItems : getDummyPopular())
    : (achievementItems.length > 0 ? achievementItems : getDummyAchievement());

  // slick 설정
  const settings = {
    centerMode: true,
    centerPadding: '25%',
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    arrows: false,   // 방향 버튼 제거
    draggable: false, // 드래그 기능 제거
    swipe: false,    // 스와이프 기능 제거
    touchMove: false, // 터치 이동 기능 제거
    useCSS: true,
    cssEase: 'ease-in-out'
  };

  // 탭 변경 핸들러
  const handleTabChange = (tab: 'popular' | 'achievement') => {
    setActiveTab(tab);
  };

  // 다음 슬라이드로 이동하는 함수
  const goToNextSlide = () => {
    if (sliderRef.current) {
      sliderRef.current.slickNext();
    }
  };

  // 이전 슬라이드로 이동하는 함수
  const goToPrevSlide = () => {
    if (sliderRef.current) {
      sliderRef.current.slickPrev();
    }
  };

  // 아이템이 없는 경우
  if (items.length === 0) {
    return (
      <div style={{
        backgroundColor: '#fee2e2',
        border: '1px solid #fecaca',
        borderRadius: '0.5rem',
        padding: '1.5rem',
        marginBottom: '2rem',
        textAlign: 'center',
        color: '#ef4444'
      }}>
        하이라이트 아이템이 없습니다
      </div>
    );
  }

  return (
    <div style={{
      position: 'absolute',
      left: 0,
      right: 0,
      width: '100%',
      height: '440px',
      margin: 0,
      padding: 0,
      zIndex: 10,
      overflow: 'visible',
      backgroundColor: 'transparent'
    }}>
      {/* 상단 탭 */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        borderBottom: '1px solid #E5E7EB',
        marginBottom: '1rem',
        marginTop: '0.8rem',
        padding: '0 10%'
      }}>
        <button
          style={{
            flex: 1,
            padding: '0.8rem 0',
            fontSize: '0.95rem',
            fontWeight: activeTab === 'popular' ? 600 : 400,
            color: activeTab === 'popular' ? '#FF5B61' : '#6B7280',
            border: 'none',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            transition: 'all 0.3s',
            outline: 'none',
            position: 'relative'
          }}
          onClick={() => handleTabChange('popular')}
        >
          인기 펀딩
          {activeTab === 'popular' && (
            <div style={{
              position: 'absolute',
              bottom: -1,
              left: 0,
              width: '100%',
              height: '2px',
              backgroundColor: '#FF5B61',
            }}></div>
          )}
        </button>
        <button
          style={{
            flex: 1,
            padding: '0.8rem 0',
            fontSize: '0.95rem',
            fontWeight: activeTab === 'achievement' ? 600 : 400,
            color: activeTab === 'achievement' ? '#4CAF50' : '#6B7280',
            border: 'none',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            transition: 'all 0.3s',
            outline: 'none',
            position: 'relative'
          }}
          onClick={() => handleTabChange('achievement')}
        >
          달성 임박
          {activeTab === 'achievement' && (
            <div style={{
              position: 'absolute',
              bottom: -1,
              left: 0,
              width: '100%',
              height: '2px',
              backgroundColor: '#4CAF50',
            }}></div>
          )}
        </button>
      </div>

      {/* 캐러셀 영역 - 전체 너비 사용하도록 수정 */}
      <div style={{
        width: '100%',
        margin: '0 auto',
        padding: 0,
        boxSizing: 'border-box',
        position: 'relative',
        backgroundColor: 'transparent'
      }}
        className="custom-slider-container"
      >
        <style>
          {`
            /* 캐러셀 스타일 커스텀 - 배경색 제거 */
            .custom-slider-container .slick-track {
              background-color: transparent !important;
            }
            .custom-slider-container .slick-list {
              background-color: transparent !important;
            }
            .custom-slider-container .slick-slide {
              background-color: transparent !important;
            }
            
            /* 배지 및 프로그레스 바 색상 오버라이드 */
            .badge-popular {
              background-color: #FF5B61 !important;
            }
            .badge-achievement {
              background-color: #4CAF50 !important;
            }
            .progress-popular {
              background-color: #FF5B61 !important;
            }
            .progress-achievement {
              background-color: #4CAF50 !important;
            }
            
            /* 탭 버튼 스타일 강화 */
            button {
              -webkit-appearance: none !important;
              appearance: none !important;
              text-decoration: none !important;
              color: inherit !important;
            }
            
            /* 호버 및 포커스 스타일 강화 */
            button:hover, button:focus {
              outline: 0 !important;
              box-shadow: none !important;
              border-color: transparent !important;
              text-decoration: none !important;
              border-bottom-color: transparent !important;
            }
            
            /* 언더라인 색상 강제 적용 */
            button[style*="position: relative"] > div {
              background-color: #FF5B61 !important;
              border: none !important;
              text-decoration: none !important;
            }
            
            button[style*="position: relative"]:last-child > div {
              background-color: #4CAF50 !important;
              border: none !important;
              text-decoration: none !important;
            }
          `}
        </style>
        <Slider {...settings} ref={sliderRef}>
          {items.map((item, index) => (
            <div key={item.id} style={{ backgroundColor: 'transparent' }}>
              <div style={{
                position: 'relative',
                height: '340px',
                margin: '0 10px',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: 'none', // 그림자 제거
                cursor: 'pointer',
                backgroundColor: 'transparent'
              }}>
                <img
                  src={item.imageUrl || defaultImage}
                  alt={item.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center'
                  }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = defaultImage;
                  }}
                  draggable="false"
                />

                {/* 그라데이션 오버레이 */}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '75%',
                  background: 'linear-gradient(to top, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.4) 70%, transparent)',
                  zIndex: 1
                }}></div>

                {/* 콘텐츠 */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '1.5rem 1.5rem 2rem 1.5rem',
                  color: 'white',
                  zIndex: 2
                }}>
                  {/* 배지 */}
                  <span
                    className={activeTab === 'popular' ? 'badge-popular' : 'badge-achievement'}
                    style={{
                      display: 'inline-block',
                      padding: '0.2rem 0.5rem',
                      marginBottom: '0.5rem',
                      fontSize: '0.7rem',
                      fontWeight: 'bold',
                      borderRadius: '9999px',
                      width: 'fit-content'
                    }}
                  >
                    {item.badgeText}
                  </span>

                  {/* 제목 */}
                  <h2 style={{
                    fontSize: '1.3rem',
                    fontWeight: 'bold',
                    marginBottom: '0.5rem',
                    maxWidth: '100%',
                    textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                    lineHeight: '1.3'
                  }}>
                    {item.title}
                  </h2>

                  {/* 설명 */}
                  <p style={{
                    fontSize: '0.9rem',
                    color: 'rgba(255, 255, 255, 1)',
                    marginBottom: '0.8rem',
                    maxWidth: '100%',
                    textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                  }}>
                    {item.description}
                  </p>

                  {/* 달성률 */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '0.5rem',
                    width: '100%'
                  }}>
                    <span style={{
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      color: 'white',
                      textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                    }}>
                      {item.progressPercentage}% 달성
                    </span>
                    <span style={{
                      color: 'rgba(255, 255, 255, 1)',
                      fontSize: '0.8rem',
                      textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                    }}>
                      목표: {item.targetAmount.toLocaleString()}원
                    </span>
                  </div>

                  {/* 프로그레스 바 배경 */}
                  <div style={{
                    width: '100%',
                    height: '0.3rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    borderRadius: '9999px',
                    marginBottom: '0.8rem',
                    overflow: 'hidden'
                  }}>
                    {/* 프로그레스 바 내부 색상 */}
                    <div
                      className={activeTab === 'popular' ? 'progress-popular' : 'progress-achievement'}
                      style={{
                        height: '100%',
                        width: `${item.progressPercentage}%`,
                        borderRadius: '9999px'
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>

        {/* 좌우 클릭 영역 추가 */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '25%',
            height: '100%',
            cursor: 'pointer',
            zIndex: 5,
            backgroundColor: 'transparent'
          }}
          onClick={goToPrevSlide}
        />

        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '25%',
            height: '100%',
            cursor: 'pointer',
            zIndex: 5,
            backgroundColor: 'transparent'
          }}
          onClick={goToNextSlide}
        />
      </div>
    </div>
  );
};

// 기본 더미 데이터 함수 (5개로 확장)
function getDummyPopular(): HighlightItem[] {
  return [
    {
      id: 101,
      title: '맨손 설거지 가능한',
      description: '100% 천연 설거지바',
      targetAmount: 1000000,
      currentAmount: 700000,
      progressPercentage: 70,
      badgeText: '인기 TOP',
      badgeColor: '#FF5B61',
      imageUrl: 'https://images.unsplash.com/photo-1581622558667-3419a8dc5f83?w=800'
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
}

function getDummyAchievement(): HighlightItem[] {
  return [
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
}

export default FundingHighlights; 