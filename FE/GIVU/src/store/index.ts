//기본 store 설정 파일

import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    // 여기에 리듀서들을 추가할 예정입니다
  },
});

// 타입스크립트를 위한 타입 정의
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 