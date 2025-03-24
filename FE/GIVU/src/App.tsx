import { Outlet } from 'react-router-dom'
import { useEffect } from 'react'
import './App.css'

function App() {
  useEffect(() => {
    // 카카오 SDK 로드 확인 및 초기화 함수
    const initializeKakaoSDK = () => {
      // SDK가 로드되었는지 확인
      if (window.Kakao) {
        try {
          const kakaoJsKey = import.meta.env.VITE_KAKAO_API_KEY;
          if (!window.Kakao.isInitialized()) {
            window.Kakao.init(kakaoJsKey);
            console.log('카카오 SDK 초기화 성공');
          }
        } catch (error) {
          console.error('카카오 SDK 초기화 오류:', error);
        }
      } else {
        // 아직 로드되지 않았으면 300ms 후에 다시 시도
        console.log('카카오 SDK 로드 대기 중...');
        setTimeout(initializeKakaoSDK, 300);
      }
    };

    // 초기화 시작
    initializeKakaoSDK();
  }, []);

  return (
    <div className="flex flex-col w-screen min-h-screen">
      {/* 여기에 공통 레이아웃 요소들이 들어갈 수 있습니다 */}
      {/* 예: 네비게이션 바, 헤더, 푸터 등 */}
      <main className="flex-1 w-full">
        <Outlet />
      </main>
    </div>
  )
}

export default App
