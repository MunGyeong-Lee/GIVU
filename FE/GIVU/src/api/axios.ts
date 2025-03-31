import axios from 'axios';

// 기본 axios 인스턴스 생성
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 설정
instance.interceptors.request.use(
  (config) => {
    // 요청 전에 수행할 작업
    // 예: 토큰 추가
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 설정
instance.interceptors.response.use(
  (response) => {
    // 응답 데이터 가공
    return response;
  },
  (error) => {
    // 에러 처리
    if (error.response) {
      // 서버가 응답을 반환한 경우
      const { status } = error.response;
      
      if (status === 401) {
        // 인증 에러 처리
        localStorage.removeItem('token');
        // 로그인 페이지로 리다이렉트 등의 처리
      }
      
      if (status === 403) {
        // 권한 에러 처리
      }
    } else if (error.request) {
      // 요청이 전송되었으나 응답을 받지 못한 경우
      console.error('서버에 연결할 수 없습니다.');
    } else {
      // 요청 설정 중 에러가 발생한 경우
      console.error('요청 설정 중 에러가 발생했습니다:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default instance; 