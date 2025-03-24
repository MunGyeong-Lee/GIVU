import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import NavItem from './NavItem';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 초기값은 로그아웃 상태

  // 테스트용 토글 함수
  const toggleLogin = () => {
    setIsLoggedIn(!isLoggedIn);
  };

  const isActive = (path: string) => {
    // 펀딩 메뉴의 경우 특별히 처리
    if (path === '/funding') {
      return location.pathname.startsWith('/funding/');
    }
    return location.pathname.startsWith(path);
  };

  // 검색 제출 핸들러
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
      setSearchTerm('');
    }
  };

  // 메뉴 항목 배열 정의
  const menuItems = [
    { path: '/funding', label: '펀딩', hasDropdown: true },
    { path: '/shopping', label: '기뷰몰', hasDropdown: false },
    { path: '/myfriend', label: '내 친구', hasDropdown: false }
  ];

  return (
    //  JSX
    <header className='bg-white w-full shadow-sm'>
      <div className='w-full px-4'>
        <div className='flex justify-between items-center h-16'>
          {/* 로고 */}
          <div>
            <Link to='/' className='text-xl font-bold text-primary-color'>GIVU</Link>
          </div>

          {/* 메뉴 아이템 */}
          <nav className='flex space-x-4'>
            {menuItems.map((item) => (
              <NavItem
                key={item.path}
                to={item.path}
                label={item.label}
                isActive={isActive(item.path)}
                hasDropdown={item.hasDropdown}
              />
            ))}
          </nav>

          {/* 검색 바 */}
          <div className='flex items-center ml-4'>
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="펀딩 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 rounded-full px-4 py-1 text-sm focus:outline-none focus:border-primary-color w-64"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>

          {/* 로그인 상태에 따른 UI 분기 */}
          <div>
            {isLoggedIn ? (
              <div className="flex items-center">
                <img
                  src="https://via.placeholder.com/32"
                  alt="프로필"
                  className="w-8 h-8 rounded-full mr-2"
                />
                <div className="text-gray-700 font-medium mr-4">사용자님</div>
                <button
                  onClick={toggleLogin}
                  className="text-gray-500 hover:text-gray-700"
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <Link
                to='/login'
                onClick={toggleLogin} // 테스트용
                className='text-gray-700 hover:text-primary-color font-medium'
              >
                로그인
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;