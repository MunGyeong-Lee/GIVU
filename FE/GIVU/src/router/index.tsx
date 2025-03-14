// 라우터 설정 파일을 생성

import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/layout/Layout';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      // {
      //   path: '/',
      //   element: <HomePage />
      // },
      // {
      //   path: '/volunteer',
      //   element: <VolunteerPage />
      // },
      // {
      //   path: '/community',
      //   element: <CommunityPage />
      // },
      // {
      //   path: '/mypage',
      //   element: <MyPage />
      // },
      // {
      //   path: '/login',
      //   element: <LoginPage />
      // },
      // {
      //   path: '/signup',
      //   element: <SignupPage />
      // }
    ],
  },
]);

export default router; 