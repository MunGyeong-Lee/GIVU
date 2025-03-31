import React from 'react';

const FundingCreate = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">새로운 펀딩 만들기</h1>
      
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
        <p className="text-gray-500 mb-6">
          이 페이지는 현재 개발 중입니다. 곧 펀딩을 생성할 수 있는 기능이 제공될 예정입니다.
        </p>
        
        {/* 임시로 폼 영역만 표시 */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">펀딩 제목</label>
            <input 
              type="text"
              placeholder="펀딩 제목을 입력하세요"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">목표 금액</label>
            <input 
              type="number"
              placeholder="목표 금액을 입력하세요"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">펀딩 소개</label>
            <textarea 
              rows={5}
              placeholder="펀딩에 대한 설명을 입력하세요"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">펀딩 기간</label>
            <div className="flex gap-4">
              <input 
                type="date"
                className="flex-1 p-2 border border-gray-300 rounded-md"
              />
              <span className="flex items-center">~</span>
              <input 
                type="date"
                className="flex-1 p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">대표 이미지</label>
            <div className="border border-dashed border-gray-300 rounded-md p-8 text-center">
              <p className="text-gray-500">이미지를 드래그하거나 클릭하여 업로드</p>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md mr-2">
              취소
            </button>
            <button className="px-6 py-2 bg-pink-500 text-white rounded-md">
              펀딩 생성하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundingCreate; 