import React from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";

const FundingDetailPage = () => {
  const { id } = useParams();

  return (
    <Container>
      <h1>펀딩 상세 페이지</h1>
      <p>펀딩 ID: {id}</p>
      {/* 펀딩 상세 정보 컴포넌트 추가 예정 */}
    </Container>
  );
};

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

export default FundingDetailPage;