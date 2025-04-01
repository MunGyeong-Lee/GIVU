import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface FundingCreateNavbarProps {
  onPreview?: () => void;
  showPreviewButton?: boolean;
  currentStep?: string | number;
}

const FundingCreateNavbar: React.FC<FundingCreateNavbarProps> = ({
  onPreview,
  showPreviewButton = true,
  currentStep = 1
}) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  return (
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* 뒤로가기 버튼 */}
          <button
            onClick={handleBackClick}
            className="flex items-center space-x-1 text-gray-700 bg-transparent border-none p-0 hover:text-primary-color transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">뒤로가기</span>
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
    </header>
  );
};

export default FundingCreateNavbar; 