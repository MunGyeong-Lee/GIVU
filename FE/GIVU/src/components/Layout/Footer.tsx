import React from "react";
import styled from "styled-components";

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <CompanyInfo>
          <h3>GIVU</h3>
          <p>© 2023 GIVU. 모든 권리 보유.</p>
        </CompanyInfo>
        <FooterLinks>
          <LinkGroup>
            <h4>회사 소개</h4>
            <FooterLink>소개</FooterLink>
            <FooterLink>팀</FooterLink>
            <FooterLink>채용</FooterLink>
          </LinkGroup>
          <LinkGroup>
            <h4>고객 지원</h4>
            <FooterLink>FAQ</FooterLink>
            <FooterLink>문의하기</FooterLink>
            <FooterLink>이용약관</FooterLink>
          </LinkGroup>
          <LinkGroup>
            <h4>소셜 미디어</h4>
            <FooterLink>인스타그램</FooterLink>
            <FooterLink>페이스북</FooterLink>
            <FooterLink>트위터</FooterLink>
          </LinkGroup>
        </FooterLinks>
      </FooterContent>
    </FooterContainer>
  );
};

const FooterContainer = styled.footer`
  background-color: #f8f8f8;
  padding: 40px 0;
  margin-top: 60px;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
`;

const CompanyInfo = styled.div`
  h3 {
    margin-bottom: 10px;
  }
  p {
    color: #666;
  }
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 60px;
`;

const LinkGroup = styled.div`
  h4 {
    margin-bottom: 15px;
  }
`;

const FooterLink = styled.a`
  display: block;
  margin-bottom: 8px;
  color: #666;
  text-decoration: none;
  cursor: pointer;
  
  &:hover {
    color: #333;
  }
`;

export default Footer;