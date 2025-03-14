import { Outlet } from 'react-router-dom'
import './App.css'

function App() {
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
