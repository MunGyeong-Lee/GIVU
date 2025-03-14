import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../Layout/Header";
import Footer from "../Layout/Footer";
import styled from "styled-components";

const Layout = () => {
  return (
    <LayoutContainer>
      <Header />
      <MainContent>
        <Outlet />
      </MainContent>
      <Footer />
    </LayoutContainer>
  );
};

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
`;

export default Layout;