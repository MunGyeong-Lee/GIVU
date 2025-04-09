import axios from 'axios';

// API Base URL
const API_BASE_URL = import.meta.env.VITE_BASE_URL;

// API 카테고리 매핑
const CATEGORY_MAPPING: Record<string, string> = {
  'ELECTRONICS': '전자기기',
  'CLOTHING': '패션/의류',
  'FOOD': '식품/음료',
  'HOMEAPPLIANCES': '가정용품',
  'FURNITURE': '가구/인테리어',
  'BEAUTY': '건강/뷰티',
  'SPORTS': '스포츠/레저',
  'BOOKS': '도서/문구',
  'OTHER': '기타'
};

// 상품 타입 정의
export interface Product {
  id: string;
  productName: string;
  price: number;
  image: string;
  category: string;
  favorite?: boolean;
  star?: number;
  description?: string;
  createdAt?: string;
}

// 상품 목록 조회 파라미터 타입
export interface ProductListParams {
  page?: number;
  size?: number;
  sort?: string;
  category?: string;
  search?: string;
}

// 상품 목록 조회 API 함수
export const fetchProductsList = async (params: ProductListParams = {}) => {
  const { page = 0, size = 30, sort = 'createdAt,desc' } = params;
  
  try {
    const response = await axios.get(
      `${API_BASE_URL}/products/list`,
      {
        params: { page, size, sort }
      }
    );

    // API 응답 데이터 확인
    const productsData = response.data;

    if (!productsData || !Array.isArray(productsData)) {
      throw new Error('올바르지 않은 데이터 형식입니다.');
    }

    // 상품 데이터 변환 (API 응답 형식에 맞게)
    const formattedProducts = productsData.map((product: any) => ({
      id: product.id.toString(),
      productName: product.productName,
      price: product.price,
      image: product.image || '/placeholder.png',
      category: CATEGORY_MAPPING[product.category] || '기타',
      favorite: product.favorite,
      star: product.star,
      description: product.description,
      createdAt: product.createdAt
    }));

    return formattedProducts;
  } catch (error) {
    console.error('상품을 불러오는 중 오류가 발생했습니다:', error);
    throw error;
  }
};

// 상품 검색 API 함수
export const searchProducts = async (query: string) => {
  try {
    // 검색어가 없으면 빈 배열 반환
    if (!query || query.trim() === '') {
      return [];
    }

    // 인증 토큰 가져오기
    const token = localStorage.getItem('auth_token');
    
    // API 요청 헤더 구성
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    
    // 토큰이 있는 경우 헤더에 추가
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // encodeURIComponent를 사용하지 않고 params 객체로 전달
    const response = await axios.get(
      `${API_BASE_URL}/products/search`,
      {
        params: { keyword: query },
        headers,
        withCredentials: true
      }
    );

    // API 응답 데이터 확인
    const productsData = response.data?.data || [];

    if (!Array.isArray(productsData)) {
      return [];
    }

    // 상품 데이터 변환 (API 응답 형식에 맞게)
    const formattedProducts = productsData.map((product: any) => ({
      id: product.id.toString(),
      productName: product.productName,
      price: product.price,
      image: product.image || '/placeholder.png',
      category: CATEGORY_MAPPING[product.category] || '기타',
      favorite: product.favorite,
      star: product.star,
      description: product.description,
      createdAt: product.createdAt
    }));

    return formattedProducts;
  } catch (error) {
    console.error('상품 검색 중 오류가 발생했습니다:', error);
    throw error;
  }
};

// 상품 상세 조회 API 함수
export const fetchProductDetail = async (productId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products/${productId}`);
    const productData = response.data;
    
    return {
      id: productData.id.toString(),
      productName: productData.productName,
      price: productData.price,
      image: productData.image || '/placeholder.png',
      category: CATEGORY_MAPPING[productData.category] || '기타',
      favorite: productData.favorite,
      star: productData.star,
      description: productData.description,
      createdAt: productData.createdAt
    };
  } catch (error) {
    console.error('상품 상세 정보를 불러오는 중 오류가 발생했습니다:', error);
    throw error;
  }
};

// 위시리스트 상품 조회 API 함수
export const fetchWishlistProducts = async () => {
  try {
    console.log('위시리스트 상품 조회 API 호출 시작');
    
    // 로컬 스토리지에서 토큰 가져오기
    const token = localStorage.getItem('auth_token');
    console.log('토큰 존재 여부:', !!token);
    
    if (!token) {
      console.log('로그인되지 않은 상태, 빈 배열 반환');
      return [];
    }
    
    // API 요청 헤더 설정
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    
    // 실제 위시리스트 API 호출
    console.log('실제 API 호출: /products/search/likeProduct');
    const response = await axios.get(
      `${API_BASE_URL}/products/search/likeProduct`,
      {
        headers,
        withCredentials: true
      }
    );
    
    console.log('위시리스트 API 응답:', response.data);
    
    // API 응답 구조 확인 (코드 예시에 맞춤)
    if (response.data && response.data.code === 'SUCCESS' && Array.isArray(response.data.data)) {
      const productsData = response.data.data;
      console.log('위시리스트 상품 데이터 수:', productsData.length);
      
      // 상품 데이터 변환 (API 응답 형식에 맞게)
      const formattedProducts = productsData.map((product: any) => ({
        id: product.id.toString(),
        productName: product.productName,
        price: product.price,
        image: product.image || '/placeholder.png',
        category: CATEGORY_MAPPING[product.category] || '기타',
        favorite: true, // 위시리스트에 있는 상품은 favorite이 true
        star: product.star,
        description: product.description,
        createdAt: product.createdAt
      }));
      
      console.log('위시리스트 변환된 상품 데이터:', formattedProducts);
      return formattedProducts;
    }
    
    // API 응답이 예상 형식이 아닌 경우 빈 배열 반환
    console.log('위시리스트 API 응답이 예상 형식이 아님, 빈 배열 반환');
    return [];
    
  } catch (error) {
    console.error('위시리스트 상품을 불러오는 중 오류가 발생했습니다:', error);
    console.error('오류 세부 정보:', error instanceof Error ? error.message : '알 수 없는 오류');
    
    // 오류 발생 시 빈 배열 반환
    return [];
  }
}; 