import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

const Complete: React.FC = () => {
  const navigate = useNavigate();
  const { id: fundingId } = useParams<{ id: string }>();

  // 펀딩 ID가 없으면 홈으로 리다이렉트
  useEffect(() => {
    if (!fundingId) {
      navigate('/');
    }
  }, [fundingId, navigate]);

  // 컴포넌트 마운트 시 스크롤을 맨 위로 이동
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center max-w-lg mx-auto min-h-[80vh]">
      {/* 성공 아이콘 */}
      <div className="w-24 h-24 rounded-full bg-primary-color/10 flex items-center justify-center mb-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-primary-color"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      {/* 타이틀 및 메시지 */}
      <h2 className="text-2xl font-bold mb-6">펀딩이 성공적으로 생성되었습니다!</h2>
      <p className="text-gray-600 mb-1">
        펀딩이 정상적으로 등록되었습니다.
      </p>
      <p className="text-gray-600 mb-8">
        이제 친구들과 공유하고 선물을 모아보세요.
      </p>

      {/* 버튼 */}
      <div className="flex flex-col w-full gap-3 sm:flex-row">
        <Link
          to={`/funding/${fundingId}`}
          className="flex-1 px-6 py-3 bg-primary-color text-white rounded-md text-center hover:bg-primary-color/90"
        >
          펀딩 페이지로 이동
        </Link>
        <Link
          to="/"
          className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-md text-center hover:bg-gray-300"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
};

export default Complete;
