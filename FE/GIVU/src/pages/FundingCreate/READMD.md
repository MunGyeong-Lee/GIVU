src/
├── pages/
│   ├── Funding/              # 기존 펀딩 목록 조회 관련 페이지
│   └── FundingCreate/        # 펀딩 생성 관련 분리된 페이지
│       ├── index.tsx         # 메인 컨테이너 (단계 관리)
│       ├── Step1Product.tsx  # 상품 선택 단계
│       ├── Step2BasicInfo.tsx # 기본 정보 단계
│       ├── Step3PublicSettings.tsx # 공개 설정 단계
│       ├── Preview.tsx       # 미리보기 컴포넌트
│       └── Complete.tsx      # 생성 완료 화면
│       └── components/       # 펀딩 생성 전용 하위 컴포넌트

# React Query 적용 가이드

## React Query란?
- TanStack Query(이전의 React Query)는 서버 상태 관리 라이브러리로, 데이터 Fetching, 캐싱, 동기화를 쉽게 처리합니다.
- 주요 기능: 캐싱, 자동 리페칭, 쉬운 페이지네이션, 낙관적 업데이트, 에러 핸들링 등

## 프로젝트 현재 상태
- React Query가 이미 설치되어 있으며, main.tsx에 QueryClient 설정이 완료되어 있습니다.
- DevTools을 추가했으나 오류가 발생하여 일시적으로 비활성화했습니다.
- 상품 목록 조회 기능에 React Query를 적용하여 서버 상태 관리를 개선했습니다.

## 구현 내용
1. **API 로직 분리**:
   - `services/product.service.ts` 파일 생성하여 API 로직 분리
   - 타입 정의, 데이터 포맷팅 등의 로직을 한 곳에서 관리
   - 코드 재사용성과 유지보수성 향상

2. **React Query 훅 정의**:
   - `hooks/useProductQueries.ts` 파일 생성
   - 상품 목록, 상품 상세, 위시리스트 등의 쿼리 훅 구현
   - 캐싱 전략 및 옵션 설정 (staleTime, gcTime 등)

3. **컴포넌트 리팩토링**:
   - `Step1Products.tsx`에서 기존 useEffect 기반 데이터 로딩 로직 제거
   - React Query 훅을 사용한 간결한 데이터 조회 구현
   - 상태 관리 로직 단순화 (loading, error 등을 React Query에서 처리)

4. **이미지 업로드 기능 개선**:
   - `Step2BasicInfo.tsx`에서 다중 이미지 업로드 기능 구현
   - 기본 대표 이미지 1개와 추가 이미지 최대 3개까지 업로드 가능
   - 이미지 선택, 미리보기, 삭제 기능 구현
   - 상품 이미지를 기본 대표 이미지로 자동 설정하는 기능 추가

## 문제 해결
- ReactQueryDevtools가 QueryClientProvider와 호환되지 않는 문제 발생
- 임시 해결책: main.tsx에서 ReactQueryDevtools 컴포넌트를 주석 처리
- 향후 버전 호환성 확인 후 다시 활성화 예정

## 적용 단계
1. ✅ 패키지 설치 (`@tanstack/react-query`, `@tanstack/react-query-devtools`)
2. ✅ QueryClient 설정 (main.tsx에 이미 설정됨)
3. ✅ 기존 데이터 페칭 로직을 React Query의 useQuery로 변환
4. ✅ 이미지 업로드 기능 개선 (대표 이미지 1개 + 추가 이미지 3개)
5. ⬜ 데이터 변경 로직을 useMutation으로 변환
6. ⬜ 각 단계별 쿼리 캐싱 및 상태 관리 최적화

## 주요 학습 포인트
- [x] QueryClient 및 QueryClientProvider 설정
- [x] useQuery와 axios를 활용한 데이터 조회
- [ ] useMutation을 활용한 데이터 업데이트
- [x] 쿼리 키 관리 및 캐싱 전략
- [ ] 쿼리 무효화와 리페칭
- [x] React Query를 활용한 상태 관리 간소화

## React Query의 장점
1. **캐싱**: 
   - 서버 데이터를 자동으로 캐싱하여 중복 요청 방지
   - staleTime으로 데이터 신선도 관리 가능

2. **자동 상태 관리**: 
   - 로딩, 에러, 성공 상태를 자동으로 관리
   - UI 상태 처리 코드 간소화

3. **자동 리페칭**: 
   - 컴포넌트 마운트, 윈도우 포커스, 네트워크 재연결 시 데이터 자동 갱신
   - 항상 최신 데이터를 유지하면서도 불필요한 요청 방지

4. **데이터 동기화**: 
   - 여러 컴포넌트에서 동일한 데이터를 사용할 때 자동 동기화
   - 전역 상태 관리의 복잡성 감소

## 코드 비교
### 기존 코드 (useEffect 사용)
```tsx
// 상태 정의
const [products, setProducts] = useState<Product[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

// 데이터 로딩
useEffect(() => {
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/products/list`);
      setProducts(response.data);
    } catch (error) {
      setError('데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };
  
  fetchProducts();
}, []);
```

### React Query 적용 후
```tsx
// 훅 사용 (hooks/useProductQueries.ts에 정의)
const { 
  data: products = [], 
  isLoading, 
  error 
} = useProductsList();

// 데이터, 로딩 상태, 에러 상태를 자동으로 관리
// UI 렌더링
{isLoading ? (
  <LoadingSpinner />
) : error ? (
  <ErrorMessage message="데이터를 불러오는데 실패했습니다." />
) : (
  <ProductList products={products} />
)}
```

## 이미지 업로드 기능 개선
### 기능 요약
- 대표 이미지 1개(필수)와 추가 이미지 최대 3개(선택) 업로드 가능
- 선택한 상품의 이미지가 자동으로 대표 이미지로 설정됨
- 각 이미지는 개별적으로 변경 및 삭제 가능
- 직관적인 UI/UX로 사용자 경험 향상

### 구현 방식
```tsx
// BasicInfo 인터페이스에 additionalImages 추가
interface BasicInfo {
  title: string;
  description: string;
  mainImage?: string;
  additionalImages?: string[]; // 추가 이미지 배열
}

// 추가 이미지 상태 관리
const [additionalImagePreviews, setAdditionalImagePreviews] = useState<string[]>(
  basicInfo.additionalImages || []
);

// 추가 이미지 업로드 핸들러
const handleAdditionalImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
  const file = e.target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      
      // 상태 및 기본 정보 업데이트
      const newAdditionalImages = [...(basicInfo.additionalImages || [])];
      newAdditionalImages[index] = result;
      
      updateBasicInfo({
        ...basicInfo,
        additionalImages: newAdditionalImages
      });
    };
    reader.readAsDataURL(file);
  }
};