import { useState, useRef, useEffect, useCallback } from 'react';

interface SubImage {
  id: string;
  src: string;
  alt: string;
}

interface Step {
  id: number;
  title: string;
  description: string;
  images: SubImage[];
}

const HowToUseSection = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [activeSubImage, setActiveSubImage] = useState<Record<number, number>>({ 0: 0, 1: 0, 2: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [wasOutOfView, setWasOutOfView] = useState(true);
  const sectionRef = useRef<HTMLDivElement>(null);

  // 사용 단계 데이터 - 3단계로 변경
  const steps: Step[] = [
    {
      id: 1,
      title: '펀딩 만들기',
      description: '선물하고 싶은 상품을 선택하고 펀딩을 생성하세요.',
      images: [
        {
          id: 'create-1',
          src: '/Step1-1.png',
          alt: '펀딩 아이템 선택'
        },
        {
          id: 'create-2',
          src: '/Step1-2.png',
          alt: '펀딩 정보 입력'
        },
        {
          id: 'create-3',
          src: '/Step1-3.png',
          alt: '펀딩 생성 완료'
        }
      ]
    },
    {
      id: 2,
      title: '펀딩 참여하기',
      description: '친구들이 펀딩에 참여하여 선물 구매를 도울 수 있어요.',
      images: [
        {
          id: 'join-1',
          src: '/Step2-1.png',
          alt: '펀딩 참여 화면'
        },
        {
          id: 'join-2',
          src: '/Step2-2.png',
          alt: '펀딩 참여 상세 화면 상단'
        },
        {
          id: 'join-3',
          src: '/Step2-3.png',
          alt: '펀딩 참여 상세 화면 하단'
        }
      ]
    },
    {
      id: 3,
      title: '선물 배송',
      description: '목표 금액이 달성되면 상품이 배송됩니다.',
      images: [
        {
          id: 'delivery-1',
          src: '/Step3-1.png',
          alt: '펀딩 성공 화면'
        },
        {
          id: 'delivery-2',
          src: '/Step3-2.png',
          alt: '배송 정보 화면'
        },
        {
          id: 'delivery-3',
          src: '/Step3-3.png',
          alt: '배송 완료 화면'
        }
      ]
    }
  ];

  // 2단계 이미지 전환 효과 - Step2-2와 Step2-3를 연속해서 보여주는 효과
  useEffect(() => {
    let timeoutId: number | null = null;

    // 2단계의 2번째 이미지(Step2-2)가 보이면 일정 시간 후 3번째 이미지(Step2-3)로 전환
    if (activeStep === 1 && activeSubImage[1] === 1) {
      timeoutId = setTimeout(() => {
        setActiveSubImage(prev => ({ ...prev, 1: 2 })); // Step2-3로 전환
      }, 1500); // 1.5초 후에 전환
    }

    // 2단계의 3번째 이미지(Step2-3)가 보이면 일정 시간 후 1번째 이미지(Step2-1)로 다시 전환
    if (activeStep === 1 && activeSubImage[1] === 2) {
      timeoutId = setTimeout(() => {
        setActiveSubImage(prev => ({ ...prev, 1: 0 })); // Step2-1로 다시 전환
      }, 1500); // 1.5초 후에 전환
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [activeStep, activeSubImage]);

  // 단계 내 이미지 자동 전환 타이머
  useEffect(() => {
    let imageIntervals: Record<string | number, number | null> = {};

    if (isVisible) {
      // 각 단계별로 별도의 타이머 설정
      steps.forEach((step, index) => {
        // 2단계(index=1)의 이미지 전환은 별도 효과로 처리되므로 제외
        if (index !== 1) {
          imageIntervals[index] = window.setInterval(() => {
            setActiveSubImage(prev => {
              const nextImageIndex = (prev[index] + 1) % steps[index].images.length;
              return { ...prev, [index]: nextImageIndex };
            });
          }, 1500); // 1.5초마다 이미지 변경
        } else {
          // 2단계는 Step2-1 → Step2-2 → Step2-3 → Step2-1 순으로 전환되도록 설정
          // Step2-1만 자동으로 Step2-2로 전환, 나머지는 위의 별도 effect에서 처리
          imageIntervals[index] = window.setInterval(() => {
            if (activeStep === 1 && activeSubImage[1] === 0) {
              setActiveSubImage(prev => ({ ...prev, 1: 1 })); // Step2-1 → Step2-2로 전환
            }
          }, 1500); // 1.5초마다 확인
        }
      });

      // 단계 자동 전환은 없음 - 사용자가 직접 선택
    }

    return () => {
      // 모든 타이머 정리
      Object.values(imageIntervals).forEach(interval => {
        if (interval !== null) {
          clearInterval(interval);
        }
      });
    };
  }, [isVisible, steps.length, activeStep, activeSubImage]);

  // 스크롤 감지 및 애니메이션 처리 함수
  const handleScroll = useCallback(() => {
    if (!sectionRef.current) return;

    const { top, bottom } = sectionRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // 섹션이 뷰포트에 들어왔는지 확인
    const isInView = top < windowHeight * 0.7 && bottom > 0;

    // 섹션이 뷰포트에 들어왔을 때
    if (isInView) {
      // 이전에 뷰포트 밖에 있었다면 애니메이션 시작
      if (wasOutOfView) {
        setIsVisible(true);
        setWasOutOfView(false);
        setActiveStep(0); // 첫 번째 단계부터 시작
        setActiveSubImage({ 0: 0, 1: 0, 2: 0 }); // 서브 이미지 초기화
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

  // 더미 이미지 URL 사용 (실제 이미지 경로가 없는 경우)
  const getImageSrc = (stepIndex: number, subImage: number) => {
    // 실제 이미지가 있으면 사용하고, 없으면 플레이스홀더 사용
    const image = steps[stepIndex].images[subImage];

    try {
      // 이미지 파일이 실제로 있는지 확인 (개발 중에만 의미 있음)
      return image.src;
    } catch (e) {
      // 파일이 없으면 플레이스홀더 사용
      return `https://via.placeholder.com/402x874?text=Step+${stepIndex + 1}-${subImage + 1}`;
    }
  };

  return (
    <section
      ref={sectionRef}
      className="py-16 relative flex flex-col justify-center items-center"
      style={{ minHeight: '100vh' }}
    >
      <div
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full transition-all duration-1000 ease-out
                   ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            간단하게 특별한 선물을 전하세요
          </h2>
          <div className="text-lg text-gray-600 max-w-3xl mx-auto">
            <p>GIVU는 쉽고 빠르게 여러 사람이 함께하는 선물 펀딩을 도와드립니다.</p>
          </div>
        </div>

        {/* 인터랙티브 단계 표시 영역 */}
        <div className="flex flex-col-reverse md:flex-row items-center justify-between mt-10 gap-8">
          {/* 왼쪽: 단계 선택 버튼 및 설명 */}
          <div className="w-full md:w-1/2 space-y-6">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`p-6 rounded-xl cursor-pointer transition-all duration-500
                          ${activeStep === index
                    ? 'bg-primary shadow-lg scale-105 transform'
                    : 'bg-white border border-gray-200 hover:border-primary hover:shadow-md'}`}
                onClick={() => setActiveStep(index)}
              >
                <div className="flex items-start gap-4">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full ${activeStep === index ? 'bg-white text-primary' : 'bg-primary bg-opacity-10 text-primary'
                    }`}>
                    <span className="font-bold text-lg">{step.id}</span>
                  </div>
                  <div>
                    <h3 className={`font-bold text-lg mb-1 ${activeStep === index ? 'text-white' : 'text-gray-800'}`}>
                      {step.title}
                    </h3>
                    <p className={`text-sm ${activeStep === index ? 'text-white text-opacity-90' : 'text-gray-600'}`}>
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 오른쪽: 모바일 디바이스 프레임과 스크린 애니메이션 */}
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="relative" style={{ width: '240px', height: '522px' }}>
              {/* 심플한 모바일 프레임 - 디바이스 크기 조정 */}
              <div className="absolute inset-0 w-full h-full bg-gray-700 rounded-[26px] p-2 shadow-xl overflow-hidden">
                {/* 화면 영역 */}
                <div className="w-full h-full bg-white rounded-[22px] overflow-hidden relative">
                  {/* 각 단계별 화면 */}
                  {steps.map((step, stepIndex) => (
                    <div
                      key={step.id}
                      className={`absolute inset-0 transition-all duration-700 ease-in-out transform
                                ${activeStep === stepIndex
                          ? 'opacity-100 translate-x-0'
                          : stepIndex < activeStep
                            ? 'opacity-0 -translate-x-full'
                            : 'opacity-0 translate-x-full'}`}
                    >
                      {/* 각 단계 내 서브 이미지들 */}
                      {step.images.map((image, imageIndex) => (
                        <div
                          key={image.id}
                          className={`absolute inset-0 transition-all duration-500 ease-out
                                    ${activeSubImage[stepIndex] === imageIndex
                              ? 'opacity-100 scale-100'
                              : 'opacity-0 scale-95'}`}
                          style={{
                            display: activeSubImage[stepIndex] === imageIndex ? 'block' : 'none',
                            // 애니메이션 방향 - 2단계 이미지 간에는 위아래 슬라이드 효과 적용
                            transform: (
                              stepIndex === 1 && (
                                // Step2-1 -> Step2-2, Step2-3 -> Step2-1일 때 Y축 방향 전환 효과
                                (activeSubImage[1] === 1 && imageIndex === 0) ? 'translateY(-30px) scale(0.95)' :
                                  (activeSubImage[1] === 0 && imageIndex === 1) ? 'translateY(30px) scale(0.95)' :
                                    // Step2-2 -> Step2-3일 때 Y축 방향 전환 효과 (아래로 넘기는 효과로 수정)
                                    (activeSubImage[1] === 2 && imageIndex === 1) ? 'translateY(30px) scale(0.95)' :
                                      (activeSubImage[1] === 1 && imageIndex === 2) ? 'translateY(-30px) scale(0.95)' :
                                        // Step2-3 -> Step2-1일 때 Y축 방향 전환 효과
                                        (activeSubImage[1] === 0 && imageIndex === 2) ? 'translateY(-30px) scale(0.95)' :
                                          (activeSubImage[1] === 2 && imageIndex === 0) ? 'translateY(30px) scale(0.95)' :
                                            // 기본 스케일 효과 (다른 단계나 예외 경우)
                                            activeSubImage[stepIndex] === imageIndex ? 'scale(1)' : 'scale(0.95)'
                              )
                            ) || undefined
                          }}
                        >
                          <img
                            src={getImageSrc(stepIndex, imageIndex)}
                            alt={image.alt}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowToUseSection;