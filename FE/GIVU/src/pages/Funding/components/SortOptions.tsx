import React from 'react';
import { FiChevronDown } from 'react-icons/fi';

export type SortOption = 'latest' | 'oldest' | 'popular' | 'achievement';

interface SortOptionsProps {
  selectedSort: string;
  onSortChange: (sortId: string) => void;
}

const SortOptions: React.FC<SortOptionsProps> = ({ selectedSort, onSortChange }) => {
  const options = [
    { id: 'latest', name: '최신순' },
    { id: 'oldest', name: '오래된순' },
    { id: 'popular', name: '인기순' },
    { id: 'achievement', name: '달성률순' }
  ];

  return (
    <div className="flex justify-end items-center">
      <div className="relative inline-block text-left">
        <select
          className="appearance-none bg-white border border-gray-200 text-gray-700 py-1 px-3 pr-8 rounded-md text-sm focus:outline-none focus:border-gray-400"
          value={selectedSort}
          onChange={(e) => onSortChange(e.target.value)}
        >
          {options.map(option => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <FiChevronDown size={16} />
        </div>
      </div>
    </div>
  );
};

export default SortOptions; 