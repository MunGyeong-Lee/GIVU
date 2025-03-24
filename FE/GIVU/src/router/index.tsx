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
import { authRoutes } from './authRouter';

const routes = [
  {
    path: "/",
    element: <Layout />,
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
        ],
      },
      {
        path: "shopping",
        element: <MainShopping />,
      },
      {
        path: "mypage",
        element: <MyPage />,
      },
    ],
  },
  ...authRoutes
];

const router = createBrowserRouter(routes);

export default router;