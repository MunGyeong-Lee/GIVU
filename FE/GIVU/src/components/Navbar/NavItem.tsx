import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

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
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number | null>(null);
  const location = useLocation();

  // 마우스 이벤트 핸들러
  const handleMouseEnter = () => {
    if (hasDropdown) {
      // 기존 타임아웃 취소
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setIsDropdownOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (hasDropdown) {
      // 타임아웃 설정 (약간의 지연 시간을 줌)
      timeoutRef.current = window.setTimeout(() => {
        setIsDropdownOpen(false);
      }, 100);
    }
  };

  // 클릭 이벤트 핸들러
  const handleClick = (e: React.MouseEvent) => {
    if (hasDropdown) {
      e.preventDefault();
      setIsDropdownOpen(!isDropdownOpen);
    }
  };

  // 컴포넌트 언마운트 시 타임아웃 정리
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // 서브메뉴 배열 (펀딩 메뉴에 대한 드롭다운 항목)
  const fundingSubmenus = [
    { path: '/funding/list', label: '펀딩 목록' },
    { path: '/funding/review', label: '펀딩 후기' }
  ];

  // 라우트 활성화 확인 함수
  const isRouteActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={dropdownRef}
    >
      <Link
        to={to}
        onClick={handleClick}
        className={`block px-2 py-3 text-sm ${isActive
          ? 'text-primary-color font-medium border-b-2 border-primary-color'
          : 'text-gray-700 hover:text-primary-color'
          }`}
      >
        {label}
      </Link>

      {hasDropdown && isDropdownOpen && (
        <div
          className="absolute left-0 mt-0 w-48 bg-white shadow-lg rounded-md py-1 z-10 border border-gray-100"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {fundingSubmenus.map((submenu) => (
            <Link
              key={submenu.path}
              to={submenu.path}
              className={`block px-4 py-2 text-sm ${isRouteActive(submenu.path)
                ? 'text-primary-color bg-gray-50'
                : 'text-gray-700 hover:bg-gray-50 hover:text-primary-color'
                }`}
            >
              {submenu.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default NavItem; // 컴포넌트 내보내기