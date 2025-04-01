
import HeroSection from "./components/HeroSection";
import PopularFundingSection from "./components/PopularFundingSection";
import CategorySection from "./components/CategorySection";
import HowToUseSection from "./components/HowToUseSection";
import SuccessStoriesSection from "./components/SuccessStoriesSection";
import FeaturesSection from "./components/FeaturesSection";
import AppDownloadSection from "./components/AppDownloadSection";

const MainPage = () => {
  return (
    <>
      <HeroSection />

      <div className="max-w-7xl mx-auto px-5">
        <PopularFundingSection />
        <CategorySection />
        <HowToUseSection />
        <SuccessStoriesSection />
        <FeaturesSection />
        <AppDownloadSection />
      </div>
    </>
  );
};

export default MainPage;