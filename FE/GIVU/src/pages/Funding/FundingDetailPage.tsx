import React from "react";
import { useParams } from "react-router-dom";

const FundingDetailPage = () => {
  const { id } = useParams();

  return (
    <div className="max-w-7xl mx-auto px-5 py-5">
      <h1 className="text-2xl font-bold mb-4">펀딩 상세 페이지</h1>
      <p className="mb-4">펀딩 ID: {id}</p>
      {/* 펀딩 상세 정보 컴포넌트 추가 예정 */}
    </div>
  );
};

export default FundingDetailPage;