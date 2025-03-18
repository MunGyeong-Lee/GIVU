import React from 'react';

function FundingReviewPage() {
  return (
    <div className="py-6">
      <h1 className="text-2xl font-bold mb-4">펀딩 후기</h1>
      <p>여기에 펀딩 후기가 표시됩니다.</p>

      {/* 더미 데이터 */}
      <div className="space-y-4 mt-6">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="border rounded-lg p-4 shadow-sm">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-gray-300 mr-3"></div>
              <div>
                <h3 className="font-bold">사용자 {item}</h3>
                <p className="text-gray-500 text-sm">2023년 12월 15일</p>
              </div>
            </div>
            <p>펀딩 프로젝트 {item}에 참여한 후기입니다. 정말 좋은 경험이었습니다. 다음에도 참여하고 싶어요!</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FundingReviewPage;