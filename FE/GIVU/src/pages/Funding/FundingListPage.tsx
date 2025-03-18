import React from 'react';

function FundingListPage() {
  return (
    <div className="py-6">
      <h1 className="text-2xl font-bold mb-4">펀딩 목록</h1>
      <p>여기에 펀딩 목록이 표시됩니다.</p>

      {/* 더미 데이터 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} className="border rounded-lg p-4 shadow-sm">
            <div className="bg-gray-200 h-40 rounded-md mb-2"></div>
            <h2 className="font-bold">펀딩 프로젝트 {item}</h2>
            <p className="text-gray-600 text-sm">목표금액의 75% 달성</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: "75%" }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FundingListPage;