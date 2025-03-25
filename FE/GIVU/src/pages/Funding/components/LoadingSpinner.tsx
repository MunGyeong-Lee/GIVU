import React from 'react';

// 로딩 스피너 컴포넌트 props 타입 정의
interface LoadingSpinnerProps {
  color?: string;
  size?: number;
  thickness?: number;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  color = '#FF5B61',
  size = 10,
  thickness = 2,
  className = ''
}) => {
  return (
    <div className={`flex justify-center items-center py-6 ${className}`}>
      <div
        className={`animate-spin rounded-full h-${size} w-${size} border-t-${thickness} border-b-${thickness}`}
        style={{ borderColor: color }}
      ></div>
    </div>
  );
};

export default LoadingSpinner; 