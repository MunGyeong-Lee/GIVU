import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const MainPage = () => {
  return (
    <Container>
      {/* 히어로 섹션 */}
      <HeroSection>
        <h2>히어로 섹션</h2>
        <p>소크를 내려면 싱품이 되지는 애니메이션?</p>
      </HeroSection>

      {/* 인기 펀딩 섹션 */}
      <Section>
        <SectionTitle>인기펀딩</SectionTitle>
        <CardContainer>
          <Card />
          <Card />
          <Card />
        </CardContainer>
      </Section>

      {/* 카테고리 섹션 */}
      <CategorySection>
        <CategoryButton>생활</CategoryButton>
        <CategoryButton>굿즈</CategoryButton>
        <CategoryButton>홈인</CategoryButton>
        <CategoryButton>기타</CategoryButton>
      </CategorySection>

      {/* 서비스 이용 방법 */}
      <Section>
        <SectionTitle>서비스 이용 방법</SectionTitle>
        <CardContainer>
          <StepCard>
            <p>단계 1</p>
            <p>설명</p>
          </StepCard>
          <StepCard>
            <p>단계 2</p>
            <p>설명</p>
          </StepCard>
          <StepCard>
            <p>단계 3</p>
            <p>설명</p>
          </StepCard>
        </CardContainer>
      </Section>

      {/* 성공 사례 */}
      <Section>
        <SectionTitle>성공 사례 (베스트 후기)</SectionTitle>
        <SuccessCase>
          <p>사례 내용</p>
        </SuccessCase>
      </Section>

      {/* GIVU의 자랑점 */}
      <Section>
        <SectionTitle>GIVU의 자랑점</SectionTitle>
        <CardContainer>
          <FeatureCard>
            <p>특징 1</p>
            <p>설명</p>
          </FeatureCard>
          <FeatureCard>
            <p>특징 2</p>
            <p>설명</p>
          </FeatureCard>
          <FeatureCard>
            <p>특징 3</p>
            <p>설명</p>
          </FeatureCard>
        </CardContainer>
      </Section>

      {/* 앱 다운로드 */}
      <DownloadSection>
        <SectionTitle>앱 다운로드</SectionTitle>
        <DownloadContainer>
          <DownloadButton>플레이스토어</DownloadButton>
          <DownloadButton>QR코드</DownloadButton>
        </DownloadContainer>
      </DownloadSection>
    </Container>
  );
};

// 스타일 컴포넌트
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const HeroSection = styled.div`
  background-color: #999;
  height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  margin-bottom: 40px;
  text-align: center;
`;

const Section = styled.section`
  margin-bottom: 40px;
`;

const SectionTitle = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  font-size: 1.5rem;
`;

const CardContainer = styled.div`
  display: flex;
  gap: 20px;
  justify-content: space-between;
`;

const Card = styled.div`
  background-color: #999;
  height: 200px;
  flex: 1;
`;

const CategorySection = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 40px;
`;

const CategoryButton = styled.button`
  background-color: #999;
  border: none;
  color: white;
  padding: 15px 0;
  flex: 1;
  cursor: pointer;
`;

const StepCard = styled.div`
  background-color: #999;
  height: 200px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
`;

const SuccessCase = styled.div`
  background-color: #999;
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
`;

const FeatureCard = styled.div`
  background-color: #999;
  height: 200px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
`;

const DownloadSection = styled.section`
  margin-bottom: 40px;
`;

const DownloadContainer = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
`;

const DownloadButton = styled.button`
  background-color: #999;
  border: none;
  color: white;
  padding: 50px;
  width: 200px;
  cursor: pointer;
`;

export default MainPage;