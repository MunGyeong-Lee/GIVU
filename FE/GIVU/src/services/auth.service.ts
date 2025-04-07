import axios from 'axios';

// API Base URL 가져오기
const API_BASE_URL = import.meta.env.VITE_BASE_URL;

// 현재 로그인한 사용자 정보 인터페이스
export interface UserInfo {
  userId: number;
  email: string;
  name: string;
  nickName: string;
  image: string | null;
  balance: number;
  role: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 인증 토큰 가져오기
 * @returns 인증 토큰 또는 null
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token') || 
         localStorage.getItem('access_token') || 
         localStorage.getItem('token');
};

/**
 * 사용자가 로그인했는지 확인
 * @returns 로그인 여부
 */
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

/**
 * 현재 로그인한 사용자 정보 가져오기
 * @returns 사용자 정보 객체
 */
export const getCurrentUser = async (): Promise<UserInfo | null> => {
  try {
    const token = getAuthToken();
    if (!token) {
      return null;
    }

    const response = await axios.get(`${API_BASE_URL}/users/info`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.data) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error('사용자 정보 가져오기 실패:', error);
    return null;
  }
};

/**
 * 현재 사용자의 ID 가져오기
 * @returns 사용자 ID 또는 null
 */
export const getCurrentUserId = async (): Promise<number | null> => {
  const user = await getCurrentUser();
  return user ? user.userId : null;
};

/**
 * 로그아웃 처리
 */
export const logout = (): void => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('access_token');
  localStorage.removeItem('token');
  // 필요한 경우 추가 정리 작업 수행
  // 예: 리다이렉트, 상태 초기화 등
}; 