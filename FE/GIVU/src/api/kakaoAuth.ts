import axios from 'axios';
import { loginStart, loginSuccess, loginFailure, logout } from '../store/slices/authSlice';
import { store } from '../store';

declare global {
  interface Window {
    Kakao: any;
  }
}

// 백엔드 API 기본 URL
const API_BASE_URL = import.meta.env.VITE_BASE_URL || 'https://j12d107.p.ssafy.io/api';

// 카카오 SDK 초기화 함수
export const initializeKakao = async (): Promise<boolean> => {
  const kakaoJsKey = import.meta.env.VITE_KAKAO_API_KEY;
  console.log("카카오 키:", kakaoJsKey);

  if (!kakaoJsKey) {
    console.error('카카오 API 키가 설정되지 않았습니다.');
    return false;
  }

  if (!window.Kakao) {
    console.error('카카오 SDK가 로드되지 않았습니다.');
    return false;
  }

  try {
    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(kakaoJsKey);
      console.log('카카오 SDK 초기화 성공');
    }
    return window.Kakao.isInitialized();
  } catch (error) {
    console.error('카카오 SDK 초기화 중 오류 발생:', error);
    return false;
  }
};

// 카카오 로그인 시작 (인가 코드 받기 위한 리다이렉트)
export const loginWithKakao = async (): Promise<void> => {
  try {
    const isInitialized = await initializeKakao();
    if (!isInitialized) {
      throw new Error('카카오 SDK 초기화에 실패했습니다.');
    }

    const redirectUri = import.meta.env.VITE_KAKAO_REDIRECT_URI || `${window.location.origin}/auth/kakao/callback`;
    console.log('리다이렉트 URI:', redirectUri);

    window.Kakao.Auth.authorize({
      redirectUri: redirectUri,
      scope: 'profile_nickname,profile_image,account_email'
    });
  } catch (error) {
    console.error('카카오 로그인 중 오류 발생:', error);
    throw error;
  }
};

// 인가 코드로 액세스 토큰 요청 (프론트엔드에서 직접 처리)
export const getAccessTokenFromCode = async (code: string): Promise<string> => {
  try {
    const kakaoRestApiKey = import.meta.env.VITE_KAKAO_REST_API_KEY;
    const redirectUri = import.meta.env.VITE_KAKAO_REDIRECT_URI || `${window.location.origin}/auth/kakao/callback`;
    
    if (!kakaoRestApiKey) {
      console.error('카카오 REST API 키가 설정되지 않았습니다.');
      throw new Error('카카오 REST API 키 설정 오류');
    }
    
    // URLSearchParams 객체를 사용하여 form 데이터 형식으로 인코딩
    const data = new URLSearchParams();
    data.append('grant_type', 'authorization_code');
    data.append('client_id', kakaoRestApiKey);
    data.append('redirect_uri', redirectUri);
    data.append('code', code);
    
    let retries = 3;
    while (retries > 0) {
      try {
        const response = await axios.post(
          'https://kauth.kakao.com/oauth/token',
          data,  // URLSearchParams 객체 전달
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
            }
          }
        );
        
        console.log('카카오 액세스 토큰 응답:', response.data);
        return response.data.access_token;
      } catch (error) {
        retries--;
        if (retries === 0) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000)); // 1초 대기
        console.log(`토큰 요청 재시도... (남은 시도: ${retries})`);
      }
    }
    
    // 이 코드는 while 루프 때문에 실제로 도달하지 않지만, 
    // TypeScript 린터 오류를 해결하기 위해 명시적인 예외를 던집니다
    throw new Error('모든 재시도 실패');
  } catch (error) {
    console.error('액세스 토큰 요청 중 오류 발생:', error);
    throw error;
  }
};

