import React from "react";
import styled from "styled-components";

const MyPage = () => {
  return (
    <Container>
      <h1>마이 페이지</h1>
      <p>사용자 정보 및 활동 내역을 확인할 수 있습니다.</p>
      {/* 사용자 정보 컴포넌트 추가 예정 */}
    </Container>
  );
};

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

export default MyPage;