import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import defaultImage from '../../../assets/images/default-funding-image.jpg';

// 하이라이트 펀딩 항목 타입 정의
export interface HighlightItem {
  id: number;
  title: string;
  imageUrl?: string;
  progressPercentage: number;
  targetAmount: number;
  currentAmount: number;
  type: 'popular' | 'achievement';
  remainingDays: number;
  participantsCount: number;
  description?: string;
  badgeText?: string;
  badgeColor?: string;
  hidden?: boolean; // 친구만 볼 수 있는 비밀 펀딩 여부
}

// 펀딩 하이라이트 컴포넌트 props 타입 정의
interface FundingHighlightsProps {
  popularItems?: HighlightItem[];
  achievementItems?: HighlightItem[];
  title?: string;
  isLoading?: boolean; // 로딩 상태 prop 추가
}

// Slider 확장을 위한 타입 선언
interface CustomSlider extends Slider {
  slickNext(): void;
  slickPrev(): void;
}

const FundingHighlights: React.FC<FundingHighlightsProps> = ({
  popularItems = [],
  achievementItems = [],
  isLoading = false // 로딩 상태 기본값 추가
}) => {
  // Navigation 훅 추가
  const navigate = useNavigate();
  // 내부 로딩 상태 추가
  const [internalLoading, setInternalLoading] = useState(true);

  // 컴포넌트 마운트 시 로딩 상태 설정
  useEffect(() => {
    // 데이터가 로딩된 후 짧은 지연 시간을 두고 로딩 상태 해제
    if (popularItems.length > 0 || achievementItems.length > 0) {
      setInternalLoading(false);
    }
  }, [popularItems, achievementItems]);

  // 컴포넌트 마운트 시 내부 로딩 상태 초기화
  useEffect(() => {
    const timer = setTimeout(() => {
      setInternalLoading(false);
    }, 1000); // 1초 후 로딩 상태 해제

    return () => clearTimeout(timer);
  }, []);

  // 탭 상태 관리
  const [activeTab, setActiveTab] = useState<'popular' | 'achievement'>('popular');
  // 슬라이더 레퍼런스
  const sliderRef = useRef<CustomSlider>(null);

  // 현재 활성화된 아이템 배열 - hidden이 false인 아이템만 필터링
  const items = activeTab === 'popular'
    ? popularItems.filter(item => !item.hidden)
    : achievementItems.filter(item => !item.hidden);

  // slick 설정
  const settings = {
    centerMode: true,
    centerPadding: '20%',
    dots: false,
    infinite: true,
    speed: 700,
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
    cssEase: 'cubic-bezier(0.25, 0.1, 0.25, 1.0)',
    adaptiveHeight: true,
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

  // 펀딩 아이템 클릭 핸들러
  const handleItemClick = (id: number) => {
    navigate(`/funding/${id}`);
  };

  // 로딩 중 스켈레톤 UI
  if (internalLoading || isLoading) {
    return (
      <div style={{
        width: '100%',
        height: '400px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9fafb',
        borderRadius: '0.5rem',
        padding: '1rem'
      }}>
        <div style={{
          width: '60%',
          height: '25px',
          backgroundColor: '#e5e7eb',
          borderRadius: '0.25rem',
          marginBottom: '1rem',
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
        }}></div>
        <div style={{
          width: '80%',
          height: '250px',
          backgroundColor: '#e5e7eb',
          borderRadius: '0.5rem',
          marginBottom: '1rem',
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
        }}></div>
        <div style={{
          width: '40%',
          height: '20px',
          backgroundColor: '#e5e7eb',
          borderRadius: '0.25rem',
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
        }}></div>
        <style>{`
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
          }
        `}</style>
      </div>
    );
  }

  // 아이템이 없는 경우
  if (items.length === 0) {
    return (
      <div style={{
        backgroundColor: '#f9fafb',
        border: '1px solid #e5e7eb',
        borderRadius: '0.5rem',
        padding: '1.5rem',
        marginBottom: '2rem',
        textAlign: 'center',
        color: '#6b7280',
        height: '400px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '1.125rem'
      }}>
        현재 하이라이트 아이템이 없습니다
      </div>
    );
  }

  return (
    <div style={{
      position: 'absolute',
      left: 0,
      right: 0,
      width: '100%',
      height: '400px',
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
        position: 'relative',
        marginTop: '1.5rem',
      }}>
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
            
            /* 스페이싱과 트랜지션 개선 */
            .slick-slide {
              padding: 0 18px;
              transition: transform 0.4s ease-in-out;
              transform: scale(0.85);
              opacity: 0.6;
            }
            
            .slick-current {
              transform: scale(1);
              opacity: 1;
              z-index: 10;
            }
            
            .slick-slide:not(.slick-current) {
              transform: scale(0.75);
              filter: brightness(0.8);
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
            .custom-slider-container button {
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
        <Slider {...settings} ref={sliderRef} className="funding-carousel">
          {items.map((item) => (
            <div key={item.id} style={{ padding: '10px 15px' }}>
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '320px',
                  borderRadius: '0.75rem',
                  overflow: 'hidden',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                  cursor: item.hidden ? 'default' : 'pointer',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  transform: 'perspective(1000px) rotateY(0deg)',
                  transformStyle: 'preserve-3d',
                }}
                onClick={() => !item.hidden && handleItemClick(item.id)}
                onMouseEnter={(e) => {
                  if (!item.hidden) {
                    e.currentTarget.style.transform = 'perspective(1000px) rotateY(0deg) scale(1.03)';
                    e.currentTarget.style.boxShadow = '0 20px 30px -10px rgba(0, 0, 0, 0.25), 0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'perspective(1000px) rotateY(0deg)';
                  e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1)';
                }}
              >
                <img
                  src={item.imageUrl || defaultImage}
                  alt={item.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center',
                    opacity: item.hidden ? 0.6 : 1 // hidden인 경우 이미지를 더 흐리게 처리
                  }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = defaultImage;
                  }}
                  draggable="false"
                />

                {/* 비밀 펀딩 오버레이 */}
                {item.hidden && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    zIndex: 3
                  }}>
                    <div style={{
                      padding: '0.8rem 1.5rem',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      borderRadius: '0.5rem',
                      fontWeight: '600',
                      fontSize: '1rem',
                      color: '#333',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}>
                      친구만 볼 수 있는 비밀 펀딩입니다
                    </div>
                  </div>
                )}

                {/* 그라데이션 오버레이 - hidden이 아닐 때만 표시 */}
                {!item.hidden && (
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '75%',
                    background: 'linear-gradient(to top, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.4) 70%, transparent)',
                    zIndex: 1
                  }}></div>
                )}

                {/* 콘텐츠 - hidden이 아닐 때만 표시 */}
                {!item.hidden && (
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
                        모금액: {item.currentAmount.toLocaleString()}원
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
                )}
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
            width: '20%',
            height: '100%',
            cursor: 'pointer',
            zIndex: 5,
            backgroundColor: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={goToPrevSlide}
        >
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0.7,
            transition: 'opacity 0.3s ease',
          }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '20%',
            height: '100%',
            cursor: 'pointer',
            zIndex: 5,
            backgroundColor: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={goToNextSlide}
        >
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0.7,
            transition: 'opacity 0.3s ease',
          }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 6L15 12L9 18" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundingHighlights; 