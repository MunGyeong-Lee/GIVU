import { configureStore } from '@reduxjs/toolkit';
import { shoppingReducer } from '../store/slices/shoppingSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    shopping: shoppingReducer,
    auth: authReducer,
  },
});

// 타입스크립트를 위한 타입 정의
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 