import { useState } from 'react';
import { loginWithKakao } from '../../api/kakaoAuth';

interface KakaoLoginButtonProps {
  text?: string;
  className?: string;
}

const KakaoLoginButton = ({
  text = '카카오로 로그인',
  className = '',
}: KakaoLoginButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      // 리다이렉트 방식으로 로그인 시도
      await loginWithKakao();
      // 여기서는 리다이렉트가 발생하므로 이 이후 코드는 실행되지 않음
    } catch (error) {
      console.error('카카오 로그인 실패:', error);
      setIsLoading(false); // 오류 발생 시에만 로딩 상태 해제
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogin}
      disabled={isLoading}
      className={`flex items-center justify-center w-full bg-[#FEE500] text-[#191919] font-medium py-3 px-4 rounded-md hover:bg-[#FEE100] focus:outline-none transition-colors ${className}`}
    >
      {isLoading ? (
        <span className="flex items-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#191919]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          로그인 중...
        </span>
      ) : (
        <>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
            <path d="M12 3C7.0374 3 3 6.09478 3 9.95478C3 12.3095 4.4346 14.3908 6.63708 15.5688C6.4626 16.1365 5.88806 18.0993 5.76414 18.5366C5.6085 19.0902 5.95371 19.0866 6.20834 18.9105C6.40413 18.7747 8.82736 17.1498 9.59923 16.6292C10.384 16.7553 11.1849 16.9098 12 16.9098C16.9626 16.9098 21 13.8148 21 9.95478C21 6.09478 16.9626 3 12 3Z" fill="black" />
          </svg>
          {text}
        </>
      )}
    </button>
  );
};

export default KakaoLoginButton; 