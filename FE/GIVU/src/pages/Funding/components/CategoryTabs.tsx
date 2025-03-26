import React from 'react';
import {
  RiGiftLine,
  RiHome2Line,
  RiHeartLine,
  RiParentLine,
  RiGraduationCapLine,
  RiBriefcaseLine
} from 'react-icons/ri';
import { HiOutlineSquares2X2 } from 'react-icons/hi2';

// 카테고리 아이템 타입 정의
export interface CategoryItem {
  id: string;
  name: string;
  icon: React.ReactNode;
}

// 카테고리 탭 컴포넌트 props 타입 정의
interface CategoryTabsProps {
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({
  selectedCategory,
  onCategoryChange,
}) => {
  // 카테고리 정의
  const categories: CategoryItem[] = [
    { id: 'all', name: 'ALL', icon: <HiOutlineSquares2X2 size={25} /> },
    { id: 'birthday', name: '생일', icon: <RiGiftLine size={25} /> },
    { id: 'housewarming', name: '집들이', icon: <RiHome2Line size={25} /> },
    { id: 'wedding', name: '결혼', icon: <RiHeartLine size={25} /> },
    { id: 'birth', name: '출산', icon: <RiParentLine size={25} /> },
    { id: 'graduation', name: '졸업', icon: <RiGraduationCapLine size={25} /> },
    { id: 'employment', name: '취업', icon: <RiBriefcaseLine size={25} /> },
  ];

  return (
    <div className="w-full bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-center relative">
          <div className="flex space-x-8 overflow-x-auto no-scrollbar">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={`flex flex-col items-center py-6 px-4 min-w-[80px] relative cursor-pointer transition-all duration-200 ${selectedCategory === category.id
                  ? 'text-gray-900'
                  : 'text-gray-400 hover:text-gray-700'
                  }`}
              >
                <div className={`mb-2 ${selectedCategory === category.id
                  ? 'text-gray-900'
                  : 'text-gray-400 hover:text-gray-700'
                  }`}>
                  {category.icon}
                </div>
                <span className={`text-[20px] whitespace-nowrap font-medium ${selectedCategory === category.id
                  ? 'text-gray-900'
                  : 'text-gray-400 hover:text-gray-700'
                  }`}>
                  {category.name}
                </span>

                {/* 선택된 카테고리 표시 마커 */}
                {selectedCategory === category.id && (
                  <div className="absolute" style={{
                    bottom: '-1px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '50%',
                    height: '3px',
                    backgroundColor: '#000',
                    zIndex: 10
                  }} />
                )}
              </button>
            ))}
          </div>

          {/* 구분선 */}
          <div className="absolute bottom-0 left-0 w-full border-b border-gray-200" />
        </div>
      </div>
      <style>
        {`
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          button {
            background-color: transparent !important;
          }
          button:hover {
            background-color: transparent !important;
          }
          button:hover .text-gray-400 {
            color: #374151 !important; /* gray-700 */
          }
        `}
      </style>
    </div>
  );
};

export default CategoryTabs; 