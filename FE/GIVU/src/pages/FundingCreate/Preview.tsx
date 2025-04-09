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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // 모든 이미지 배열 만들기 (메인 이미지 + 추가 이미지들)
  const allImages = [
    ...(basicInfo.mainImage ? [basicInfo.mainImage] : []),
    ...(basicInfo.additionalImages || [])
  ];

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

  // 다음 이미지로 이동
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  // 이전 이미지로 이동
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  // 카테고리 아이콘 반환
  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case '생일':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
          </svg>
        );
      case '집들이':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        );
      case '졸업':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
        );
      case '결혼':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        );
      case '취업':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case '기타':
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        );
    }
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

      if (!basicInfo.category || basicInfo.category.trim() === '') {
        setErrorMessage('카테고리를 선택해주세요.');
        return;
      }

      // API 요청 데이터 생성
      const fundingData: CreateFundingData = {
        title: basicInfo.title,
        productId: selectedProduct.id,
        description: basicInfo.description,
        category: basicInfo.category || '',
        categoryName: basicInfo.category === '기타' ? basicInfo.categoryName || '' : null,
        scope: publicSettings.isPublic ? '공개' : '비밀'
      };

      console.log('[미리보기] 펀딩 생성 시작', {
        fundingData,
        additionalImagesCount: basicInfo.additionalImages?.length || 0
      });

      // API 호출
      try {
        const response = await createFundingMutation.mutateAsync({
          fundingData,
          additionalImages: basicInfo.additionalImages || []
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
    <div className="bg-white min-h-screen">
      {/* 헤더 - 미리보기 제목 및 설명 */}
      <div className="border-b border-gray-200 py-4 px-6 bg-white mb-8">
        <div className="max-w-screen-xl mx-auto">
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">미리보기</h1>
            <p className="text-gray-600 max-w-lg mx-auto">
              펀딩을 시작하기 전 마지막 확인 단계입니다.
            </p>
            <p className="text-gray-600 max-w-lg mx-auto mb-2">
              모든 정보가 올바르게 표시되는지 검토해 보세요.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 pb-8">
        {/* 에러 메시지 */}
        {errorMessage && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            <p className="font-medium">오류가 발생했습니다</p>
            <p className="text-sm">{errorMessage}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 좌측: 이미지 캐러셀 */}
          <div className="lg:col-span-2">
            {/* 이미지 캐러셀 */}
            <div className="relative mb-4 bg-white rounded-md overflow-hidden border border-gray-100">
              {allImages.length > 0 ? (
                <>
                  <img
                    src={allImages[currentImageIndex]}
                    alt={`펀딩 이미지 ${currentImageIndex + 1}`}
                    className="w-full h-auto object-contain mx-auto"
                    style={{ maxHeight: '400px' }}
                  />

                  {/* 이미지 네비게이션 화살표 */}
                  {allImages.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white/90 rounded-full p-1.5 shadow-sm transition-colors"
                        aria-label="이전 이미지"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white/90 rounded-full p-1.5 shadow-sm transition-colors"
                        aria-label="다음 이미지"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </>
                  )}

                  {/* 이미지 인디케이터 */}
                  {allImages.length > 1 && (
                    <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
                      {allImages.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-[2px] h-[2px] rounded-full ${index === currentImageIndex ? 'bg-primary-color' : 'bg-gray-300'
                            }`}
                          aria-label={`이미지 ${index + 1}로 이동`}
                        />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center justify-center h-96 text-gray-400">
                  <div className="text-center p-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p>이미지 없음</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 우측: 펀딩 정보 및 참여 버튼 */}
          <div className="lg:col-span-1">
            <div>
              <div className="bg-white border border-gray-200 rounded-md p-6 mb-6">
                {/* 카테고리 및 공개 설정 */}
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 px-2 py-1 rounded-md border border-gray-100">
                    {getCategoryIcon(basicInfo.category)}
                    <span>
                      {basicInfo.category === '기타'
                        ? `${basicInfo.category} (${basicInfo.categoryName || '미지정'})`
                        : basicInfo.category || '카테고리 없음'}
                    </span>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${publicSettings.isPublic ? 'text-green-700 bg-green-50' : 'text-blue-700 bg-transparent border border-blue-200'
                    }`}>
                    {publicSettings.isPublic ? '전체 공개' : '비밀 펀딩'}
                  </span>
                </div>

                {/* 펀딩 제목 */}
                <h1 className="text-lg font-bold mb-2">{basicInfo.title || '펀딩 제목'}</h1>

                {/* 펀딩 설명 */}
                <div className="mb-5">
                  <p className="text-xs text-gray-600 whitespace-pre-line line-clamp-4">
                    {basicInfo.description || '펀딩 설명이 없습니다.'}
                  </p>
                </div>

                {/* 금액 정보 */}
                <div className="mb-5 border-t border-gray-200 pt-3">
                  <p className="text-xs text-gray-500 mb-1">목표 금액</p>
                  <p className="text-xl font-bold">{formatAmount(basicInfo.targetAmount || selectedProduct.price || 0)}</p>
                </div>

                {/* 상품 정보 */}
                <div className="border-t border-gray-200 pt-3 mb-4">
                  <h3 className="text-sm font-bold mb-2">상품 정보</h3>
                  <div className="flex items-start space-x-3 p-2 bg-white rounded-md border border-gray-100">
                    {selectedProduct.image ? (
                      <div className="h-14 w-14 flex-shrink-0 bg-white border border-gray-200 rounded-md overflow-hidden">
                        <img
                          src={selectedProduct.image}
                          alt={getProductName()}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : null}
                    <div>
                      <p className="text-sm font-medium">{getProductName()}</p>
                      <p className="text-xs text-gray-500 mb-0.5">{selectedProduct.category}</p>
                      <p className="text-sm font-bold text-primary-color">
                        {selectedProduct.price ? formatAmount(selectedProduct.price) : '가격 정보 없음'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className="max-w-screen-xl mx-auto mt-10">
          <div className="border-t border-gray-200 pt-6">
            <div className="flex justify-between">
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
      </div>
    </div>
  );
};

export default Preview;
