import React from 'react';

interface PublicSettings {
  isPublic: boolean; // true: 전체 공개, false: 친구 공개
}

interface Step3PublicSettingsProps {
  publicSettings: PublicSettings;
  updatePublicSettings: (settings: PublicSettings) => void;
  onNext: () => void;
  onPrev: () => void;
}

const Step3PublicSettings: React.FC<Step3PublicSettingsProps> = ({
  publicSettings,
  updatePublicSettings,
  onNext,
  onPrev
}) => {
  // 다음 버튼 클릭 핸들러
  const handleNext = () => {
    onNext();
  };

  return (
    <div className="p-6">
      <div className="mb-8 text-center border-b pb-6">
        <h2 className="text-2xl font-bold mb-2">공개 설정</h2>
        <p className="text-gray-600 max-w-xl mx-auto">
          펀딩의 공개 범위를 설정해주세요. 공개 범위에 따라 펀딩이 노출되는 방식이 달라집니다.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* 공개 범위 선택 - 좌우로 크게 나누어 표시 */}
        <div className="mb-10">
          <h3 className="text-lg font-medium mb-4 pb-2 border-b">공개 범위 선택</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* 전체 공개 옵션 */}
            <div
              className={`flex flex-col h-64 border-2 rounded-xl cursor-pointer transition-all overflow-hidden ${publicSettings.isPublic
                ? 'border-primary-color shadow-md'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              onClick={() => updatePublicSettings({ isPublic: true })}
            >
              <div className={`flex-1 flex flex-col items-center justify-center p-6 ${publicSettings.isPublic ? 'bg-primary-color/5' : ''
                }`}>
                <div className="w-20 h-20 rounded-full bg-primary-color/10 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary-color" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <h4 className="font-bold text-lg mb-1">전체 공개</h4>
                <p className="text-center text-sm text-gray-600">
                  펀딩이 공개 목록에 표시되며,<br />누구나 검색하고 볼 수 있습니다.
                </p>
              </div>
              <div className={`h-12 flex items-center justify-center ${publicSettings.isPublic ? 'bg-primary-color text-white' : 'bg-gray-100 text-gray-500'
                }`}>
                <div className="flex items-center">
                  {publicSettings.isPublic && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                  <span className="font-medium">{publicSettings.isPublic ? '선택됨' : '선택하기'}</span>
                </div>
              </div>
            </div>

            {/* 친구 공개 옵션 */}
            <div
              className={`flex flex-col h-64 border-2 rounded-xl cursor-pointer transition-all overflow-hidden ${!publicSettings.isPublic
                ? 'border-primary-color shadow-md'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              onClick={() => updatePublicSettings({ isPublic: false })}
            >
              <div className={`flex-1 flex flex-col items-center justify-center p-6 ${!publicSettings.isPublic ? 'bg-primary-color/5' : ''
                }`}>
                <div className="w-20 h-20 rounded-full bg-primary-color/10 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary-color" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h4 className="font-bold text-lg mb-1">친구 공개</h4>
                <p className="text-center text-sm text-gray-600">
                  친구만 이 펀딩을 볼 수 있으며,<br />공개 목록에 표시되지 않습니다.
                </p>
              </div>
              <div className={`h-12 flex items-center justify-center ${!publicSettings.isPublic ? 'bg-primary-color text-white' : 'bg-gray-100 text-gray-500'
                }`}>
                <div className="flex items-center">
                  {!publicSettings.isPublic && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                  <span className="font-medium">{!publicSettings.isPublic ? '선택됨' : '선택하기'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex justify-between mt-10 border-t pt-6">
          <button
            onClick={onPrev}
            className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center font-medium shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            이전 단계
          </button>
          <button
            onClick={handleNext}
            className="px-8 py-2.5 bg-primary-color text-white rounded-lg hover:bg-primary-color/90 transition-colors flex items-center font-medium shadow-md"
          >
            다음 단계
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step3PublicSettings;
