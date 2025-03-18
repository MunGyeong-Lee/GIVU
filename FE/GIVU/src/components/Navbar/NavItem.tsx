import { useState } from 'react';
import { Link } from 'react-router-dom';

// NavItem prop 타입 정의
interface NavItemProps {
  to: string;
  label: string;
  isActive: boolean;
  hasDropdown?: boolean;
}

// NavItem 컴포넌트
function NavItem({ to, label, isActive, hasDropdown }: NavItemProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // 드롭다운 메뉴 토글
  const handleMouseEnter = () => {
    if (hasDropdown) {
      setIsDropdownOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (hasDropdown) {
      setIsDropdownOpen(false);
    }
  };

  // 클릭 이벤트 핸들러
  const handleClick = (e: React.MouseEvent) => {
    if (hasDropdown) {
      // 드롭다운이 있는 경우 클릭 이벤트 방지
      e.preventDefault();
    }
  };

  return (
    <div className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <Link
        to={to}
        onClick={handleClick}
        className={`px-3 py-2 ${isActive ? 'text-blue-600 font-medium' : 'text-gray-600'} hover:text-blue-600 relative inline-flex items-center ${hasDropdown ? 'cursor-default' : ''}`}
      >
        {label}

        {isActive && (
          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></span>
        )}
      </Link>

      {hasDropdown && isDropdownOpen && (
        <div className="absolute left-0 mt-1 w-48 bg-white shadow-lg rounded-md py-1 z-10">
          <Link
            to="/funding/list"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            펀딩 목록
          </Link>
          <Link
            to="/funding/review"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            펀딩 후기
          </Link>
        </div>
      )}
    </div>
  );
}

export default NavItem; // 컴포넌트 내보내기
