import React, { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import Step1Products from './Step1Products';
import Step2BasicInfo from './Step2BasicInfo';
import Step3PublicSettings from './Step3PublicSettings';
import Preview from './Preview';
import { Product } from '../../services/product.service';

// 펀딩 생성 상태 타입 정의
export interface FundingCreateState {
  // 1단계: 상품 정보
  selectedProduct: {
    id?: string;
    productName?: string;
    price?: number;
    image?: string;
    category?: string;
  };

  // 2단계: 기본 정보
  basicInfo: {
    title: string;
    description: string;
    mainImage?: string;
    additionalImages?: string[];
    startDate?: string;
    endDate?: string;
    targetAmount: number;
  };

  // 3단계: 공개 설정
  publicSettings: {
    isPublic: boolean;
  };
}

// 초기 상태 값
const initialState: FundingCreateState = {
  selectedProduct: {},
  basicInfo: {
    title: '',
    description: '',
    targetAmount: 0,
  },
  publicSettings: {
    isPublic: true,
  }
};

// 스텝 타입
type StepType = 1 | 2 | 3 | 'preview';

const FundingCreateContainer: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<StepType>(1);
  const [fundingState, setFundingState] = useState<FundingCreateState>(initialState);
  
  // URL에서 파라미터와 state 가져오기
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const productIdFromUrl = searchParams.get('productId');
  const selectedProductFromState = location.state?.selectedProduct;

  // 상태 업데이트 함수
  const updateState = (key: keyof FundingCreateState, value: any) => {
    setFundingState(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // 다음 단계로 이동
  const goToNextStep = () => {
    let nextStep: StepType;
    if (currentStep === 1) nextStep = 2;
    else if (currentStep === 2) nextStep = 3;
    else if (currentStep === 3) nextStep = 'preview';
    else return;

    setCurrentStep(nextStep);

    // 네비게이션 바에 현재 단계 업데이트
    // @ts-ignore
    if (window.fundingCreateContext) {
      // @ts-ignore
      window.fundingCreateContext.updateCurrentStep(nextStep);
    }
  };

  // 이전 단계로 이동
  const goToPrevStep = () => {
    let prevStep: StepType;
    if (currentStep === 2) {
      prevStep = 1;
      // Step2 -> Step1로 이동 시, 기본 정보 초기화
      updateState('basicInfo', {
        title: fundingState.basicInfo.title || '',
        description: fundingState.basicInfo.description || '',
        targetAmount: 0,
      });
    }
    else if (currentStep === 3) prevStep = 2;
    else if (currentStep === 'preview') prevStep = 3;
    else return;

    setCurrentStep(prevStep);

    // 네비게이션 바에 현재 단계 업데이트
    // @ts-ignore
    if (window.fundingCreateContext) {
      // @ts-ignore
      window.fundingCreateContext.updateCurrentStep(prevStep);
    }
  };

  // 미리보기로 이동
  const goToPreview = () => {
    setCurrentStep('preview');

    // 네비게이션 바에 현재 단계 업데이트
    // @ts-ignore
    if (window.fundingCreateContext) {
      // @ts-ignore
      window.fundingCreateContext.updateCurrentStep('preview');
    }
  };

  // 컴포넌트가 마운트될 때 미리보기 콜백 등록
  useEffect(() => {
    // @ts-ignore
    if (window.fundingCreateContext) {
      // @ts-ignore
      window.fundingCreateContext.registerPreviewCallback(goToPreview);
      // @ts-ignore
      window.fundingCreateContext.updateCurrentStep(currentStep);
    }
  }, []);

  // 쇼핑몰에서 선택한 상품 정보 처리
  useEffect(() => {
    if (selectedProductFromState) {
      console.log('쇼핑몰에서 선택한 상품:', selectedProductFromState);
      
      // 상품 데이터 형식을 FundingCreateState에 맞게 변환
      const product = {
        id: selectedProductFromState.id?.toString(),
        productName: selectedProductFromState.productName,
        price: selectedProductFromState.price,
        image: selectedProductFromState.image,
        category: selectedProductFromState.category
      };
      
      // 상품 정보 업데이트
      updateState('selectedProduct', product);
      
      // 자동으로 기본 정보 초기값 설정 (선택사항)
      updateState('basicInfo', {
        ...fundingState.basicInfo,
        title: `${selectedProductFromState.productName} 펀딩`,
        targetAmount: selectedProductFromState.price || 0
      });
    }
  }, [selectedProductFromState]);

  // 단계에 따른 컴포넌트 렌더링
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1Products
            selectedProduct={fundingState.selectedProduct}
            updateSelectedProduct={(product) => updateState('selectedProduct', product)}
            onNext={goToNextStep}
          />
        );
      case 2:
        return (
          <Step2BasicInfo
            basicInfo={fundingState.basicInfo}
            updateBasicInfo={(info) => updateState('basicInfo', info)}
            onNext={goToNextStep}
            onPrev={goToPrevStep}
            productPrice={fundingState.selectedProduct.price || 0}
            productImage={fundingState.selectedProduct.image || ""}
          />
        );
      case 3:
        return (
          <Step3PublicSettings
            publicSettings={fundingState.publicSettings}
            updatePublicSettings={(settings) => updateState('publicSettings', settings)}
            onNext={goToNextStep}
            onPrev={goToPrevStep}
          />
        );
      case 'preview':
        return (
          <Preview
            fundingData={fundingState}
            onPrev={goToPrevStep}
          />
        );
      default:
        return null;
    }
  };

  const getStepLabels = () => {
    if (currentStep === 1) return ['상품 선택', '기본 정보', '공개 설정'];
    if (currentStep === 2) return ['상품 선택', '기본 정보', '공개 설정'];
    if (currentStep === 3) return ['상품 선택', '기본 정보', '공개 설정'];
    return ['상품 선택', '기본 정보', '공개 설정'];
  };

  const labels = getStepLabels();

  return (
    <div className="flex flex-col py-8">
      <div className="max-w-4xl mx-auto px-4 w-full">
        {/* 스텝 인디케이터 */}
        {currentStep !== 'preview' && (
          <div className="mb-10 mt-4">
            <div className="flex justify-between items-center relative">
              {/* 프로그레스 바 배경 */}
              <div className="absolute w-full h-1 bg-gray-300 top-5 z-[1]"></div>

              {/* 완료된 프로그레스 */}
              <div
                className="absolute h-1 bg-primary-color top-5 z-[2] transition-all duration-500"
                style={{
                  width: currentStep === 1 ? '0%' :
                    currentStep === 2 ? '50%' :
                      currentStep === 3 ? '100%' : '0%'
                }}
              ></div>

              {/* 스텝 1 */}
              <div className="flex flex-col items-center relative z-[3]">
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full border-2 
                    ${currentStep >= 1
                      ? 'bg-primary-color border-primary-color text-white'
                      : 'bg-white border-gray-400 text-gray-600'} 
                    text-lg font-bold transition-all duration-300`}
                >
                  1
                </div>
                <div
                  className={`mt-2 text-sm font-medium 
                    ${currentStep === 1
                      ? 'text-black font-semibold'
                      : currentStep > 1
                        ? 'text-gray-700'
                        : 'text-gray-500'}`}
                >
                  {labels[0]}
                </div>
              </div>

              {/* 스텝 2 */}
              <div className="flex flex-col items-center relative z-[3]">
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full border-2
                    ${currentStep >= 2
                      ? 'bg-primary-color border-primary-color text-white'
                      : 'bg-white border-gray-400 text-gray-600'} 
                    text-lg font-bold transition-all duration-300`}
                >
                  2
                </div>
                <div
                  className={`mt-2 text-sm font-medium 
                    ${currentStep === 2
                      ? 'text-black font-semibold'
                      : currentStep > 2
                        ? 'text-gray-700'
                        : 'text-gray-500'}`}
                >
                  {labels[1]}
                </div>
              </div>

              {/* 스텝 3 */}
              <div className="flex flex-col items-center relative z-[3]">
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full border-2
                    ${currentStep >= 3
                      ? 'bg-primary-color border-primary-color text-white'
                      : 'bg-white border-gray-400 text-gray-600'} 
                    text-lg font-bold transition-all duration-300`}
                >
                  3
                </div>
                <div
                  className={`mt-2 text-sm font-medium 
                    ${currentStep === 3
                      ? 'text-black font-semibold'
                      : currentStep > 3
                        ? 'text-gray-700'
                        : 'text-gray-500'}`}
                >
                  {labels[2]}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 현재 단계 컴포넌트 */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default FundingCreateContainer;
