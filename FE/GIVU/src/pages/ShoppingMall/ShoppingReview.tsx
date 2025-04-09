import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

// 상품 정보 인터페이스 추가
interface Product {
  id: number;
  productName: string;
  price: number;
  image: string | null;
  category: string;
  permission?: boolean; // 리뷰 작성 권한 추가
}

const ShoppingReview = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // 상품 정보 상태 추가
  const [product, setProduct] = useState<Product | null>(null);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [star, setStar] = useState(5);
  const [loading, setLoading] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 상품 정보 로드
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoadingProduct(true);
        const token = localStorage.getItem('auth_token');
        if (!token) {
          setError('로그인이 필요합니다.');
          setTimeout(() => {
            navigate(`/shopping/product/${id}`);
          }, 2000);
          return;
        }
        
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/products/${id}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json;charset=UTF-8'
            },
            withCredentials: true
          }
        );
        
        console.log('리뷰 페이지 API 응답 전체 (JSON):', JSON.stringify(response.data, null, 2));
        
        const productData = response.data.product;
        
        // permission 값을 직접 확인
        const rawPermission = response.data.permission;
        console.log('리뷰 페이지 permission 값의 타입:', typeof rawPermission);
        console.log('리뷰 페이지 permission 값 직접 참조:', rawPermission);
        console.log('리뷰 페이지 permission 값 문자열 비교:', rawPermission === "true");
        console.log('리뷰 페이지 permission 값 boolean 비교:', rawPermission === true);
        
        // 확실하게 boolean으로 변환 (문자열 "true"도 true로 처리)
        const permission = rawPermission === true || String(rawPermission) === "true";
        console.log('리뷰 페이지 변환된 permission 값:', permission);
        
        // 상품 데이터에 permission 설정
        const updatedProductData = {
          ...productData,
          permission: permission
        };
        
        console.log('리뷰 페이지 수정된 상품 데이터:', updatedProductData);
        setProduct(updatedProductData);
        
        // 리뷰 작성 권한 확인
        if (!permission) {
          setError('이 상품에 대한 리뷰 작성 권한이 없습니다. 상품 구매 후 리뷰를 작성할 수 있습니다.');
          setTimeout(() => {
            navigate(`/shopping/product/${id}`);
          }, 2000);
          return;
        }
      } catch (error) {
        console.error('상품 정보를 불러오는 중 오류가 발생했습니다:', error);
        setError('상품 정보를 불러오는데 실패했습니다.');
        setTimeout(() => {
          navigate(`/shopping/product/${id}`);
        }, 2000);
      } finally {
        setLoadingProduct(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, navigate]);

  // 이미지 선택 핸들러
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 리뷰 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !body.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    try {
      setLoading(true);
      
      // API 명세에 맞게 FormData 생성
      const formData = new FormData();
      
      // JSON 데이터 추가
      const reviewData = {
        title,
        body,
        star
      };
      
      formData.append('data', new Blob([JSON.stringify(reviewData)], { type: 'application/json' }));
      
      // 이미지 파일 추가
      if (image) {
        formData.append('image', image);
      }

      // 리뷰 데이터 전송
      const token = localStorage.getItem('auth_token');
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/products-review/${id}`, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': token ? `Bearer ${token}` : ''
          }
        }
      );

      // 상품의 평균 별점 업데이트
      try {
        // 상품 정보 다시 가져오기
        const productResponse = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/products/${id}`,
          {
            headers: {
              'Authorization': token ? `Bearer ${token}` : '',
              'Accept': 'application/json;charset=UTF-8'
            },
            withCredentials: true
          }
        );
        
        const updatedProductData = productResponse.data.product;
        // 업데이트할 별점을 확인
        console.log('별점 업데이트에 사용될 값:', star);
        
        // 상품의 평균 별점 업데이트 API 호출
        await axios.patch(
          `${import.meta.env.VITE_API_BASE_URL}/products/${id}/star`,
          { star: star }, // 새로 등록한 리뷰의 별점으로 업데이트
          {
            headers: {
              'Authorization': token ? `Bearer ${token}` : '',
              'Content-Type': 'application/json'
            }
          }
        );

        // 메인 페이지의 상품 목록도 업데이트
        const mainResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/products/list`);
        const updatedProducts = mainResponse.data.map((p: any) => 
          p.id === updatedProductData.id ? updatedProductData : p
        );
        
        // 전역 상태 업데이트를 위한 이벤트 발생
        window.dispatchEvent(new CustomEvent('productsUpdated', { 
          detail: { products: updatedProducts } 
        }));
      } catch (error) {
        console.error('상품 별점 업데이트 중 오류가 발생했습니다:', error);
      }

      alert('리뷰가 성공적으로 등록되었습니다.');
      navigate(`/shopping/product/${id}`);
    } catch (error) {
      console.error('리뷰 등록 중 오류가 발생했습니다:', error);
      alert('리뷰 등록에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  if (loadingProduct) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
        <button
          onClick={() => navigate(`/shopping/product/${id}`)}
          className="mt-4 px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600"
        >
          상품 페이지로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">상품 리뷰 작성</h1>
      
      {/* 상품 정보 표시 */}
      {product && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="flex items-center gap-4">
            {/* 상품 이미지 */}
            <div className="w-24 h-24 flex-shrink-0">
              <img
                src={product.image || 'https://via.placeholder.com/100x100?text=No+Image'}
                alt={product.productName}
                className="w-full h-full object-cover rounded-md"
              />
            </div>
            {/* 상품 정보 */}
            <div>
              <div className="text-sm text-gray-500">{product.category}</div>
              <div className="font-medium">{product.productName}</div>
              <div className="text-rose-500">{product.price.toLocaleString()}원</div>
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            * 리뷰 이미지는 자동으로 상품 이미지가 사용됩니다.
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 별점 선택 */}
        <div>
          <label className="block text-sm font-medium mb-2">별점</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <div
                key={value}
                onClick={() => setStar(value)}
                className="cursor-pointer"
              >
                <svg 
                  className={`w-8 h-8 ${value <= star ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            ))}
          </div>
        </div>

        {/* 제목 입력 */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-2">제목</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="리뷰 제목을 입력해주세요"
            required
          />
        </div>

        {/* 내용 입력 */}
        <div>
          <label htmlFor="body" className="block text-sm font-medium mb-2">내용</label>
          <textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md h-32"
            placeholder="리뷰 내용을 입력해주세요"
            required
          />
        </div>

        {/* 이미지 업로드 */}
        <div>
          <label className="block text-sm font-medium mb-2">이미지 첨부</label>
          <div className="flex items-center gap-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
            >
              이미지 선택
            </label>
            {previewUrl && (
              <div className="relative w-32 h-32">
                <img
                  src={previewUrl}
                  alt="리뷰 이미지 미리보기"
                  className="w-full h-full object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImage(null);
                    setPreviewUrl(null);
                  }}
                  className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 버튼 그룹 */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 disabled:bg-gray-400"
          >
            {loading ? '등록 중...' : '리뷰 등록'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ShoppingReview;
