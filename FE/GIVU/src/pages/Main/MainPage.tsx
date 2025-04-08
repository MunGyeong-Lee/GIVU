import { useEffect } from 'react';
import HeroSection from "./components/HeroSection";
import PopularFundingSection from "./components/PopularFundingSection";
import CategorySection from "./components/CategorySection";
import HowToUseSection from "./components/HowToUseSection";
import AppDownloadSection from "./components/AppDownloadSection";

const MainPage = () => {
  // 페이지 로드 시 맨 위로 스크롤
  useEffect(() => {
    window.scrollTo(0, 0);

    // 로컬 스토리지에 스크롤 위치 초기화 정보 저장 (선택적)
    localStorage.setItem('scrollReset', 'true');

    // 브라우저 히스토리 상태를 조작하여 뒤로가기시에도 맨 위로 스크롤되도록 함
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    return () => {
      // 컴포넌트 언마운트 시 스크롤 복원 설정 복원
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'auto';
      }
    };
  }, []);

  return (
    <>
      <HeroSection />

      <div className="max-w-7xl mx-auto px-5">
        <PopularFundingSection />
        <CategorySection />
        <HowToUseSection />
        {/* <SuccessStoriesSection /> */}
        <AppDownloadSection />
      </div>
    </>
  );
};

export default MainPage;