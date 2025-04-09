import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import FundingCreateNavbar from "../../pages/FundingCreate/components/FundingCreateNavbar";

// 스텝 타입 정의
type StepType = number | 'preview' | 'complete';

// 전역 컨텍스트 타입 정의
interface FundingCreateContext {
  currentStep: StepType;
  updateCurrentStep: (step: StepType) => void;
}

const FundingCreateLayout: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<StepType>(1);

  // 현재 스텝 업데이트 함수
  const updateCurrentStep = (step: StepType) => {
    setCurrentStep(step);
  };

  // 전역 컨텍스트 설정
  useEffect(() => {
    // 전역 컨텍스트 객체 생성
    const context: FundingCreateContext = {
      currentStep,
      updateCurrentStep,
    };

    // 전역 객체에 컨텍스트 등록
    // @ts-ignore
    window.fundingCreateContext = context;

    return () => {
      // 컴포넌트 언마운트 시 정리
      // @ts-ignore
      delete window.fundingCreateContext;
    };
  }, [currentStep]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* 펀딩 생성 네비게이션 바 */}
      <FundingCreateNavbar
        currentStep={currentStep}
      />

      {/* 메인 컨텐츠 영역 */}
      <main className="flex-grow flex flex-col bg-white">
        <Outlet />
      </main>
    </div>
  );
};

export default FundingCreateLayout; 