// 액세스 토큰을 백엔드로 전송하고 JWT 받기
export const sendAccessTokenToBackend = async (accessToken: string): Promise<void> => {
  try {
    console.log('카카오 액세스 토큰을 백엔드로 전송 시작:', accessToken.substring(0, 10) + '...');
    store.dispatch(loginStart());
    
    // API 요청 URL 확인
    const apiUrl = `${API_BASE_URL}/users/kakao?accessToken=${accessToken}`;
    console.log('API 요청 URL:', apiUrl);
    
    const response = await axios.post(
      apiUrl,
      {},
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );
    
    console.log('백엔드 응답:', response.data);
    
    // 백엔드에서 받은 토큰 추출
    const token = response.data.accessToken || response.data.token || accessToken;
    
    // 로컬 스토리지에 토큰만 저장 (Redux 상태 업데이트는 아직 하지 않음)
    localStorage.setItem('auth_token', token);
    
    // axios 기본 헤더에 토큰 설정
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    // 사용자 정보 가져오기!!
    try {
      const userInfo = await getUserInfoAfterLogin(token);
      
      if (userInfo) {
        // 사용자 정보를 로컬 스토리지에 저장
        localStorage.setItem('user_info', JSON.stringify(userInfo));
        
        // Redux 상태를 한 번만 업데이트 (여기서만 dispatch)
        store.dispatch(loginSuccess({ 
          token, 
          user: {
            id: String(userInfo.kakaoId),
            nickname: userInfo.nickName,
            email: userInfo.email,
            profileImage: userInfo.profileImage
          }
        }));
        
        console.log('로그인 처리 완료');
      } else {
        // 사용자 정보를 가져오지 못했을 때의 처리
        store.dispatch(loginFailure('사용자 정보를 가져오지 못했습니다.'));
      }
    } catch (userInfoError) {
      console.error('로그인 후 사용자 정보 조회 실패:', userInfoError);
      store.dispatch(loginFailure('사용자 정보 조회 실패'));
    }
    
    return;
  } catch (error) {
    console.error('백엔드 API 호출 중 오류 발생:', error);
    if (axios.isAxiosError(error)) {
      console.error('오류 상태 코드:', error.response?.status);
      console.error('오류 응답 데이터:', error.response?.data);
    }
    store.dispatch(loginFailure(error instanceof Error ? error.message : '로그인 중 오류가 발생했습니다'));
    throw error;
  }
};

// 로그인 직후 사용자 정보 가져오기
async function getUserInfoAfterLogin(token: string) {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/info`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('로그인 후 사용자 정보 응답:', response.data);
    return response.data;
  } catch (error) {
    console.error('사용자 정보 조회 중 오류 발생:', error);
    return null;
  }
}

// 로그아웃
export const logoutUser = async (): Promise<void> => {
  try {
    const state = store.getState();
    const token = state.auth.token;
    
    // Redux 스토어 업데이트
    store.dispatch(logout());
    
    // 로컬 스토리지에서 사용자 정보 제거
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    localStorage.removeItem('user_info');
    
    // axios 헤더에서 토큰 제거
    delete axios.defaults.headers.common['Authorization'];
    
    // 백엔드 로그아웃 API 호출 (존재하는 경우)
    if (token) {
      try {
        await axios.post(`${API_BASE_URL}/auth/logout`, {}, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      } catch (error) {
        console.error('백엔드 로그아웃 실패:', error);
        // 오류가 발생해도 계속 진행
      }
    }
    
    console.log('로컬 로그아웃 완료');
    
    // 카카오 로그아웃 URL로 리다이렉트하여 강제로 카카오 세션 삭제
    const kakaoRestApiKey = import.meta.env.VITE_KAKAO_REST_API_KEY;
    if (kakaoRestApiKey) {
      // 로그아웃 후 로그인 페이지로 리다이렉트하기 위한 URL
      const logoutRedirectUri = encodeURIComponent(`${window.location.origin}/login`);
      
      // 카카오 서버에서 로그아웃하도록 리다이렉트
      window.location.href = `https://kauth.kakao.com/oauth/logout?client_id=${kakaoRestApiKey}&logout_redirect_uri=${logoutRedirectUri}`;
    } else {
      // API 키가 없는 경우 로그인 페이지로 이동
      window.location.href = '/login';
    }
    
  } catch (error) {
    console.error('로그아웃 중 오류 발생:', error);
    // 오류 발생 시에도 로그인 페이지로 이동
    window.location.href = '/login';
  }
};

// 인증 상태 체크 (리다이렉트 등에 활용)
export const checkAuthStatus = (): boolean => {
  const state = store.getState();
  return state.auth.isAuthenticated;
};

// 현재 사용자 정보 가져오기
export const getCurrentUser = (): any => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error('사용자 정보 파싱 오류:', error);
    return null;
  }
};

// 백엔드에서 최신 사용자 정보 조회
export const refreshUserInfo = async (): Promise<any> => {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('인증 토큰이 없습니다.');
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/api/user/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        withCredentials: true,
      });
      
      const userData = response.data;
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    } catch (error) {
      // axios 오류 처리
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        // 401 응답인 경우 토큰 갱신 시도
        const newToken = await refreshAccessToken();
        if (newToken) {
          // 새 토큰으로 다시 시도
          return refreshUserInfo();
        } else {
          throw new Error('토큰 갱신에 실패했습니다.');
        }
      }
      throw error;
    }
  } catch (error) {
    console.error('사용자 정보 조회 중 오류 발생:', error);
    throw error;
  }
};

// 액세스 토큰 갱신
export const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/auth/newToken`, {}, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true, // 쿠키를 포함하여 요청
    });

    if (response.data?.token) {
      localStorage.setItem('auth_token', response.data.token);
      return response.data.token;
    }
    return null;
  } catch (error) {
    console.error('토큰 갱신 중 오류 발생:', error);
    // 토큰 갱신 실패 시 로그아웃 처리
    await logoutUser();
    return null;
  }
}; 