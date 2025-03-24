// 카카오 인증 관련 router

import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';
import LoginPage from '../pages/LoginPage';
import KakaoCallback from '../pages/KakaoCallback';

// 홈 페이지 컴포넌트 (테스트용)
export const HomePage = () => {
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">GIVU</h1>
          {user && (
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                {user.profileImage && (
                  <img
                    src={user.profileImage}
                    alt="프로필"
                    className="w-8 h-8 rounded-full mr-2"
                  />
                )}
                <span>{user.nickname}님</span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
              >
                로그아웃
              </button>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">환영합니다!</h2>
          <p>GIVU는 생일, 결혼, 취직 등의 이벤트가 있을 때 친구들에게 펀딩을 받아 원하는 상품을 구매할 수 있는 크라우드펀딩 서비스입니다.</p>

          {user ? (
            <div className="mt-4 p-4 bg-gray-50 rounded-md">
              <h3 className="font-medium">사용자 정보</h3>
              <div className="mt-2 space-y-2">
                <p>닉네임: {user.nickname}</p>
                {user.email && <p>이메일: {user.email}</p>}
              </div>
            </div>
          ) : (
            <div className="mt-4">
              <a
                href="/login"
                className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                로그인하기
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// 인증 상태에 따른 리다이렉션 처리 컴포넌트
interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo: string;
  isAuthenticated: boolean;
}

export const ProtectedRoute = ({
  children,
  redirectTo,
  isAuthenticated
}: ProtectedRouteProps) => {
  return isAuthenticated ? <>{children}</> : <Navigate to={redirectTo} />;
};

// 인증 상태에 따른 리다이렉션 처리 컴포넌트 (로그인된 상태에서 로그인 페이지로 접근 방지)
interface AuthRedirectProps {
  children: ReactNode;
  redirectTo: string;
  isAuthenticated: boolean;
}

export const AuthRedirect = ({
  children,
  redirectTo,
  isAuthenticated
}: AuthRedirectProps) => {
  return !isAuthenticated ? <>{children}</> : <Navigate to={redirectTo} />;
};

// 인증 관련 라우트 설정
export const authRoutes = [
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/auth/kakao/callback',
    element: <KakaoCallback />,
  },
]; 