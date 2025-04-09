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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
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
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
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
      setIsMobileMenuOpen(false);
      navigate('/');
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  // 프로필 메뉴 토글
  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  // 모바일 메뉴 토글
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
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
              <Link to='/'>
                <img src='/GIVU_LOGO.png' alt='GIVU Logo' className='h-11 w-auto' />
              </Link>
            </div>

            {/* 데스크탑 메뉴 아이템 - 모바일에서는 숨김 */}
            <nav className='hidden md:flex space-x-8'>
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

          {/* 오른쪽 영역 (펀딩 생성하기, 로그인/프로필) */}
          <div className="flex items-center space-x-4">
            {/* 펀딩 생성하기 버튼 - 로그인한 사용자에게만 표시, 모바일에서는 숨김 */}
            {isAuthenticated && (
              <Link
                to="/funding/create"
                className="hidden md:block text-gray-700 text-sm font-medium hover:text-primary-color transition-colors"
              >
                펀딩 생성하기
              </Link>
            )}

            {/* 로그인 상태 UI */}
            <div className="hidden md:block">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
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
                  onClick={(e) => {
                    // 이미 로그인된 상태라면 로그인 페이지로 이동 방지
                    if (isAuthenticated) {
                      e.preventDefault();
                      console.log('이미 로그인 되어 있습니다.');
                    }
                  }}
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

            {/* 햄버거 메뉴 아이콘 - 모바일에서만 표시 */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden flex items-center p-1 rounded-full text-gray-600 hover:text-primary-color focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      <div
        ref={mobileMenuRef}
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ease-in-out 
          ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <div
          className={`absolute top-0 right-0 w-64 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="p-5">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800">메뉴</h3>
              <button
                onClick={toggleMobileMenu}
                className="text-gray-500 hover:text-gray-800 focus:outline-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* 모바일 메뉴 항목 */}
            <nav className="flex flex-col space-y-4">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`${isActive(item.path) ? 'text-primary-color font-medium' : 'text-gray-700'} text-base hover:text-primary-color`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              {/* 펀딩 생성하기 - 로그인한 사용자에게만 표시 */}
              {isAuthenticated && (
                <Link
                  to="/funding/create"
                  className="text-gray-700 text-base hover:text-primary-color"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  펀딩 생성하기
                </Link>
              )}
            </nav>

            {/* 모바일 로그인/프로필 영역 */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              {isAuthenticated ? (
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={userInfo?.profileImage || user?.profileImage || "/avatar.png"}
                      alt="프로필"
                      className="w-10 h-10 rounded-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/avatar.png";
                      }}
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-800">
                        {loading ? "로딩 중..." : userInfo?.nickName || user?.nickname || "사용자"}
                      </div>
                    </div>
                  </div>

                  <Link
                    to="/mypage"
                    className="text-gray-700 text-base hover:text-primary-color"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    마이페이지
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="text-left text-gray-700 text-base hover:text-primary-color"
                  >
                    로그아웃
                  </button>
                </div>
              ) : (
                <Link
                  to='/login'
                  className="flex items-center space-x-2 text-gray-700 text-base hover:text-primary-color"
                  onClick={(e) => {
                    if (isAuthenticated) {
                      e.preventDefault();
                      console.log('이미 로그인 되어 있습니다.');
                    }
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <img
                    src="/avatar.png"
                    alt="프로필"
                    className="w-8 h-8 rounded-full"
                  />
                  <span>로그인/회원가입</span>
                </Link>
              )}
            </div>
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