import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import MainPage from "../pages/Main/MainPage";
import MyPage from "../pages/MyPage/MyPage";
import MainShopping from "../pages/ShoppingMall/MainShopping";
import FundingListPage from "../pages/Funding/FundingListPage";
import FundingDetailPage from "../pages/Funding/FundingDetailPage";
import FundingReviewPage from "../pages/Funding/FundingReviewPage";
import FundingReviewDetailPage from "../pages/Funding/FundingReviewDetailPage";
import FundingReviewWritePage from "../pages/Funding/FundingReviewWritePage";
import FundingOrderPage from "../pages/Funding/FundingOrderPage";
import ShoppingProductDetail from '../pages/ShoppingMall/ShoppingDetail';
import { authRoutes } from './authRouter';
import FundingCreateContainer from "../pages/FundingCreate";
import OrderPage from '../pages/ShoppingMall/OrderPage';
import MyFriendPage from '../pages/MyFriend/MyFriendPage';
import ShoppingReview from '../pages/ShoppingMall/ShoppingReview';
import FundingCreateLayout from "../components/Layout/FundingCreateLayout";
import PaymentPage from '../pages/Payment/PaymentPage';
import Complete from "../pages/FundingCreate/Complete";
import ShoppingReviewEdit from '../pages/ShoppingMall/ShoppingReviewEdit';
import SearchPage from "../pages/Search/SearchPage";
import LoginPage from "../pages/Login/LoginPage";
import { store } from "../store";
import MobilePage from '../pages/ShoppingMall/MobilePage';
// import NotFound from "../pages/NotFound/NotFound";

// 인증 상태에 따른 리다이렉트를 처리하는 래퍼 컴포넌트
const AuthRedirect = ({ element }: { element: React.ReactNode }) => {
  const isAuthenticated = store.getState().auth.isAuthenticated;

  if (isAuthenticated) {
    // 이미 로그인한 사용자는 메인 페이지로 리다이렉트
    return <Navigate to="/" replace />;
  }

  return <>{element}</>;
};

// 기존 authRoutes에서 사용하는 것이 아닌 직접 라우팅 설정
const routes = [
  {
    path: "/",
    element: <Layout />,
    // errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <MainPage />,
      },
      {
        path: "funding",
        children: [
          {
            index: true,
            element: <FundingListPage />,
          },
          {
            path: "list",
            element: <FundingListPage />,
          },
          {
            path: "review",
            element: <FundingReviewPage />,
          },
          {
            path: "review/write",
            element: <FundingReviewWritePage />,
          },
          {
            path: "review/:id",
            element: <FundingReviewDetailPage />,
          },
          {
            path: ":id",
            element: <FundingDetailPage />,
          },
          {
            path: "complete/:id",
            element: <Complete />,
          },
          {
            path: "order/:productId",
            element: <FundingOrderPage />,
          },
        ],
      },
      {
        path: "funding/*",
        element: <Navigate to="/funding" replace />,
      },
      {
        path: "shopping",
        element: <MainShopping />,
      },
      {
        path: "shopping/product/:id",
        element: <ShoppingProductDetail />,
      },
      {
        path: "shopping/product/:id/review",
        element: <ShoppingReview />,
      },
      {
        path: "shopping/product/:id/review/:reviewId",
        element: <ShoppingReviewEdit />
      },
      {
        path: "shopping/order/:id",
        element: <OrderPage />,
      },
      {
        path: "shopping/mobile/order/:id",
        element: <MobilePage />,
      },
      {
        path: "mypage",
        element: <MyPage />,
      },
      {
        path: "myfriend",
        element: <MyFriendPage />,
      },
      {
        path: "payment/:id",
        element: <PaymentPage />,
      },
      {
        path: "search",
        element: <SearchPage />,
      },
    ],
  },
  {
    path: "/funding/create",
    element: <FundingCreateLayout />,
    children: [
      {
        index: true,
        element: <FundingCreateContainer />,
      }
    ]
  },
  // 로그인 라우트에 인증 상태 확인 로직 추가
  {
    path: "/login",
    element: <AuthRedirect element={<LoginPage />} />,
  },
  // KakaoCallback 등 다른 인증 관련 라우트는 그대로 유지
  ...authRoutes.filter(route => route.path !== '/login')
];

const router = createBrowserRouter(routes);

export default router;