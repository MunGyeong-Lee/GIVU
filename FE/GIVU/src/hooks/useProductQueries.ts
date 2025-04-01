import { useQuery } from '@tanstack/react-query';
import { 
  fetchProductsList, 
  fetchProductDetail, 
  fetchWishlistProducts,
  ProductListParams 
} from '../services/product.service';

// 상품 목록 조회 쿼리 훅
export const useProductsList = (params: ProductListParams = {}) => {
  return useQuery({
    // 쿼리 키: 고유한 식별자로 사용됩니다.
    // params를 포함하여 파라미터가 변경되면 자동으로 재요청합니다.
    queryKey: ['products', 'list', params],
    
    // 쿼리 함수: 실제 데이터를 가져오는 함수입니다.
    queryFn: () => fetchProductsList(params),
    
    // 추가 옵션:
    staleTime: 5 * 60 * 1000, // 데이터가 만료되는 시간 (5분)
    gcTime: 10 * 60 * 1000, // 가비지 컬렉션 시간 (10분)
  });
};

// 상품 상세 조회 쿼리 훅
export const useProductDetail = (productId: string | undefined) => {
  return useQuery({
    queryKey: ['products', 'detail', productId],
    queryFn: () => productId ? fetchProductDetail(productId) : null,
    // productId가 없으면 쿼리 실행하지 않음
    enabled: !!productId,
  });
};

// 위시리스트 상품 조회 쿼리 훅
export const useWishlistProducts = () => {
  return useQuery({
    queryKey: ['products', 'wishlist'],
    queryFn: fetchWishlistProducts,
  });
}; 