import axios from 'axios';

// 백엔드 API 기본 URL
const API_BASE_URL = import.meta.env.VITE_BASE_URL || 'https://j12d107.p.ssafy.io/api';

// 사용자 정보 타입 정의
export interface UserInfo {
  kakaoId: number;
  nickName: string;
  email: string;
  birth: string | null;
  profileImage: string;
  address: string;
  balance: number;
  gender: string | null;
  ageRange: string | null;
}

// 사용자 정보 조회
export const getUserInfo = async (): Promise<UserInfo> => {
  try {
    // 로컬 스토리지에서 저장된 사용자 정보 확인
    const cachedUserInfo = localStorage.getItem('user_info');
    if (cachedUserInfo) {
      try {
        const parsedInfo = JSON.parse(cachedUserInfo);
        console.log('로컬 스토리지에서 가져온 사용자 정보:', parsedInfo);
        return parsedInfo;
      } catch (error) {
        console.error('캐시된 사용자 정보 파싱 오류:', error);
      }
    }

    const token = localStorage.getItem('auth_token');
    console.log('API 호출 토큰 확인:', token);
    
    if (!token) {
      console.error('토큰이 없습니다. 로그인이 필요합니다.');
      throw new Error('인증 토큰이 없습니다.');
    }

    // API 엔드포인트 확인
    const apiUrl = `${API_BASE_URL}/users/info`;
    console.log('API 요청 URL:', apiUrl);
    
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log('API 응답:', response.data);
    
    // 받은 데이터를 로컬 스토리지에 저장
    localStorage.setItem('user_info', JSON.stringify(response.data));
    
    return response.data;
  } catch (error) {
    console.error('사용자 정보 조회 중 오류 발생:', error);
    if (axios.isAxiosError(error)) {
      console.error('오류 상태 코드:', error.response?.status);
      console.error('오류 응답 데이터:', error.response?.data);
      console.error('API 요청 구성:', error.config);
      
      // 인증 오류인 경우 (401 Unauthorized)
      if (error.response?.status === 401) {
        // 로컬 스토리지에서 토큰과 사용자 정보 삭제
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        localStorage.removeItem('user_info');
        
        // 로그인 페이지로 리다이렉트하는 로직이 필요하면 여기에 추가
        window.location.href = '/login';
      }
    }
    throw error;
  }
}; 