import { Link, useLocation } from 'react-router-dom';
import NavItem from './NavItem';

const Navbar = () => {
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 로고 */}
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-blue-600">GIVU</span>
          </Link>

          {/* 네비게이션 메뉴 */}
          <nav className="hidden md:flex space-x-8">
            <NavItem 
              to="/funding" 
              label="펀딩" 
              isActive={location.pathname.startsWith('/funding')} 
            />
            <NavItem 
              to="/mall" 
              label="기뷰몰" 
              isActive={location.pathname.startsWith('/mall')} 
            />
            <NavItem 
              to="/myfriend" 
              label="내친구" 
              isActive={location.pathname.startsWith('/myfriend')} 
            />
            <NavItem 
              to="/review" 
              label="펀딩 후기" 
              isActive={location.pathname.startsWith('/review')} 
            />
          </nav>

          {/* 검색바와 펀딩 생성 버튼 */}
          <div className="flex items-center space-x-4">
            <div className="relative hidden sm:block">
              <input
                type="text"
                placeholder="펀딩 검색"
                className="w-64 px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
            <Link 
              to="/funding/create" 
              className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors whitespace-nowrap text-sm font-medium"
            >
              펀딩 생성하기
            </Link>
          </div>

          {/* 모바일 메뉴 버튼 (md 미만에서만 표시) */}
          <button className="md:hidden flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar; 