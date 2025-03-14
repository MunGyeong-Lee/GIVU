import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";

const Header = () => {
  const navigate = useNavigate();
  const isLoggedIn = false; // 로그인 상태 관리 (실제로는 상태 관리 라이브러리나 컨텍스트 사용)

  return (
    <HeaderContainer>
      <LogoAndNav>
        <Logo to="/">GIVU</Logo>
        <NavLinks>
          <NavLink to="/">펀딩</NavLink>
          <NavLink to="/funding">기뷰몰</NavLink>
          <NavLink to="/mypage">내 친구 펀딩후기</NavLink>
        </NavLinks>
      </LogoAndNav>
      <SearchAndUser>
        <SearchBar>
          <SearchInput placeholder="펀딩 검색하기" />
        </SearchBar>
        <IconGroup>
          <IconButton>❤️</IconButton>
          <IconButton>🔔</IconButton>
        </IconGroup>
        {isLoggedIn ? (
          <UserButton>이문동</UserButton>
        ) : (
          <LoginButton onClick={() => navigate("/login")}>로그인</LoginButton>
        )}
      </SearchAndUser>
    </HeaderContainer>
  );
};

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
`;

const LogoAndNav = styled.div`
  display: flex;
  align-items: center;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
  color: #000;
  margin-right: 30px;
`;

const NavLinks = styled.nav`
  display: flex;
  gap: 20px;
`;

const NavLink = styled(Link)`
  text-decoration: none;
  color: #333;
  font-weight: 500;
`;

const SearchAndUser = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const SearchBar = styled.div`
  position: relative;
`;

const SearchInput = styled.input`
  padding: 8px 15px;
  border-radius: 20px;
  border: 1px solid #ddd;
  outline: none;
  width: 200px;
`;

const IconGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
`;

const UserButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-weight: bold;
`;

const LoginButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-weight: bold;
`;

export default Header;