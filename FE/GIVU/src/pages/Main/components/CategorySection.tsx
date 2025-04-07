import { useState, useEffect, useRef, useCallback } from 'react';

// 카테고리 타입 정의
interface Category {
  id: string;
  name: string;
  bgColor: string;
  description: string;
  imageUrl: string;
}

const CategorySection = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [wasOutOfView, setWasOutOfView] = useState(true);
  const sectionRef = useRef<HTMLDivElement>(null);

  // 카테고리 데이터 - 모든 카테고리에 이미지 추가, 아이콘 제거
  const categories: Category[] = [
    {
      id: 'birthday',
      name: '생일',
      bgColor: 'from-pink-400 to-pink-500',
      description: '소중한 이들의 특별한 생일을 위한 선물',
      imageUrl: '/birthday.jpg'
    },
    {
      id: 'housewarming',
      name: '집들이',
      bgColor: 'from-teal-400 to-teal-500',
      description: '새 보금자리에 감사의 마음을 전하세요',
      imageUrl: '/home.jpg'
    },
    {
      id: 'wedding',
      name: '결혼',
      bgColor: 'from-purple-400 to-purple-500',
      description: '평생의 동반자에게 축복의 선물을 전하세요',
      imageUrl: '/marry.jpg'
    },
    {
      id: 'baby',
      name: '출산',
      bgColor: 'from-blue-400 to-blue-500',
      description: '새 생명의 탄생을 함께 축하해요',
      imageUrl: '/baby.jpg'
    },
    {
      id: 'graduation',
      name: '졸업',
      bgColor: 'from-yellow-400 to-yellow-500',
      description: '노력의 결실을 맺은 순간을 축하하세요',
      imageUrl: '/gradu.jpg'
    },
    {
      id: 'job',
      name: '취업',
      bgColor: 'from-green-400 to-green-500',
      description: '새로운 시작을 응원하는 마음을 담아요',
      imageUrl: '/company.jpg'
    }
  ];

  // 이미지 미리 로드
  useEffect(() => {
    // 이미지 로드를 위한 배열
    const preloadImages = categories.map(category => {
      const img = new Image();
      img.src = category.imageUrl;
      return img;
    });

    return () => {
      // 이미지 객체 참조 제거
      preloadImages.length = 0;
    };
  }, []);

  // 스크롤 감지 및 애니메이션 처리 함수
  const handleScroll = useCallback(() => {
    if (!sectionRef.current) return;

    const { top, bottom } = sectionRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // 섹션이 뷰포트에 들어왔는지 확인 (섹션의 상단이 뷰포트 하단에서 30% 위치에 도달했을 때)
    const isInView = top < windowHeight * 0.7 && bottom > 0;

    // 섹션이 뷰포트에 들어왔을 때
    if (isInView) {
      // 이전에 뷰포트 밖에 있었다면 애니메이션 시작
      if (wasOutOfView) {
        setIsVisible(true);
        setWasOutOfView(false);
      }
    } else {
      // 뷰포트를 벗어나면 상태 초기화
      setWasOutOfView(true);
      // 완전히 나갔을 때 애니메이션 초기화
      if (bottom <= 0 || top >= windowHeight) {
        setIsVisible(false);
      }
    }
  }, [wasOutOfView]);

  // 스크롤 이벤트 리스너 등록
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
      className="py-16 relative flex flex-col justify-center items-center"
      style={{ minHeight: '80vh' }}
    >
      <div
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full transition-all duration-1000 ease-out
                   ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            어떤 특별한 순간을 함께할까요?
          </h2>
          <div className="text-lg text-gray-600 max-w-3xl mx-auto">
            <p>GIVU와 함께 소중한 사람들의 인생 이벤트를 더 특별하게 만들어보세요.</p>
          </div>
        </div>

        {/* 이미지 카드 그리드 */}
        <div className="flex flex-col md:flex-row md:space-x-4 md:h-80 space-y-4 md:space-y-0">
          {categories.map((category) => {
            const isActive = activeCategory === category.id;

            return (
              <div
                key={category.id}
                className={`relative overflow-hidden rounded-xl shadow-md cursor-pointer
                  transition-all duration-700 ease-in-out
                  ${isActive ? 'md:flex-grow-[2.5]' : 'md:flex-grow-[1]'}`}
                onMouseEnter={() => setActiveCategory(category.id)}
                onMouseLeave={() => setActiveCategory(null)}
              >
                {/* 배경 이미지 */}
                <div
                  className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-700 ease-in-out"
                  style={{
                    backgroundImage: `url(${category.imageUrl})`,
                    transform: isActive ? 'scale(1.03)' : 'scale(1.0)'
                  }}
                />

                {/* 그라데이션 오버레이 - 아래쪽에만 적용 */}
                <div
                  className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black to-transparent transition-opacity duration-500 ease-in-out"
                  style={{
                    opacity: isActive ? 0.8 : 0.7
                  }}
                />

                {/* 콘텐츠 */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end text-white z-10">
                  <div>
                    <h3 className={`font-bold mb-2 transition-all duration-500 ease-in-out
                      ${isActive ? 'text-2xl' : 'text-xl'}`}>
                      {category.name}
                    </h3>

                    <p
                      className={`
                        text-sm text-white transition-all duration-500 ease-in-out
                        ${isActive ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0 md:hidden'}
                      `}
                    >
                      {category.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategorySection; 