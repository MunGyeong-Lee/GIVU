import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(query);

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
          // 검색 결과가 없을 때 에러 메시지를 표시하지 않음
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

  // 검색 처리 함수
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  // 검색창 초기화
  const clearSearch = () => {
    setSearchQuery('');
  };

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
      {/* 헤더 영역 */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        {/* GIVUMALL 로고 */}
        <Link to="/shopping" className="text-2xl font-bold text-pink-500 hover:text-pink-600 transition-colors">
          GIVUMALL
        </Link>
        
        {/* 검색창 */}
        <form onSubmit={handleSearch} className="relative w-full md:w-96 flex">
          <input 
            type="text"
            placeholder="상품명 또는 브랜드 입력"
            className="w-full py-2.5 px-4 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-2">
            {searchQuery ? (
              <button 
                type="button"
                onClick={clearSearch}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                aria-label="검색어 지우기"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            ) : (
              <button 
                type="submit"
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                aria-label="검색"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            )}
          </div>
        </form>
      </div>
      
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