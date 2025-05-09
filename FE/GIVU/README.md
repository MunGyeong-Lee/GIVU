# Web Front-End
[기술스택]
- React + vite
- TypeScript
- Tailwind CSS
- Redux Toolkit
- react-router-dom
- react query
- axios
- node.js


# 폴더 구조
src/
├── assets/          # 이미지, 폰트 등 정적 파일
├── components/      # 재사용 가능한 컴포넌트
│   ├── common/     # 공통 컴포넌트 (버튼, 인풋 등)
│   └── layout/     # 레이아웃 관련 컴포넌트
├── hooks/          # 커스텀 훅
├── pages/          # 페이지 컴포넌트
├── api/            # API 통신 관련 로직
├── store/          # 상태 관리 (Redux, Zustand 등)
├── styles/         # 전역 스타일, 테마 설정
├── types/          # TypeScript 타입 정의
├── utils/          # 유틸리티 함수
└── constants/      # 상수 값 정의

# GIVU 서비스 설명
- GIVU는 생일, 결혼, 취직 등의 이벤트가 있을 때 친구들에게 펀딩을 받아 원하는 상품을 구매할 수 있는 크라우드펀딩 서비스입니다. 