import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import MainPage from "../pages/Main/MainPage";
import FundingListPage from "../pages/Funding/FundingListPage";
import FundingDetailPage from "../pages/Funding/FundingDetailPage";
import MyPage from "../pages/MyPage/MyPage";

const router = createBrowserRouter([
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
            index: true,
            element: <FundingListPage />,
          },
          {
            path: ":id",
            element: <FundingDetailPage />,
          },
        ],
      },
      {
        path: "mypage",
        element: <MyPage />,
      },
      
    ],
  },
 
]);

export default router;