import React from "react";
import { Link } from "react-router-dom";

const MainPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-5">
      {/* 히어로 섹션 */}
      <div className="bg-gray-500 h-[300px] flex flex-col justify-center items-center text-white mb-10 text-center">
        <h2 className="text-2xl mb-2">히어로 섹션</h2>
        <p>소크를 내려면 싱품이 되지는 애니메이션?</p>
      </div>

      {/* 인기 펀딩 섹션 */}
      <section className="mb-10">
        <h2 className="text-center mb-5 text-2xl">인기펀딩</h2>
        <div className="flex gap-5 justify-between">
          <div className="bg-gray-500 h-[200px] flex-1"></div>
          <div className="bg-gray-500 h-[200px] flex-1"></div>
          <div className="bg-gray-500 h-[200px] flex-1"></div>
        </div>
      </section>

      {/* 카테고리 섹션 */}
      <div className="flex justify-between gap-2.5 mb-10">
        <button className="bg-gray-500 border-none text-white py-4 flex-1 cursor-pointer">생활</button>
        <button className="bg-gray-500 border-none text-white py-4 flex-1 cursor-pointer">굿즈</button>
        <button className="bg-gray-500 border-none text-white py-4 flex-1 cursor-pointer">홈인</button>
        <button className="bg-gray-500 border-none text-white py-4 flex-1 cursor-pointer">기타</button>
      </div>

      {/* 서비스 이용 방법 */}
      <section className="mb-10">
        <h2 className="text-center mb-5 text-2xl">서비스 이용 방법</h2>
        <div className="flex gap-5 justify-between">
          <div className="bg-gray-500 h-[200px] flex-1 flex flex-col justify-center items-center text-white">
            <p>단계 1</p>
            <p>설명</p>
          </div>
          <div className="bg-gray-500 h-[200px] flex-1 flex flex-col justify-center items-center text-white">
            <p>단계 2</p>
            <p>설명</p>
          </div>
          <div className="bg-gray-500 h-[200px] flex-1 flex flex-col justify-center items-center text-white">
            <p>단계 3</p>
            <p>설명</p>
          </div>
        </div>
      </section>

      {/* 성공 사례 */}
      <section className="mb-10">
        <h2 className="text-center mb-5 text-2xl">성공 사례 (베스트 후기)</h2>
        <div className="bg-gray-500 h-[150px] flex justify-center items-center text-white">
          <p>사례 내용</p>
        </div>
      </section>

      {/* GIVU의 자랑점 */}
      <section className="mb-10">
        <h2 className="text-center mb-5 text-2xl">GIVU의 자랑점</h2>
        <div className="flex gap-5 justify-between">
          <div className="bg-gray-500 h-[200px] flex-1 flex flex-col justify-center items-center text-white">
            <p>특징 1</p>
            <p>설명</p>
          </div>
          <div className="bg-gray-500 h-[200px] flex-1 flex flex-col justify-center items-center text-white">
            <p>특징 2</p>
            <p>설명</p>
          </div>
          <div className="bg-gray-500 h-[200px] flex-1 flex flex-col justify-center items-center text-white">
            <p>특징 3</p>
            <p>설명</p>
          </div>
        </div>
      </section>

      {/* 앱 다운로드 */}
      <section className="mb-10">
        <h2 className="text-center mb-5 text-2xl">앱 다운로드</h2>
        <div className="flex gap-5 justify-center">
          <button className="bg-gray-500 border-none text-white p-[50px] w-[200px] cursor-pointer">플레이스토어</button>
          <button className="bg-gray-500 border-none text-white p-[50px] w-[200px] cursor-pointer">QR코드</button>
        </div>
      </section>
    </div>
  );
};

export default MainPage;