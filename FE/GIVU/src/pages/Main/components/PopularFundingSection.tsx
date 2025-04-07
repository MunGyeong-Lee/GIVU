import { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { HighlightItem } from '../../Funding/components/FundingHighlights';
import { FundingItem } from '../../../types/funding';
import axios from 'axios';

// API 응답을 HighlightItem 형식으로 변환하는 함수
const mapToHighlightItem = (item: FundingItem): HighlightItem => {
  // 진행률 계산 (product.price 대비 fundedAmount)
  const targetAmount = item.product?.price || 100000; // 타겟 금액은 상품 가격
  const progressPercentage = Math.round(((item.fundedAmount || 0) / targetAmount) * 100);

  return {
    id: item.fundingId,
    title: item.title || '',
    description: item.description || '',
    targetAmount: targetAmount,
    currentAmount: item.fundedAmount || 0,
    progressPercentage: progressPercentage > 100 ? 100 : progressPercentage, // 100% 초과 시 100%로 제한
    imageUrl: item.product?.image || '',
    badgeText: '', // 빈 문자열로 설정 (UI에 표시하지 않음)
    badgeColor: '#FF5B61' // 프로그레스 바 색상으로 사용
  };
};

// 개별 펀딩 카드 컴포넌트
const FundingCard = ({ item, onClick, index, visibleCards }: {
  item: HighlightItem;
  onClick: () => void;
  index: number;
  visibleCards: number;
}) => {
  // 카드가 보여질지 여부
  const isVisible = index < visibleCards;

  return (
    <div
      className={`rounded-xl overflow-hidden shadow-lg transition-all duration-500 cursor-pointer bg-white transform
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}
      style={{
        transitionDelay: `${index * 150}ms`,
        boxShadow: isVisible ? '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' : 'none'
      }}
      onClick={onClick}
    >
      {/* 이미지 영역 */}
      <div className="h-48 overflow-hidden relative">
        <img
          src={item.imageUrl}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
      </div>

      {/* 콘텐츠 영역 */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">{item.title}</h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{item.description}</p>

        {/* 진행 상태 */}
        <div className="flex justify-between items-center mb-2">
          <span className="text-base font-bold text-primary">
            {item.progressPercentage}%
          </span>
          <span className="text-sm text-gray-500">
            {item.currentAmount.toLocaleString()}원
          </span>
        </div>

        {/* 프로그레스 바 */}
        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000 bg-primary"
            style={{
              width: isVisible ? `${item.progressPercentage}%` : '0%',
              transitionDelay: `${index * 150 + 300}ms`
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

const PopularFundingSection = () => {
  const [popularItems, setPopularItems] = useState<HighlightItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleCards, setVisibleCards] = useState(0);
  const navigate = useNavigate();

  // 스크롤 애니메이션을 위한 상태와 참조
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [wasOutOfView, setWasOutOfView] = useState(true); // 섹션이 뷰포트 밖에 있었는지 추적
  const timeoutRef = useRef<number | null>(null);
  const cardIntervalRef = useRef<number | null>(null);

  // 중복 인터벌/타임아웃 정리 함수
  const clearTimers = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (cardIntervalRef.current) {
      clearInterval(cardIntervalRef.current);
      cardIntervalRef.current = null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/fundings/list`);
        const fundingItems = response.data;

        // 이미지가 있는 펀딩만 필터링
        const validItems = fundingItems.filter((item: any) => item.product?.image);
        console.log('인기 펀딩 가져옴:', validItems.length);

        if (validItems.length > 0) {
          // 인기 펀딩: 참여자 수 기준으로 정렬
          const sortedByParticipants = [...validItems].sort(
            (a, b) => (b.participantsNumber || 0) - (a.participantsNumber || 0)
          ).slice(0, 4); // 상위 4개로 줄임

          // HighlightItem 형식으로 변환
          setPopularItems(sortedByParticipants.map(item => mapToHighlightItem(item)));
        }
      } catch (error) {
        console.error('인기 펀딩 데이터 로딩 중 오류 발생:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // 컴포넌트 언마운트 시 타이머 정리
    return () => {
      clearTimers();
    };
  }, []);

  // 애니메이션 시작 함수
  const startAnimation = useCallback(() => {
    // 기존 타이머 정리
    clearTimers();

    // 먼저 모든 상태 초기화
    setIsVisible(true);
    setVisibleCards(0); // 카드 모두 숨기기

    // 헤더와 설명 표시 후에 카드 애니메이션 시작
    timeoutRef.current = setTimeout(() => {
      // 카드가 하나씩 순차적으로 나타나도록 설정
      cardIntervalRef.current = setInterval(() => {
        setVisibleCards(prev => {
          const nextValue = prev + 1;
          // 모든 카드가 표시되면 인터벌 정리
          if (nextValue > popularItems.length) {
            if (cardIntervalRef.current) {
              clearInterval(cardIntervalRef.current);
              cardIntervalRef.current = null;
            }
          }
          return nextValue;
        });
      }, 150); // 150ms 간격으로 카드 표시
    }, 400); // 헤더 애니메이션 후 카드 애니메이션 시작
  }, [popularItems.length]);

  // 스크롤 기반 애니메이션 처리
  const handleScroll = useCallback(() => {
    if (!sectionRef.current) return;

    const { top, bottom } = sectionRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // 섹션이 뷰포트에 50% 이상 들어왔는지 확인
    const isInView = top < windowHeight * 0.7 && bottom > 0;

    // 섹션이 뷰포트에 들어왔을 때
    if (isInView) {
      // 이전에 뷰포트 밖에 있었다면 애니메이션 다시 시작
      if (wasOutOfView) {
        startAnimation();
        setWasOutOfView(false);
      }
    } else {
      // 뷰포트를 벗어나면 상태 업데이트
      setWasOutOfView(true);
      // 완전히 나갔을 때 애니메이션 초기화 (선택적)
      if (bottom <= 0 || top >= windowHeight) {
        setIsVisible(false);
        setVisibleCards(0);
        clearTimers();
      }
    }
  }, [wasOutOfView, startAnimation]);

  // 스크롤 이벤트 리스너 등록 및 초기 실행
  useEffect(() => {
    const throttledHandleScroll = () => {
      // 스크롤 이벤트 스로틀링 (성능 최적화)
      if (!throttledHandleScroll.ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          throttledHandleScroll.ticking = false;
        });
        throttledHandleScroll.ticking = true;
      }
    };
    throttledHandleScroll.ticking = false;

    window.addEventListener('scroll', throttledHandleScroll);
    throttledHandleScroll(); // 초기 로드 시 실행

    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
    };
  }, [handleScroll]);

  return (
    <section
      ref={sectionRef}
      className="py-12 relative flex flex-col justify-center items-center"
      style={{
        overflow: 'hidden',
        height: '100vh', // 화면 높이와 동일하게 설정
        minHeight: '800px', // 최소 높이 설정 (작은 화면용)
      }}
    >
      <div className="max-w-7xl mx-auto px-5 w-full">
        {/* 메인 헤딩과 설명 - CategorySection과 스타일 일치 */}
        <div className="text-center mb-12 transition-all duration-700 ease-out">
          <h2
            ref={headingRef}
            className={`text-3xl font-bold text-gray-900 mb-4 transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            style={{
              transition: 'opacity 0.7s ease-out, transform 0.7s ease-out',
              transitionDelay: '0.1s'
            }}
          >
            특별한 순간, 함께하는 선물
          </h2>

          <div
            ref={descRef}
            className={`text-lg text-gray-600 max-w-3xl mx-auto transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            style={{
              transition: 'opacity 0.7s ease-out, transform 0.7s ease-out',
              transitionDelay: '0.2s'
            }}
          >
            <p>친구의 생일, 취업, 결혼 같은 특별한 순간을 GIVU와 함께 더 뜻깊게 만들어보세요.</p>
          </div>
        </div>

        {/* 펀딩 카드 그리드 */}
        <div
          ref={contentRef}
          className="transition-all duration-700 ease-out"
        >
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : popularItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularItems.map((item, index) => (
                <FundingCard
                  key={item.id}
                  item={item}
                  index={index}
                  visibleCards={visibleCards}
                  onClick={() => navigate(`/funding/${item.id}`)}
                />
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-500 text-lg">펀딩 데이터가 없습니다.</p>
            </div>
          )}
        </div>

        {/* 더 많은 펀딩 보기 버튼 */}
        <div
          className={`flex justify-center mt-20 transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          style={{
            transition: 'opacity 0.7s ease-out, transform 0.7s ease-out',
            transitionDelay: '0.4s'
          }}
        >
          <button
            className="px-6 py-3 bg-white text-gray-800 border border-gray-300 rounded-full font-medium hover:bg-gray-50 transition-colors duration-300 hover:scale-105 transform flex items-center"
            onClick={() => navigate('/funding/list')}
          >
            전체 펀딩 보기
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default PopularFundingSection; 