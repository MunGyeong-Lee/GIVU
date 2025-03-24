import { KakaoUser } from '../types/kakao';

declare global {
  interface Window {
    Kakao: any;
  }
}

// 초기화 함수
export const initializeKakao = async (): Promise<boolean> => {
  const kakaoJsKey = import.meta.env.VITE_KAKAO_API_KEY;
  console.log("카카오 키:", kakaoJsKey);

  // API 키가 설정되지 않았다면 오류 발생하고 false 반환
  if (!kakaoJsKey) {
    console.error('카카오 API 키가 설정되지 않았습니다.');
    return false;
  }

  // SDK가 로드되었는지 확인
  if (!window.Kakao) {
    console.error('카카오 SDK가 로드되지 않았습니다. index.html에 SDK 스크립트가 포함되어 있는지 확인하세요.');
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

// 카카오 로그인 - 리다이렉트 방식으로 수정
export const loginWithKakao = async (): Promise<void> => {
  try {
    // SDK 초기화 확인
    const isInitialized = await initializeKakao();
    if (!isInitialized) {
      throw new Error('카카오 SDK 초기화에 실패했습니다.');
    }

    // 리다이렉트 URI 설정
    const redirectUri = import.meta.env.VITE_KAKAO_REDIRECT_URI || `${window.location.origin}/auth/kakao/callback`;
    console.log('리다이렉트 URI:', redirectUri);

    // 카카오 로그인 - 리다이렉트 방식
    window.Kakao.Auth.authorize({
      redirectUri: redirectUri,
      scope: 'profile_nickname,profile_image,account_email'
    });
  } catch (error) {
    console.error('카카오 로그인 중 오류 발생:', error);
    throw error;
  }
};

// 인증 코드로 액세스 토큰 교환하기 - REST API 방식으로 변경
export const getTokenWithCode = async (code: string): Promise<void> => {
  try {
    // SDK 초기화 확인
    const isInitialized = await initializeKakao();
    if (!isInitialized) {
      throw new Error('카카오 SDK 초기화에 실패했습니다.');
    }
    
    // 리다이렉트 URI 설정
    const redirectUri = import.meta.env.VITE_KAKAO_REDIRECT_URI || `${window.location.origin}/auth/kakao/callback`;
    const restApiKey = import.meta.env.VITE_KAKAO_REST_API_KEY || import.meta.env.VITE_KAKAO_API_KEY;
    
    // REST API를 사용하여 토큰 교환
    const tokenUrl = 'https://kauth.kakao.com/oauth/token';
    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('client_id', restApiKey);
    params.append('redirect_uri', redirectUri);
    params.append('code', code);
    
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
      body: params,
    });
    
    if (!response.ok) {
      throw new Error(`토큰 교환 실패: ${response.status} ${response.statusText}`);
    }
    
    const tokenResponse = await response.json();
    console.log('토큰 교환 성공:', tokenResponse);
    
    // 토큰을 SDK에 설정
    window.Kakao.Auth.setAccessToken(tokenResponse.access_token);
  } catch (error) {
    console.error('토큰 교환 중 오류 발생:', error);
    throw error;
  }
};

// 카카오 토큰 정보로 사용자 정보 얻기 
export const getUserInfo = async (): Promise<KakaoUser> => {
  try {
    if (!window.Kakao) {
      throw new Error('카카오 SDK가 로드되지 않았습니다.');
    }
    
    // 액세스 토큰 확인
    if (!window.Kakao.Auth.getAccessToken()) {
      throw new Error('액세스 토큰이 없습니다. 로그인이 필요합니다.');
    }
    
    // 카카오 API를 Promise 형태로 호출
    const response = await window.Kakao.API.request({
      url: '/v2/user/me'
    });
    
    return response;
  } catch (error) {
    console.error('사용자 정보 요청 중 오류 발생:', error);
    throw error;
  }
};

// 카카오 인증 코드로 사용자 정보 얻기 (콜백 페이지에서 사용)
export const getUserInfoWithCode = async (code: string): Promise<KakaoUser> => {
  try {
    // 1. 인증 코드로 토큰 교환
    await getTokenWithCode(code);
    
    // 2. 토큰으로 사용자 정보 요청
    return await getUserInfo();
  } catch (error) {
    console.error('사용자 정보 요청 중 오류 발생:', error);
    throw error;
  }
};

// 카카오 로그아웃
export const logoutFromKakao = async (): Promise<boolean> => {
  try {
    if (!window.Kakao?.Auth?.getAccessToken()) {
      throw new Error('로그인 상태가 아닙니다.');
    }
    
    // Promise 형태로 로그아웃
    return new Promise((resolve) => {
      window.Kakao.Auth.logout(() => {
        resolve(true);
      });
    });
  } catch (error) {
    console.error('로그아웃 중 오류 발생:', error);
    throw error;
  }
};

// 현재 로그인 상태 확인
export const getKakaoLoginStatus = (): boolean => {
  return !!window.Kakao?.Auth?.getAccessToken();
};

// 현재 로그인한 사용자 정보 가져오기
export const getCurrentUser = async (): Promise<KakaoUser> => {
  try {
    if (!getKakaoLoginStatus()) {
      throw new Error('로그인 상태가 아닙니다.');
    }
    
    return await getUserInfo();
  } catch (error) {
    console.error('사용자 정보 요청 중 오류 발생:', error);
    throw error;
  }
}; 