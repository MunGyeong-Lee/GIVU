import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import NavItem from './NavItem';
import { getUserInfo, UserInfo } from '../../api/user';
import { useAppSelector } from '../../hooks/reduxHooks';
import { logoutUser } from '../../api/kakaoAuth';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, token, user } = useAppSelector(state => state.auth);
  const isMainPage = location.pathname === '/';

  // 디버깅용 로그!
  useEffect(() => {
    console.log('인증 상태:', isAuthenticated);
    console.log('토큰:', token);
    console.log('Redux 사용자 정보:', user);
    console.log('로컬 스토리지 토큰:', localStorage.getItem('auth_token'));
    console.log('로컬 스토리지 사용자 정보:', localStorage.getItem('user_info'));
  }, [isAuthenticated, token, user]);

  // 스크롤 프로그래스 바 업데이트
  useEffect(() => {
    if (!isMainPage) return;

    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMainPage]);

  // 프로필 메뉴 외부 클릭 이벤트 처리
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 사용자 정보 가져오기!!
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
      setIsProfileMenuOpen(false);
      navigate('/');
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  // 프로필 메뉴 토글
  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const isActive = (path: string) => {
    // 펀딩 메뉴의 경우 특별히 처리
    if (path === '/funding') {
      return location.pathname.startsWith('/funding/');
    }
    return location.pathname.startsWith(path);
  };

  // 메뉴 항목 배열 정의
  const menuItems = [
    { path: '/funding', label: '펀딩', hasDropdown: true },
    { path: '/shopping', label: '기뷰몰', hasDropdown: false },
    { path: '/myfriend', label: '내 친구', hasDropdown: false }
  ];

  return (
    <header className='bg-white w-full border-b border-gray-200 fixed top-0 left-0 right-0 z-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          {/* 왼쪽 영역 (로고와 메뉴 아이템) */}
          <div className='flex items-center'>
            {/* 로고 */}
            <div className='flex-shrink-0 mr-10'>
              <Link to='/' className='text-xl font-bold text-primary-color hover:text-primary-color no-underline'>
                GIVU
              </Link>
            </div>

            {/* 메뉴 아이템 */}
            <nav className='flex space-x-8'>
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
          </div>

          {/* 오른쪽 영역 (프로젝트 올리기, 로그인/프로필) */}
          <div className="flex items-center space-x-4">
            <Link
              to="/funding/create"
              className="text-gray-700 text-sm font-medium hover:text-primary-color transition-colors"
            >
              프로젝트 올리기
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {/* 하트 아이콘 */}
                <Link to="/likes" className="text-gray-600 hover:text-primary-color">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </Link>

                {/* 알림 아이콘 */}
                <Link to="/notifications" className="text-gray-600 hover:text-primary-color">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </Link>

                {/* 프로필 드롭다운 */}
                <div className="relative" ref={profileMenuRef}>
                  <button
                    onClick={toggleProfileMenu}
                    className="flex items-center border border-gray-300 rounded-md py-1 px-3 hover:border-primary-color transition-colors cursor-pointer bg-white"
                  >
                    <img
                      src={userInfo?.profileImage || user?.profileImage || "/avatar.png"}
                      alt="프로필"
                      className="w-7 h-7 rounded-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/avatar.png";
                      }}
                    />
                    <span className="text-gray-700 text-sm ml-2 group-hover:text-primary-color">
                      {loading ? "로딩 중..." : userInfo?.nickName || user?.nickname || "사용자"}
                    </span>
                    <svg
                      className={`ml-1 h-4 w-4 text-gray-500 transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''
                        }`}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-20">
                      <Link
                        to="/mypage"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-color"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        마이페이지
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-color"
                      >
                        로그아웃
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <Link
                to='/login'
                className='block'
              >
                <div className="border border-gray-300 rounded-md flex items-center py-1 px-3 hover:border-primary-color transition-colors cursor-pointer bg-white">
                  <img
                    src="/avatar.png"
                    alt="프로필"
                    className="w-7 h-7 rounded-full"
                  />
                  <span className='text-gray-700 text-sm ml-2 hover:text-primary-color'>
                    로그인/회원가입
                  </span>
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* 스크롤 프로그래스 바 - 메인 페이지에서만 표시 */}
      {isMainPage && (
        <div className="absolute bottom-0 left-0 h-0.5 bg-gray-200 w-full">
          <div
            className="h-full bg-primary-color transition-all duration-300"
            style={{ width: `${scrollProgress}%` }}
          ></div>
        </div>
      )}
    </header>
  );
}

export default Navbar;