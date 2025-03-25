import React from 'react';

// 정렬 옵션 아이템 타입 정의
export interface SortOption {
  id: string;
  name: string;
}

// 정렬 옵션 컴포넌트 props 타입 정의
interface SortOptionsProps {
  options: SortOption[];
  selectedOption: string;
  onSortChange: (sortId: string) => void;
}

const SortOptions: React.FC<SortOptionsProps> = ({
  options,
  selectedOption,
  onSortChange
}) => {
  return (
    <div className="flex justify-end mb-4">
      <div className="flex space-x-2">
        {options.map((option) => (
          <button
            key={option.id}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedOption === option.id
              ? 'bg-gray-100 text-gray-800 border border-gray-400'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            onClick={() => onSortChange(option.id)}
          >
            {option.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SortOptions; 