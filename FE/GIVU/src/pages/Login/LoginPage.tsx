import { useState } from 'react';
import { Link } from 'react-router-dom';
import KakaoLoginButton from '../../components/common/KakaoLoginButton';
import giftImg from '../../assets/images/gift_img.jpg';

const LoginPage = () => {
  // const navigate = useNavigate();
  const [error] = useState<string | null>(null);

  return (
    <div className="h-screen flex overflow-hidden">
      {/* 왼쪽 로그인 섹션 */}
      <div className="w-full md:w-1/2 flex flex-col px-6 md:px-16 lg:px-24 py-6 relative">
        {/* 좌상단 로고 */}
        <div className="absolute top-8 left-8">
          <Link to="/">
            <img src="/GIVU_LOGO.png" alt="GIVU Logo" className="h-12 w-auto" />
          </Link>
        </div>

        <div className="flex-grow flex flex-col justify-center items-center">
          <div className="w-full max-w-md">
            <div className="text-center mb-10 mt-10">
              <p className="text-gray-600 font-pretendard">
                간편하게 로그인하고
              </p>
              <p className="text-gray-800 font-medium text-xl">
                세상에 하나뿐인
              </p>
              <p className="text-gray-800 font-medium text-xl mb-4">
                특별한 프로젝트를 만들어보세요
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                {error}
              </div>
            )}

            <div className="p-6 rounded-lg shadow-sm">
              <KakaoLoginButton text="카카오로 로그인" className="font-pretendard" />
            </div>
          </div>
        </div>
      </div>

      {/* 오른쪽 이미지 섹션 */}
      <div className="hidden md:block md:w-1/2">
        <div className="h-full w-full">
          <img
            src={giftImg}
            alt="선물 이미지"
            className="object-cover w-full h-full"
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 