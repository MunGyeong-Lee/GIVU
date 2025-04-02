import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface FundingCreateNavbarProps {
  onPreview?: () => void;
  showPreviewButton?: boolean;
  currentStep?: string | number;
}

const FundingCreateNavbar: React.FC<FundingCreateNavbarProps> = ({
  onPreview,
  showPreviewButton = true,
}) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleHomeClick = () => {
    setShowModal(true);
  };

  const handleConfirmHome = () => {
    setShowModal(false);
    navigate('/'); // 홈으로 이동
  };

  const handleCancelHome = () => {
    setShowModal(false);
  };

  return (
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* 홈 버튼 */}
          <button
            onClick={handleHomeClick}
            className="flex items-center space-x-1 text-gray-700 bg-transparent border-none p-0 hover:text-primary-color transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <span className="font-medium">홈으로</span>
          </button>

          {/* 중앙 제목 */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <h1 className="text-lg font-semibold text-gray-800">
              펀딩 생성하기
            </h1>
          </div>

          {/* 미리보기 버튼 */}
          {showPreviewButton ? (
            <button
              onClick={onPreview}
              className="flex items-center px-4 py-1.5 border border-primary-color text-primary-color rounded-full text-sm font-medium hover:bg-primary-color hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary-color focus:ring-opacity-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
              미리보기
            </button>
          ) : (
            <button
              className="flex items-center px-4 py-1.5 text-gray-600 bg-gray-100 rounded-full text-sm font-medium"
              disabled
            >
              기획중
              <span className="ml-1 inline-block w-2 h-2 bg-gray-400 rounded-full"></span>
            </button>
          )}
        </div>
      </div>

      {/* 확인 모달 */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-fade-in">
            <div className="text-center mb-5">
              <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-yellow-100 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">작성 중인 내용이 저장되지 않습니다</h3>
              <p className="text-gray-500">
                지금까지 작성한 내용이 모두 사라집니다.
              </p>
              <p className="text-gray-500">
                정말 이동하시겠습니까?
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleCancelHome}
                className="flex-1 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleConfirmHome}
                className="flex-1 py-2.5 bg-primary-color text-white rounded-lg font-medium hover:bg-primary-color/90 transition-colors"
              >
                홈으로 이동
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default FundingCreateNavbar; 