import React, { useState } from 'react';
import { FundingCreateState } from './index';
import { useCreateFunding } from '../../hooks/useFundingMutations';
import { CreateFundingData } from '../../services/funding.service';
import { useNavigate } from 'react-router-dom';

interface PreviewProps {
  fundingData: FundingCreateState;
  onNext?: () => void;
  onPrev: () => void;
  onFundingCreated?: (fundingId: string) => void;
}

const Preview: React.FC<PreviewProps> = ({ fundingData, onPrev, onFundingCreated }) => {
  const { selectedProduct, basicInfo, publicSettings } = fundingData;
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 펀딩 생성 mutation 훅 사용
  const createFundingMutation = useCreateFunding();

  // 목표 금액 포맷팅
  const formatAmount = (amount: number) => {
    return amount.toLocaleString() + '원';
  };

  // 제품명 가져오기
  const getProductName = () => {
    if (selectedProduct.productName) return selectedProduct.productName;
    if ((selectedProduct as any).name) return (selectedProduct as any).name;
    return '(상품명 없음)';
  };

  // 라우트 변경을 위해 useNavigate 추가
  const navigate = useNavigate();

  // 펀딩 생성 처리
  const handleCreateFunding = async () => {
    try {
      // 로딩 상태 표시
      setErrorMessage(null);

      // 필수 값 확인
      if (!selectedProduct.id) {
        setErrorMessage('상품 정보가 없습니다. 상품 선택 단계로 돌아가 상품을 선택해주세요.');
        return;
      }

      if (!basicInfo.title || basicInfo.title.trim() === '') {
        setErrorMessage('펀딩 제목을 입력해주세요.');
        return;
      }

      if (!basicInfo.description || basicInfo.description.trim() === '') {
        setErrorMessage('펀딩 설명을 입력해주세요.');
        return;
      }

      // API 요청 데이터 생성
      const fundingData: CreateFundingData = {
        title: basicInfo.title,
        productId: selectedProduct.id,
        description: basicInfo.description,
        category: selectedProduct.category || '',
        categoryName: null, // 서버에서 처리
        scope: publicSettings.isPublic ? '공개' : '친구'
      };

      console.log('[미리보기] 펀딩 생성 시작', {
        fundingData,
        hasMainImage: !!basicInfo.mainImage,
        additionalImagesCount: basicInfo.additionalImages?.length || 0
      });

      // 이미지 확인
      if (!basicInfo.mainImage) {
        console.warn('[미리보기] 대표 이미지가 없습니다.');
        setErrorMessage('대표 이미지가 필요합니다. 기본 정보 단계로 돌아가 이미지를 추가해주세요.');
        return;
      }

      // API 호출
      try {
        const response = await createFundingMutation.mutateAsync({
          fundingData,
          mainImage: basicInfo.mainImage || '',
          additionalImages: basicInfo.additionalImages
        });

        // 생성된 펀딩 ID로 Complete 페이지로 리다이렉트
        console.log('[미리보기] 펀딩 생성 성공:', response);
        const fundingId = response.fundingId.toString();

        // 옵션 1: 기존 onFundingCreated 콜백이 있으면 호출
        if (onFundingCreated) {
          onFundingCreated(fundingId);
          return;
        }

        // 옵션 2: 아니면 새 라우트로 이동
        navigate(`/funding/complete/${fundingId}`);
      } catch (mutationError: any) {
        console.error('[미리보기] 펀딩 생성 중 오류 발생:', mutationError);

        // 서버 응답 오류 상세 정보 표시
        if (mutationError.response) {
          const status = mutationError.response.status;
          const message = mutationError.response.data?.message || '알 수 없는 오류';

          if (status === 403) {
            setErrorMessage(`접근 권한이 없습니다 (403): ${message}`);
          } else if (status === 400) {
            setErrorMessage(`요청 형식이 잘못되었습니다 (400): ${message}`);
          } else {
            setErrorMessage(`서버 오류 (${status}): ${message}`);
          }
        } else if (mutationError.request) {
          setErrorMessage('서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.');
        } else {
          setErrorMessage(`펀딩 생성 중 오류가 발생했습니다: ${mutationError.message}`);
        }

        // 콘솔에 더 자세한 오류 정보 출력
        console.error('[미리보기] 오류 상세:', mutationError);
      }
    } catch (error) {
      console.error('[미리보기] 최상위 오류:', error);
      setErrorMessage('펀딩 생성 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold mb-2">미리보기</h2>
        <p className="text-gray-600 max-w-xl mx-auto">
          펀딩이 어떻게 보일지 확인해보세요.
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        {/* 에러 메시지 */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errorMessage}
            </div>
          </div>
        )}

        {/* 펀딩 미리보기 컨텐츠 영역 */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
          {/* 펀딩 정보 영역 */}
          <div className="p-6">
            {/* 공개 설정 배지 */}
            <div className="flex justify-end mb-3">
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${publicSettings.isPublic
                ? 'bg-green-100 text-green-800'
                : 'bg-blue-100 text-blue-800'
                }`}>
                {publicSettings.isPublic ? '전체 공개' : '친구 공개'}
              </span>
            </div>

            {/* 펀딩 대표 이미지 */}
            <div className="mb-6">
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-4">
                {basicInfo.mainImage ? (
                  <img
                    src={basicInfo.mainImage}
                    alt="펀딩 대표 이미지"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    이미지 없음
                  </div>
                )}
              </div>
              <h1 className="text-2xl font-bold mb-1">{basicInfo.title || '(제목 없음)'}</h1>
            </div>

            {/* 목표 금액 */}
            <div className="mb-6">
              <div className="flex items-baseline">
                <p className="text-sm text-gray-500 mr-2">목표 금액</p>
                <p className="text-2xl font-bold text-primary-color">
                  {formatAmount(basicInfo.targetAmount || selectedProduct.price || 0)}
                </p>
              </div>
            </div>

            {/* 펀딩 설명 */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">펀딩 설명</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 whitespace-pre-line break-keep">
                  {basicInfo.description || '(설명 없음)'}
                </p>
              </div>
            </div>

            {/* 추가 이미지 */}
            {basicInfo.additionalImages && basicInfo.additionalImages.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">추가 이미지</h3>
                <div className="grid grid-cols-3 gap-3">
                  {basicInfo.additionalImages.map((image, index) => (
                    <div key={index} className="border rounded-lg overflow-hidden aspect-square bg-white">
                      <img
                        src={image}
                        alt={`추가 이미지 ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 상품 정보 영역 */}
          <div className="p-6 bg-gray-50 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">상품 정보</h3>
            <div className="flex items-start space-x-4">
              {/* 상품 이미지 */}
              {selectedProduct.image && (
                <div className="w-20 h-20 rounded overflow-hidden bg-white border border-gray-200 flex-shrink-0">
                  <img
                    src={selectedProduct.image}
                    alt={getProductName()}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              {/* 상품 정보 */}
              <div>
                <p className="font-medium">{getProductName()}</p>
                <p className="text-sm text-gray-500">
                  {selectedProduct.category || '카테고리 없음'}
                </p>
                <p className="mt-1 font-semibold">
                  {selectedProduct.price
                    ? formatAmount(selectedProduct.price)
                    : '가격 정보 없음'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className="flex justify-between mt-8">
          <button
            onClick={onPrev}
            className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center font-medium shadow-sm"
            disabled={createFundingMutation.isPending}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            이전 단계
          </button>
          <button
            onClick={handleCreateFunding}
            disabled={createFundingMutation.isPending}
            className="px-8 py-2.5 bg-primary-color text-white rounded-lg hover:bg-primary-color/90 transition-colors flex items-center font-medium shadow-md"
          >
            {createFundingMutation.isPending ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                처리 중...
              </>
            ) : (
              <>
                펀딩 생성하기
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Preview;
