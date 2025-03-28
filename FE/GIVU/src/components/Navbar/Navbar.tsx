import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import NavItem from './NavItem';
import { getUserInfo, UserInfo } from '../../api/user';
import { useAppSelector } from '../../hooks/reduxHooks';
import { logoutUser } from '../../api/kakaoAuth';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, token, user } = useAppSelector(state => state.auth);

  // 디버깅용 로그
  useEffect(() => {
    console.log('인증 상태:', isAuthenticated);
    console.log('토큰:', token);
    console.log('Redux 사용자 정보:', user);
    console.log('로컬 스토리지 토큰:', localStorage.getItem('auth_token'));
    console.log('로컬 스토리지 사용자 정보:', localStorage.getItem('user_info'));
  }, [isAuthenticated, token, user]);

  // 사용자 정보 가져오기
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (isAuthenticated) {
        try {
          console.log('사용자 정보 요청 시작...');
          setLoading(true);

          // 로컬 스토리지에서 user_info를 먼저 확인
          const storedUserInfo = localStorage.getItem('user_info');
          if (storedUserInfo) {
            try {
              const parsedInfo = JSON.parse(storedUserInfo);
              console.log('로컬 스토리지에서 가져온 사용자 정보:', parsedInfo);
              setUserInfo(parsedInfo);
              setLoading(false);
              return;
            } catch (err) {
              console.error('로컬 스토리지 사용자 정보 파싱 오류:', err);
            }
          }

          // API 호출로 사용자 정보 가져오기
          const info = await getUserInfo();
          console.log('API에서 받아온 사용자 정보:', info);
          setUserInfo(info);
          // 로컬 스토리지에 저장
          localStorage.setItem('user_info', JSON.stringify(info));
        } catch (error) {
          console.error('사용자 정보 조회 실패:', error);
        } finally {
          setLoading(false);
        }
      } else {
        console.log('인증되지 않음: 사용자 정보 요청 건너뜀');
      }
    };

    fetchUserInfo();
  }, [isAuthenticated]);

  // 로그아웃 처리
  const handleLogout = async () => {
    try {
      await logoutUser();
      setUserInfo(null);
      navigate('/');
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
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
          <div className="flex items-center space-x-4">
            <Link
              to="/funding/create"
              className="bg-primary-color text-white px-4 py-1.5 rounded-md text-sm font-medium hover:bg-primary-color/90 transition"
            >
              펀딩 생성하기
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center">
                {loading ? (
                  <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse mr-2"></div>
                ) : (
                  <img
                    src={userInfo?.profileImage || user?.profileImage || "https://via.placeholder.com/32"}
                    alt="프로필"
                    className="w-8 h-8 rounded-full mr-2 object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/32";
                    }}
                  />
                )}
                <div className="text-gray-700 font-medium mr-4">
                  {loading ? "로딩 중..." : userInfo?.nickName || user?.nickname || "사용자"}
                </div>
                <button
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-gray-700"
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <Link
                to='/login'
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