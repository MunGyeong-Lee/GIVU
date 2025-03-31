import React from 'react';

// 로딩 스피너 컴포넌트 props 타입 정의
interface LoadingSpinnerProps {
  color?: string;
  size?: number;
  thickness?: number;
  className?: string;
  text?: string;
  showText?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  color = '#FF5B61',
  size = 10,
  thickness = 2,
  className = '',
  text = '로딩 중...',
  showText = true
}) => {
  return (
    <div className={`flex flex-col justify-center items-center py-4 ${className}`}>
      <div className="relative">
        <div
          className="animate-spin rounded-full border-solid"
          style={{
            borderColor: `${color}20`,
            borderTopColor: color,
            height: `${size * 4}px`,
            width: `${size * 4}px`,
            borderWidth: `${thickness}px`
          }}
        ></div>
      </div>

      {showText && (
        <div className="mt-3 text-sm text-gray-500 animate-pulse">
          {text}
        </div>
      )}
    </div>
  );
};

export default LoadingSpinner; 