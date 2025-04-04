# GIVU 메인 페이지 구조

## 개요
GIVU 메인 페이지는 여러 섹션으로 구성되어 있으며, 각 섹션은 별도의 컴포넌트로 구현되어 있습니다.

## 컴포넌트 구조

```
MainPage
│
├── HeroSection - 전체 뷰포트 높이를 차지하는 3D 선물 상자 효과가 있는 메인 히어로 섹션
│
└── max-w-7xl 컨테이너 (중앙 정렬, 좌우 패딩)
    │
    ├── PopularFundingSection - 인기 펀딩 섹션
    │
    ├── CategorySection - 카테고리별 펀딩 섹션
    │
    ├── HowToUseSection - 서비스 이용 방법 안내 섹션
    │
    ├── SuccessStoriesSection - 성공 사례 섹션
    │
    ├── FeaturesSection - 서비스 특징 소개 섹션
    │
    └── AppDownloadSection - 앱 다운로드 유도 섹션
```

## 특이사항

- HeroSection은 화면 전체를 채우는 독립적인 섹션으로, @react-three/fiber와 Three.js를 사용한 3D 효과가 구현되어 있습니다.
- 나머지 모든 섹션은 max-w-7xl 너비 제한과 좌우 패딩이 적용된 컨테이너 내에 위치합니다.
- 각 섹션은 독립적인 컴포넌트로 분리되어 있어 유지보수와 개발이 용이합니다.

## 파일 구조

```
/src/pages/Main/
│
├── MainPage.tsx - 메인 페이지 컴포넌트
│
└── components/
    ├── HeroSection.tsx - 3D 효과가 있는 히어로 섹션
    ├── PopularFundingSection.tsx - 인기 펀딩 섹션
    ├── CategorySection.tsx - 카테고리별 펀딩 섹션
    ├── HowToUseSection.tsx - 이용 방법 섹션
    ├── SuccessStoriesSection.tsx - 성공 사례 섹션
    ├── FeaturesSection.tsx - 특징 소개 섹션
    └── AppDownloadSection.tsx - 앱 다운로드 섹션
```
