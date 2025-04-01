import React from 'react';
import { FundingCreateState } from './index';

interface PreviewProps {
  fundingData: FundingCreateState;
  onNext: () => void;
  onPrev: () => void;
}

const Preview: React.FC<PreviewProps> = ({ fundingData, onNext, onPrev }) => {
  const { selectedProduct, basicInfo, publicSettings } = fundingData;

  // 날짜 포맷팅
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  // 목표 금액 포맷팅
  const formatAmount = (amount: number) => {
    return amount.toLocaleString() + '원';
  };

  // 진행 기간 계산
  const calculateDuration = () => {
    if (!basicInfo.startDate || !basicInfo.endDate) return '0일';

    const start = new Date(basicInfo.startDate);
    const end = new Date(basicInfo.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return `${diffDays}일`;
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">미리보기</h2>
        <p className="text-gray-600">펀딩이 실제로 어떻게 보일지 미리 확인해보세요.</p>
      </div>

      {/* 미리보기 */}
      <div className="border border-gray-200 rounded-lg overflow-hidden mb-8">
        {/* 헤더 - 타이틀 */}
        <div className="bg-gray-50 p-4 border-b">
          <h3 className="text-lg font-bold">{basicInfo.title || '(제목 없음)'}</h3>
        </div>

        {/* 메인 컨텐츠 */}
        <div className="p-4">
          {/* 상품 정보와 이미지 */}
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            {/* 상품 이미지 */}
            <div className="w-full md:w-1/2 h-64 bg-gray-100 flex items-center justify-center">
              {basicInfo.mainImage ? (
                <img
                  src={basicInfo.mainImage}
                  alt={basicInfo.title}
                  className="w-full h-full object-contain"
                />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              )}
            </div>

            {/* 상품 정보 */}
            <div className="w-full md:w-1/2">
              <div className="mb-6">
                <h4 className="text-xl font-bold mb-4">{selectedProduct.name || '(상품명 없음)'}</h4>
                <p className="text-gray-700 mb-4">{basicInfo.description || '(설명 없음)'}</p>
              </div>

              {/* 진행 상태 */}
              <div className="border-t border-b py-4 mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">목표 금액</span>
                  <span className="font-bold">{formatAmount(basicInfo.targetAmount)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">펀딩 기간</span>
                  <span>{formatDate(basicInfo.startDate)} ~ {formatDate(basicInfo.endDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">진행 기간</span>
                  <span>{calculateDuration()}</span>
                </div>
              </div>

              {/* 버튼 (실제로는 작동하지 않음) */}
              <div className="flex gap-2">
                <button className="flex-1 py-3 bg-primary-color text-white rounded-md">
                  펀딩 참여하기
                </button>
                <button className="w-12 h-12 border border-gray-200 rounded-md flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* 상품 정보 및 펀딩 정보 */}
          <div className="border-t pt-6">
            <div className="mb-6">
              <h4 className="text-lg font-medium mb-4">상품 정보</h4>
              <div className="border rounded-md overflow-hidden">
                <table className="w-full">
                  <tbody>
                    <tr className="border-b">
                      <td className="p-3 bg-gray-50 w-1/4">상품명</td>
                      <td className="p-3">{selectedProduct.name || '(상품명 없음)'}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 bg-gray-50">가격</td>
                      <td className="p-3">{selectedProduct.price ? formatAmount(selectedProduct.price) : '(가격 없음)'}</td>
                    </tr>
                    <tr>
                      <td className="p-3 bg-gray-50">카테고리</td>
                      <td className="p-3">{selectedProduct.category || '(카테고리 없음)'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-lg font-medium mb-4">펀딩 정보</h4>
              <div className="border rounded-md overflow-hidden">
                <table className="w-full">
                  <tbody>
                    <tr className="border-b">
                      <td className="p-3 bg-gray-50 w-1/4">공개 범위</td>
                      <td className="p-3">{publicSettings.isPublic ? '전체 공개' : '비공개'}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 bg-gray-50">댓글 기능</td>
                      <td className="p-3">{publicSettings.allowComments ? '허용' : '비허용'}</td>
                    </tr>
                    <tr>
                      <td className="p-3 bg-gray-50">참여자 표시</td>
                      <td className="p-3">{publicSettings.showParticipants ? '표시' : '비표시'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 댓글 (허용된 경우만) */}
            {publicSettings.allowComments && (
              <div>
                <h4 className="text-lg font-medium mb-4">댓글</h4>
                <div className="border rounded-md p-4 bg-gray-50 text-center text-gray-500">
                  아직 댓글이 없습니다.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 버튼 */}
      <div className="flex justify-between">
        <button
          onClick={onPrev}
          className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
        >
          이전 단계
        </button>
        <button
          onClick={onNext}
          className="px-6 py-2 bg-primary-color text-white rounded-md hover:bg-primary-color/90"
        >
          펀딩 생성하기
        </button>
      </div>
    </div>
  );
};

export default Preview;
