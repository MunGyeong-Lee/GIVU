import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import FundingCreateNavbar from "../../pages/FundingCreate/components/FundingCreateNavbar";

// 스텝 타입 정의
type StepType = number | 'preview' | 'complete';

// 전역 컨텍스트 타입 정의
interface FundingCreateContext {
  currentStep: StepType;
  updateCurrentStep: (step: StepType) => void;
  registerPreviewCallback: (callback: () => void) => void;
  previewCallback: (() => void) | null;
}

const FundingCreateLayout: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<StepType>(1);
  const [previewCallback, setPreviewCallback] = useState<(() => void) | null>(null);
  const location = useLocation();

  // 현재 스텝 업데이트 함수
  const updateCurrentStep = (step: StepType) => {
    setCurrentStep(step);
  };

  // 미리보기 콜백 등록 함수
  const registerPreviewCallback = (callback: () => void) => {
    setPreviewCallback(() => callback);
  };

  // 전역 컨텍스트 설정
  useEffect(() => {
    // 전역 컨텍스트 객체 생성
    const context: FundingCreateContext = {
      currentStep,
      updateCurrentStep,
      registerPreviewCallback,
      previewCallback,
    };

    // 전역 객체에 컨텍스트 등록
    // @ts-ignore
    window.fundingCreateContext = context;

    return () => {
      // 컴포넌트 언마운트 시 정리
      // @ts-ignore
      delete window.fundingCreateContext;
    };
  }, [currentStep, previewCallback]);

  // 미리보기 버튼 핸들러
  const handlePreview = () => {
    if (previewCallback) {
      previewCallback();
    }
  };

  // 현재 스텝에 따라 미리보기 버튼 표시 여부 결정
  const showPreviewButton = (() => {
    // 모든 단계에서 미리보기 버튼 표시
    if (currentStep === 'preview' || currentStep === 'complete') {
      return false;
    }
    return true;
  })();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* 펀딩 생성 네비게이션 바 */}
      <FundingCreateNavbar
        onPreview={handlePreview}
        showPreviewButton={showPreviewButton}
      />

      {/* 메인 컨텐츠 영역 */}
      <main className="flex-grow flex flex-col bg-white">
        <Outlet />
      </main>
    </div>
  );
};

export default FundingCreateLayout; 