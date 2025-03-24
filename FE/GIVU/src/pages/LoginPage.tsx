import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import KakaoLoginButton from '../components/common/KakaoLoginButton';

const LoginPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">GIVU</h1>
          <p className="text-gray-600 mt-2">
            친구들에게 펀딩을 받아 원하는 선물을 구매하세요
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <KakaoLoginButton text="카카오로 시작하기" />

          <div className="text-center text-sm text-gray-500 mt-4">
            로그인 시{' '}
            <a href="/terms" className="text-blue-500 hover:underline">
              서비스 이용약관
            </a>
            {' '}및{' '}
            <a href="/privacy" className="text-blue-500 hover:underline">
              개인정보 처리방침
            </a>
            에 동의하게 됩니다.
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 