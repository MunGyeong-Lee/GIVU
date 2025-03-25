import React from 'react';

// 카테고리 아이템 타입 정의
export interface CategoryItem {
  id: string;
  name: string;
}

// 카테고리 탭 컴포넌트 props 타입 정의
interface CategoryTabsProps {
  categories: CategoryItem[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
  title?: string;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  title = '카테고리별 펀딩'
}) => {
  return (
    <div className="mb-6">
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category.id}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === category.id
              ? 'text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            style={{
              backgroundColor: selectedCategory === category.id ? '#FF5B61' : undefined
            }}
            onClick={() => onCategoryChange(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryTabs; 