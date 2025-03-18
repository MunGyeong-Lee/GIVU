import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import MainPage from "../pages/Main/MainPage";
import FundingListPage from "../pages/Funding/FundingListPage";
import FundingDetailPage from "../pages/Funding/FundingDetailPage";
import MyPage from "../pages/MyPage/MyPage";
import MainShopping from "../pages/ShoppingMall/MainShopping";

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
          
        ],
      },
      {
        path: ":id",
        element: <FundingDetailPage />,
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
 
]);

export default router;