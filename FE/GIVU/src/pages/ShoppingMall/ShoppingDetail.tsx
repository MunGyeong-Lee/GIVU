import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

// 옵션 관련 인터페이스 추가
interface ProductOption {
  name: string;
  choices: string[];
}

// Product 인터페이스 수정
interface Product {
  id: number;
  productName: string;
  category: string;
  price: number;
  image: string | null;
  favorite: number;
  star: number;
  createdAt: string;
  description: string;
  options?: ProductOption[];  // 옵션 추가 (선택적)
}

// Review 인터페이스 수정
interface ReviewUser {
  userId: number;
  nickName: string;
  image: string;
}

interface Review {
  reviewId: number;
  title: string;
  body: string;
  image: string;
  star: number;
  user: ReviewUser;
  isAuthor?: boolean; // 본인 작성 리뷰 여부
}

// 임시 데이터 - 나중에 API로 대체
// const PRODUCT_DETAILS = {
//   id: 6,
//   name: "애플 에어팟 맥스",
//   price: 769000,
//   category: "가전/디지털",
//   imageUrl: "https://via.placeholder.com/800x600?text=에어팟+맥스",
//   discount: 5,
//   description: `
//     고품질 사운드와 액티브 노이즈 캔슬링을 갖춘 프리미엄 헤드폰입니다.
    
//     주요 특징:
//     - 액티브 노이즈 캔슬링 기능
//     - 투명성 모드로 주변 소리 확인 가능
//     - 공간 음향으로 몰입감 있는 사운드
//     - 최대 20시간 배터리 사용 가능
//     - 고급스러운 메쉬 캐노피와 편안한 착용감
    
//     패키지 구성: 헤드폰, 스마트 케이스, Lightning to USB-C 케이블
//   `,
//   detailImages: [
//     "https://via.placeholder.com/800x600?text=상세이미지1",
//     "https://via.placeholder.com/800x600?text=상세이미지2",
//     "https://via.placeholder.com/800x600?text=상세이미지3"
//   ],
//   options: [
//     {
//       name: "색상",
//       choices: ["스페이스 그레이", "실버", "스카이 블루", "핑크", "그린"]
//     }
//   ],
//   stock: 50,
//   deliveryInfo: {
//     fee: 3000,
//     freeFeeOver: 50000,
//     estimatedDays: "1~3일 이내"
//   },
//   reviews: [
//     {
//       id: 1,
//       author: "구매자1",
//       rating: 5,
//       content: "정말 좋은 품질입니다. 추천합니다!",
//       date: "2025.02.15"
//     },
//     {
//       id: 2,
//       author: "구매자2",
//       rating: 4,
//       content: "노이즈 캔슬링이 좋아요. 음질도 훌륭합니다.",
//       date: "2025.02.10"
//     }
//   ],
//   relatedProducts: [5, 9, 10, 14]
// };

const ShoppingProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  // 기존 상태들
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  // const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState<number>(0);

  // 좋아요 상태 관련 상태
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  // 페이지 로드 시 스크롤을 맨 위로 이동
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // API에서 상품 상세 정보 가져오기
  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/products/${id}`);
        setProduct(response.data.product);
        
        // 현재 사용자 ID 가져오기
        const token = localStorage.getItem('auth_token');
        let currentUserId: number | null = null;
        if (token) {
          try {
            const userResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/users/me`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            currentUserId = userResponse.data.id; // userId를 id로 수정
          } catch (error) {
            console.error('사용자 정보를 가져오는 중 오류가 발생했습니다:', error);
          }
        }

        // 리뷰 목록에 isAuthor 필드 추가
        const reviewsWithAuthor = response.data.reviews.map((review: Review) => ({
          ...review,
          isAuthor: currentUserId === review.user.userId
        }));
        
        console.log('Current User ID:', currentUserId); // 디버깅용 로그
        console.log('Reviews with Author:', reviewsWithAuthor); // 디버깅용 로그
        
        setReviews(reviewsWithAuthor);

        // 평균 별점 계산 (리뷰가 있는 경우에만)
        if (reviewsWithAuthor.length > 0) {
          const avgRating = reviewsWithAuthor.reduce((acc: number, review: Review) => acc + review.star, 0) / reviewsWithAuthor.length;
          setAverageRating(avgRating);
        }
      } catch (err) {
        console.error('상품 상세 정보를 불러오는 중 오류가 발생했습니다:', err);
        setError('상품 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductDetail();
    }
  }, [id]);

  // 로그인 상태 확인
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    setIsLoggedIn(!!token);
  }, []);

  // 좋아요 상태 확인
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) return;

        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/products/${id}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        setIsFavorite(response.data.product.favorite > 0);
      } catch (error) {
        console.error('좋아요 상태 확인 중 오류:', error);
      }
    };

    if (isLoggedIn) {
      checkFavoriteStatus();
    }
  }, [id, isLoggedIn]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error || '상품을 찾을 수 없습니다.'}</p>
      </div>
    );
  }

  // 총 금액 계산
  // const totalPrice = product.price * quantity;

  // 옵션 선택 핸들러
  const handleOptionChange = (optionName: string, value: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionName]: value
    }));
  };

  // 구매 버튼 클릭 핸들러
  const handlePurchase = () => {
    // options가 있을 경우에만 체크
    const isAllOptionsSelected = product?.options
      ? product.options.every(option => selectedOptions[option.name])
      : true;

    if (!isAllOptionsSelected) {
      alert('모든 옵션을 선택해주세요.');
      return;
    }

    // 주문 페이지로 이동하면서 상품 정보, 수량, 선택한 옵션 전달
    navigate('/shopping/order', {
      state: {
        product,
        quantity,
        options: selectedOptions
      }
    });
  };

  // 리뷰 삭제 핸들러 추가
  const handleDeleteReview = async (reviewId: number) => {
    if (!window.confirm('리뷰를 삭제하시겠습니까?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        alert('로그인이 필요합니다.');
        return;
      }
      
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/products-review/${reviewId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      alert('리뷰가 삭제되었습니다.');
      
      // 리뷰 목록에서 삭제된 리뷰 제거
      const updatedReviews = reviews.filter(review => review.reviewId !== reviewId);
      setReviews(updatedReviews);
      
      // 평균 별점 다시 계산
      let newAverageRating = 0;
      if (updatedReviews.length > 0) {
        newAverageRating = updatedReviews.reduce((acc, review) => acc + review.star, 0) / updatedReviews.length;
      }
      setAverageRating(newAverageRating);

      // 상품의 평균 별점 업데이트
      try {
        // 상품 정보 다시 가져오기
        const productResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/products/${id}`);
        const updatedProduct = productResponse.data.product;
        
        // 상품의 평균 별점 업데이트 API 호출
        await axios.patch(
          `${import.meta.env.VITE_API_BASE_URL}/products/${id}/star`,
          { star: newAverageRating },
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        // 메인 페이지의 상품 목록도 업데이트
        const mainResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/products/list`);
        const updatedProducts = mainResponse.data.map((p: any) => 
          p.id === updatedProduct.id ? updatedProduct : p
        );
        
        // 전역 상태 업데이트를 위한 이벤트 발생
        window.dispatchEvent(new CustomEvent('productsUpdated', { 
          detail: { products: updatedProducts } 
        }));
      } catch (error) {
        console.error('상품 별점 업데이트 중 오류가 발생했습니다:', error);
      }
    } catch (error) {
      console.error('리뷰 삭제 중 오류가 발생했습니다:', error);
      alert('리뷰 삭제에 실패했습니다. 다시 시도해주세요.');
    }
  };

  // 리뷰 수정 핸들러 추가
  const handleEditReview = async (reviewId: number) => {
    navigate(`/shopping/product/${id}/review/${reviewId}`);
  };

  // 좋아요 토글 함수
  const handleFavoriteClick = async () => {
    if (!isLoggedIn) {
      alert('로그인이 필요한 서비스입니다.');
      return;
    }

    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/products/${id}/like`,
        null,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setIsFavorite(!isFavorite);
      
      // 메인 페이지의 상품 목록도 업데이트
      const mainResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/products/list`);
      const updatedProducts = mainResponse.data;
      
      // 전역 상태 업데이트를 위한 이벤트 발생
      window.dispatchEvent(new CustomEvent('productsUpdated', { 
        detail: { products: updatedProducts } 
      }));
    } catch (error) {
      console.error('좋아요 처리 중 오류:', error);
      alert('좋아요 처리 중 오류가 발생했습니다.');
    }
  };

  // JSX에 추가할 리뷰 섹션
  const ReviewSection = () => (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold">상품 리뷰</h3>
        <div className="flex items-center gap-2">
          <div className="flex text-yellow-400">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`w-5 h-5 ${averageRating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-lg font-bold">{averageRating.toFixed(1)}</span>
          <span className="text-gray-500">({reviews.length}개 리뷰)</span>
        </div>
      </div>

      {/* 리뷰 목록 */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.reviewId} className="border rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-3">
                {/* 사용자 프로필 이미지 */}
                <img
                  src={review.user.image}
                  alt={review.user.nickName}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div className="flex text-yellow-400 mb-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`w-4 h-4 ${review.star >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="font-medium">{review.user.nickName}</span>
                </div>
              </div>
              
              {/* 본인 리뷰일 경우 수정/삭제 버튼 표시 */}
              {review.isAuthor && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditReview(review.reviewId)}
                    className="text-blue-500 hover:text-blue-700 px-2 py-1 rounded hover:bg-blue-50"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDeleteReview(review.reviewId)}
                    className="text-red-500 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50"
                  >
                    삭제
                  </button>
                </div>
              )}
            </div>
            {/* 리뷰 제목 */}
            <h4 className="font-medium mb-2">{review.title}</h4>
            {/* 리뷰 내용 */}
            <p className="text-gray-700 mb-3">{review.body}</p>
            {/* 리뷰 이미지 */}
            {review.image && (
              <img
                src={review.image}
                alt="리뷰 이미지"
                className="w-full max-w-md rounded-lg"
              />
            )}
          </div>
        ))}
      </div>

      {/* 리뷰 작성 버튼 - 경로 수정 */}
      <div className="text-center mt-6">
        <Link
          to={`/shopping/product/${id}/review`}
          className="inline-block px-6 py-3 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors"
        >
          리뷰 작성하기
        </Link>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* 상품 기본 정보 영역 */}
      <div className="flex flex-col md:flex-row gap-8 mb-12">
        {/* 상품 이미지 영역 */}
        <div className="w-full md:w-1/2 relative">
          <div className="relative">
            <img
              src={product.image || 'https://via.placeholder.com/400x400?text=No+Image'}
              alt={product.productName}
              className="w-full h-auto rounded-lg"
            />
            <button
              onClick={handleFavoriteClick}
              className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
            >
              {isFavorite ? (
                <svg className="w-6 h-6 text-rose-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* 상품 정보 및 구매 옵션 */}
        <div className="w-full md:w-1/2">
          <div className="mb-4">
            <span className="text-sm text-gray-500">{product.category}</span>
            <h1 className="text-2xl font-bold mb-2">{product.productName}</h1>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-black font-bold text-2xl">
                {product.price.toLocaleString()}원
              </span>
            </div>
          </div>

          {/* 옵션 선택 */}
          {product.options && product.options.length > 0 && (
            <div className="mb-6">
              {product.options.map((option: ProductOption, idx: number) => (
                <div key={idx} className="mb-4">
                  <label className="block text-sm font-medium mb-2">{option.name}</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={selectedOptions[option.name] || ''}
                    onChange={(e) => handleOptionChange(option.name, e.target.value)}
                  >
                    <option value="">선택해주세요</option>
                    {option.choices.map((choice: string, choiceIdx: number) => (
                      <option key={choiceIdx} value={choice}>{choice}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}

          {/* 수량 선택 */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">수량</label>
            <div className="flex border border-gray-300 rounded-md w-32">
              <button
                className="px-3 py-1 border-r border-gray-300 hover:bg-gray-100"
                onClick={() => quantity > 1 && setQuantity(quantity - 1)}
              >
                -
              </button>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full text-center"
              />
              <button
                className="px-3 py-1 border-l border-gray-300 hover:bg-gray-100"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>
          </div>

          {/* 총 금액 */}
          <div className="p-4 bg-gray-50 rounded-md mb-6">
            <div className="flex justify-between items-center">
              <span className="font-medium">총 상품 금액</span>
              <span className="font-bold text-xl">{(product.price * quantity).toLocaleString()}원</span>
            </div>
          </div>

          {/* 버튼 그룹 */}
          <div className="grid grid-cols-3 gap-2">
            <button className="py-3 border border-black rounded-md hover:bg-gray-100 transition-colors">
              장바구니
            </button>
            <button
              className="py-3 border border-black rounded-md hover:bg-gray-100 transition-colors"
              onClick={handlePurchase}
            >
              상품 구매하기
            </button>
            <Link
              to="/funding/create"
              className="py-3 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors text-center"
            >
              이 상품으로 펀딩 만들기
            </Link>
          </div>
        </div>
      </div>

      {/* 상품 설명 */}
      <div className="mb-12">
        <h3 className="text-lg font-bold mb-4">상품 상세정보</h3>
        <div className="whitespace-pre-line">
          {product.description}
        </div>
      </div>

      {/* 리뷰 섹션 추가 */}
      <ReviewSection />
    </div>
  );
};

export default ShoppingProductDetail;