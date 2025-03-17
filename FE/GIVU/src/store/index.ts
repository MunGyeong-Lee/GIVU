//기본 store 설정 파일

import { configureStore } from '@reduxjs/toolkit';
import { shoppingReducer } from '../store/slices/shoppingSlice';
export const store = configureStore({
  reducer: {
    shopping: shoppingReducer,
  },
});

// 타입스크립트를 위한 타입 정의
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 