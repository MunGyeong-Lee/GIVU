import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 인증 상태 타입 정의
interface User {
  id: string;
  nickname: string;
  email?: string;
  profileImage?: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// 초기 상태
const initialState: AuthState = {
  token: localStorage.getItem('auth_token'),
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null,
  isAuthenticated: !!localStorage.getItem('auth_token'),
  loading: false,
  error: null,
};

// 슬라이스 생성
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // 로그인 시작
    loginStart(state) {
      state.loading = true;
      state.error = null;
    },
    // 로그인 성공
    loginSuccess(state, action: PayloadAction<{ token: string; user: User }>) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
      
      // 로컬 스토리지에도 저장 (새로고침 대비)
      localStorage.setItem('auth_token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    // 로그인 실패
    loginFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    // 로그아웃
    logout(state) {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      
      // 로컬 스토리지에서 제거
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    },
  },
});

// 액션 생성자 내보내기
export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;

// 리듀서 내보내기
export default authSlice.reducer;
