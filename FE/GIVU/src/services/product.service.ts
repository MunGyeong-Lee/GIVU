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

// 위시리스트 상품 조회 API 함수 (나중에 필요하면 구현)
export const fetchWishlistProducts = async () => {
  try {
    // 위시리스트 API가 있다면 해당 API 호출
    // 현재는 임시로 상품 목록에서 favorite이 true인 항목만 필터링
    const products = await fetchProductsList();
    return products.filter(product => product.favorite);
  } catch (error) {
    console.error('위시리스트 상품을 불러오는 중 오류가 발생했습니다:', error);
    throw error;
  }
}; 