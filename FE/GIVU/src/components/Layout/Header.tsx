import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const isLoggedIn = false; // 로그인 상태 관리 (실제로는 상태 관리 라이브러리나 컨텍스트 사용)

  return (
    <header className="flex justify-between items-center px-5 py-4 border-b border-gray-100">
      <div className="flex items-center">
        <Link to="/" className="text-2xl font-bold text-black no-underline mr-8">GIVU</Link>
        <nav className="flex gap-5">
          <Link to="/" className="no-underline text-gray-700 font-medium">펀딩</Link>
          <Link to="/funding" className="no-underline text-gray-700 font-medium">기뷰몰</Link>
          <Link to="/mypage" className="no-underline text-gray-700 font-medium">내 친구 펀딩후기</Link>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <input 
            type="text" 
            placeholder="펀딩 검색하기" 
            className="py-2 px-4 rounded-full border border-gray-200 outline-none w-[200px]"
          />
        </div>
        <div className="flex gap-3">
          <button className="bg-transparent border-none cursor-pointer text-xl">❤️</button>
          <button className="bg-transparent border-none cursor-pointer text-xl">🔔</button>
        </div>
        {isLoggedIn ? (
          <button className="bg-transparent border-none cursor-pointer font-bold">이문동</button>
        ) : (
          <button 
            onClick={() => navigate("/login")}
            className="bg-transparent border-none cursor-pointer font-bold"
          >
            로그인
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;