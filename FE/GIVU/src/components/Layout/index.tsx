import { Link, useLocation } from 'react-router-dom';
import NavItem from './NavItem';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-lg">
      <div className="flex justify-between items-center h-16 px-8">
        {/* 로고 */}
        <Link to="/" className="flex items-center">
          <span className="text-xl font-bold text-gray-800">GIVU</span>
        </Link>

        {/* 네비게이션 메뉴 */}
        <div className="flex space-x-8">
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
        </div>

        {/* 검색바와 펀딩 생성 버튼 */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="펀딩 검색"
              className="w-64 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
            />
          </div>
          <Link 
            to="/funding/create" 
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors whitespace-nowrap"
          >
            펀딩 생성하기
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 