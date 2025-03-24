import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { initializeKakao, getUserInfoWithCode } from '../api/kakaoAuth';
import { KakaoUser } from '../types/kakao';

const KakaoCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processKakaoLogin = async () => {
      try {
        // 카카오 SDK 초기화
        const isInitialized = await initializeKakao();
        if (!isInitialized) {
          throw new Error('카카오 SDK 초기화에 실패했습니다.');
        }

        // URL에서 인증 코드 추출
        const code = new URL(window.location.href).searchParams.get('code');
        if (!code) {
          throw new Error('인증 코드를 찾을 수 없습니다.');
        }

        console.log('인증 코드 확인:', code);

        // 인증 코드로 사용자 정보 가져오기
        const userData = await getUserInfoWithCode(code);

        // 사용자 정보 로컬 스토리지에 저장 (실제로는 JWT 등의 토큰만 저장하는 것이 좋습니다)
        localStorage.setItem('user', JSON.stringify({
          id: userData.id,
          nickname: userData.properties.nickname,
          profileImage: userData.properties.profile_image,
          email: userData.kakao_account.email,
        }));

        // 홈페이지로 리다이렉트
        navigate('/');
      } catch (err) {
        console.error('카카오 로그인 처리 실패:', err);
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      }
    };

    processKakaoLogin();
  }, [navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
          <div className="text-center mb-4">
            <h2 className="text-xl font-semibold text-red-600">로그인 오류</h2>
            <p className="mt-2 text-gray-600">{error}</p>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="w-full mt-4 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            로그인 페이지로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">카카오 로그인 처리 중...</p>
      </div>
    </div>
  );
};

export default KakaoCallback; 