import React from "react";
import styled from "styled-components";

const FundingListPage = () => {
  return (
    <Container>
      <h1>펀딩 목록</h1>
      <p>현재 진행 중인 펀딩 목록입니다.</p>
      {/* 펀딩 목록 컴포넌트 추가 예정 */}
    </Container>
  );
};

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

export default FundingListPage;