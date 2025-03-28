import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import MainPage from "../pages/Main/MainPage";
import MyPage from "../pages/MyPage/MyPage";
import MainShopping from "../pages/ShoppingMall/MainShopping";
import FundingListPage from "../pages/Funding/FundingListPage";
import FundingDetailPage from "../pages/Funding/FundingDetailPage";
import FundingReviewPage from "../pages/Funding/FundingReviewPage";
import FundingReviewDetailPage from "../pages/Funding/FundingReviewDetailPage";
import FundingReviewWritePage from "../pages/Funding/FundingReviewWritePage";
import ShoppingProductDetail from '../pages/ShoppingMall/ShoppingDetail';
import { authRoutes } from './authRouter';
import FundingCreate from "../pages/Funding/FundingCreate";
import OrderPage from '../pages/ShoppingMall/OrderPage';
import MyFriendPage from '../pages/MyFriend/MyFriendPage';
import ShoppingReview from '../pages/ShoppingMall/ShoppingReview';
// import NotFound from "../pages/NotFound/NotFound";

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
            path: "create",
            element: <FundingCreate />,
          },
        ],
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
        path: "shopping/order",
        element: <OrderPage />,
      },
      {
        path: "mypage",
        element: <MyPage />,
      },
      {
        path: "myfriend",
        element: <MyFriendPage />,
      },
    ],
  },
  ...authRoutes
];

const router = createBrowserRouter(routes);

export default router;