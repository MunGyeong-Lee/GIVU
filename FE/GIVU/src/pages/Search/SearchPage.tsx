import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { searchProducts } from '../../services/product.service';

// 검색 결과 상품 타입 정의
interface Product {
  id: number;
  productName: string;
  price: number;
  image: string;
  category: string;
  description: string;
  star: number;
}

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 검색 결과 가져오기
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // 상품 검색 API 호출
        const productResults = await searchProducts(query);
        
        if (productResults.length === 0) {
          setError('검색 결과가 없습니다.');
          setProducts([]);
          return;
        }
        
        // API 결과를 로컬 Product 타입으로 변환
        const formattedResults = productResults.map(item => ({
          id: Number(item.id),
          productName: item.productName,
          price: item.price,
          image: item.image || '/placeholder.png',
          category: item.category,
          description: item.description || '',
          star: item.star || 0
        }));
        
        setProducts(formattedResults);
      } catch (err: any) {
        console.error('검색 중 오류가 발생했습니다:', err);
        if (err.response?.status === 403) {
          setError('검색 서비스 사용 권한이 없습니다. 로그인 후 다시 시도해주세요.');
        } else {
          setError('검색 결과를 불러오는데 실패했습니다. 다시 시도해주세요.');
        }
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSearchResults();
  }, [query]);

  // 카테고리 이름 표시 (임시)
  const getCategoryName = (category: string) => {
    const categories: Record<string, string> = {
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
    
    return categories[category] || category;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">검색 결과</h1>
      <p className="text-gray-600 mb-6">
        <span className="font-medium">"{query}"</span>에 대한 검색 결과입니다.
      </p>
      
      {/* 로딩 상태 */}
      {loading && (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-color"></div>
        </div>
      )}
      
      {/* 에러 메시지 */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      {/* 검색 결과 없음 */}
      {!loading && !error && products.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">
            검색 결과가 없습니다
          </h3>
          <p className="text-gray-500">
            다른 키워드로 검색해보세요.
          </p>
        </div>
      )}
      
      {/* 상품 검색 결과 */}
      {products.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4">상품 ({products.length})</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {products.map(product => (
              <Link 
                key={product.id} 
                to={`/shopping/product/${product.id}`}
                className="border border-gray-200 rounded-lg overflow-hidden bg-white transition-transform hover:scale-[1.02] hover:shadow-md"
              >
                <div className="h-40 bg-gray-100 relative">
                  <img 
                    src={product.image} 
                    alt={product.productName} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/150';
                    }}
                  />
                  <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                    {getCategoryName(product.category)}
                  </div>
                </div>
                <div className="p-3">
                  <h4 className="font-medium text-sm line-clamp-2">{product.productName}</h4>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-black font-bold text-sm">
                      {product.price.toLocaleString()}원
                    </span>
                    {/* 별점 표시 */}
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="ml-1 text-sm text-gray-600">{product.star.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage; 