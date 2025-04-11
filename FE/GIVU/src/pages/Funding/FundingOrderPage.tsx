import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Product {
  id: number;
  productName: string;
  price: number;
  image: string;
}

interface OrderState {
  product: Product;
  isFundingProduct: boolean;
  totalAmount: number;
  fundingId: number;
}

interface ShippingInfo {
  receiverName: string;
  phoneNumber: string;
  postcode: string;
  address: string;
  addressDetail: string;
}

interface BuyerInfo {
  name: string;
  phone: string;
  email: string;
}

const FundingOrderPage = () => {
  // const { productId } = useParams<{ productId: string }>(); // 사용되지 않는 변수 제거
  const location = useLocation();
  const navigate = useNavigate();
  const [buyerInfo, setBuyerInfo] = useState<BuyerInfo>({
    name: '',
    phone: '',
    email: ''
  });
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    receiverName: '',
    phoneNumber: '',
    postcode: '',
    address: '',
    addressDetail: ''
  });
  const [isSameAsBuyer, setIsSameAsBuyer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [orderState, setOrderState] = useState<OrderState | null>(null);

  useEffect(() => {
    // 상태에서 전달된 데이터 확인
    if (location.state) {
      const { product, isFundingProduct, fundingId } = location.state as OrderState;
      if (product && isFundingProduct && fundingId) {
        setOrderState({ product, isFundingProduct, totalAmount: 0, fundingId });
      } else {
        setErrorMessage('필요한 주문 정보가 부족합니다');
      }
    } else {
      setErrorMessage('상품 정보를 찾을 수 없습니다');
    }
  }, [location.state]);

  // 사용자 정보를 로컬 스토리지에서 불러오기
  useEffect(() => {
    const userInfo = localStorage.getItem('user');
    if (userInfo) {
      try {
        const user = JSON.parse(userInfo);
        const userName = user.nickname || '';
        
        setBuyerInfo(prev => ({
          ...prev,
          name: userName
        }));
        
        setShippingInfo(prev => ({
          ...prev,
          receiverName: userName
        }));
      } catch (e) {
        console.error('사용자 정보 파싱 오류:', e);
      }
    }
  }, []);

  // 배송지 정보가 구매자 정보와 동일한지 설정
  useEffect(() => {
    if (isSameAsBuyer) {
      setShippingInfo(prev => ({
        ...prev,
        receiverName: buyerInfo.name,
        phoneNumber: buyerInfo.phone
      }));
    }
  }, [isSameAsBuyer, buyerInfo]);

  const handleBuyerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBuyerInfo({
      ...buyerInfo,
      [name]: value
    });
  };

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // 전화번호 입력 시 숫자와 하이픈만 허용
    if (name === 'phoneNumber') {
      const formattedValue = value.replace(/[^\d-]/g, '');
      setShippingInfo({
        ...shippingInfo,
        [name]: formattedValue
      });
    } else {
      setShippingInfo({
        ...shippingInfo,
        [name]: value
      });
    }
  };

  // 주소 검색 기능
  const handleSearchAddress = () => {
    // Daum 우편번호 서비스 실행
    new (window as any).daum.Postcode({
      oncomplete: function(data: any) {
        // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분
        let addr = ''; // 주소 변수
        
        // 사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
        if (data.userSelectedType === 'R') { // 도로명 주소
          addr = data.roadAddress;
        } else { // 지번 주소
          addr = data.jibunAddress;
        }
        
        // 주소 정보를 해당 필드에 넣는다.
        setShippingInfo({
          ...shippingInfo,
          postcode: data.zonecode,
          address: addr
        });
        
        // 커서를 상세주소 필드로 이동한다.
        (document.querySelector('input[name="addressDetail"]') as HTMLInputElement)?.focus();
      }
    }).open();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!shippingInfo.address.trim() || !shippingInfo.addressDetail.trim()) {
      setErrorMessage('배송 주소를 입력해주세요');
      return;
    }

    if (!shippingInfo.receiverName.trim()) {
      setErrorMessage('수령인 이름을 입력해주세요');
      return;
    }

    if (!shippingInfo.phoneNumber.trim()) {
      setErrorMessage('수령인 연락처를 입력해주세요');
      return;
    }

    if (!buyerInfo.name.trim()) {
      setErrorMessage('구매자 이름을 입력해주세요');
      return;
    }

    if (!buyerInfo.phone.trim()) {
      setErrorMessage('구매자 연락처를 입력해주세요');
      return;
    }

    if (!buyerInfo.email.trim()) {
      setErrorMessage('구매자 이메일을 입력해주세요');
      return;
    }

    if (!orderState || !orderState.fundingId) {
      setErrorMessage('펀딩 정보를 찾을 수 없습니다');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage('');

      // 토큰 확인
      const token = localStorage.getItem('auth_token') || 
                  localStorage.getItem('access_token') ||
                  localStorage.getItem('token') ||
                  localStorage.getItem('accessToken');
                  
      if (!token) {
        setErrorMessage('로그인이 필요합니다');
        setIsLoading(false);
        return;
      }

      // 전체 주소 생성
      const fullAddress = `(${shippingInfo.postcode}) ${shippingInfo.address} ${shippingInfo.addressDetail}`;

      const baseUrl = import.meta.env.VITE_BASE_URL || import.meta.env.VITE_API_BASE_URL || 'https://j12d107.p.ssafy.io/api';
      
      // 1. 펀딩 배송 상태 업데이트 API 호출
      console.log(`펀딩 상태 업데이트 API 호출 시작: 펀딩 ID ${orderState.fundingId}, 주소: ${fullAddress}`);
      
      const response = await axios.put(
        `${baseUrl}/fundings/${orderState.fundingId}/purchase?address=${encodeURIComponent(fullAddress)}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('펀딩 상태 업데이트 응답:', response.data);
      
      if (response.data.code === 'SUCCESS' || response.data.success === true) {
        // 주문 정보를 로컬 스토리지에 저장
        const orderInfo = {
          address: fullAddress,
          buyerName: buyerInfo.name,
          buyerPhone: buyerInfo.phone,
          buyerEmail: buyerInfo.email,
          receiverName: shippingInfo.receiverName,
          receiverPhone: shippingInfo.phoneNumber,
          productName: orderState.product.productName,
          orderDate: new Date().toISOString(),
          status: 'shipping'
        };
        
        localStorage.setItem(`order_info_${orderState.fundingId}`, JSON.stringify(orderInfo));
        
        // 성공 메시지 표시
        alert('주문이 완료되었습니다. 배송이 시작됩니다.');
        
        // 페이지 이동 전 상태 초기화
        setErrorMessage('');
        setIsLoading(false);
        
        // 페이지 이동 (replace를 true로 설정하여 현재 페이지를 히스토리에서 대체)
        navigate(`/funding/${orderState.fundingId}?purchase_complete=true`, { replace: true });
        return; // 함수 실행 중단
      } else {
        setErrorMessage(`주문 처리 중 오류가 발생했습니다: ${response.data.message || '알 수 없는 오류'}`);
      }
    } catch (error) {
      console.error('주문 처리 중 오류:', error);
      
      if (axios.isAxiosError(error)) {
        console.error('상세 에러 정보:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          headers: error.response?.headers
        });
        
        if (error.response?.status === 400) {
          setErrorMessage('잘못된 요청입니다. 입력 정보를 확인해주세요.');
        } else if (error.response?.status === 403) {
          setErrorMessage('펀딩 주문 권한이 없습니다.');
        } else if (error.response?.status === 404) {
          setErrorMessage('해당 펀딩을 찾을 수 없습니다.');
        } else {
          setErrorMessage(error.response?.data?.message || error.message || '주문 처리 중 오류가 발생했습니다.');
        }
      } else {
        setErrorMessage('주문 처리 중 알 수 없는 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (errorMessage && !orderState) {
    return (
      <div className="max-w-3xl mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{errorMessage}</p>
        </div>
        <button 
          onClick={() => navigate(-1)} 
          className="bg-gray-800 text-white rounded px-4 py-2"
        >
          이전 페이지로 돌아가기
        </button>
      </div>
    );
  }

  if (!orderState || !orderState.product) {
    return (
      <div className="max-w-3xl mx-auto p-4 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">펀딩 상품 주문</h1>
      
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{errorMessage}</p>
        </div>
      )}
      
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">상품 정보</h2>
        <div className="flex items-center">
          <div className="w-20 h-20 rounded overflow-hidden mr-4">
            <img 
              src={orderState.product.image || '/default-finding-image.jpg'} 
              alt={orderState.product.productName}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = '/default-finding-image.jpg';
              }}
            />
          </div>
          <div>
            <h3 className="font-semibold">{orderState.product.productName}</h3>
            <p className="text-gray-500">원래 가격: {orderState.product.price.toLocaleString()}원</p>
            <p className="text-green-600 font-bold">펀딩 100% 달성 특별 혜택: 무료</p>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 border">
        {/* 구매자 정보 */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">구매자 정보</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">이름</label>
              <input
                type="text"
                name="name"
                value={buyerInfo.name}
                onChange={handleBuyerChange}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">연락처</label>
              <input
                type="text"
                name="phone"
                value={buyerInfo.phone}
                onChange={handleBuyerChange}
                placeholder="010-0000-0000"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">이메일</label>
              <input
                type="email"
                name="email"
                value={buyerInfo.email}
                onChange={handleBuyerChange}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        </div>

        {/* 배송 정보 */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">배송 정보</h2>
            <label className="flex items-center text-sm">
              <input 
                type="checkbox" 
                checked={isSameAsBuyer} 
                onChange={(e) => setIsSameAsBuyer(e.target.checked)} 
                className="mr-2 h-4 w-4 text-blue-600"
              />
              구매자 정보와 동일
            </label>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">수령인 이름</label>
              <input
                type="text"
                name="receiverName"
                value={shippingInfo.receiverName}
                onChange={handleShippingChange}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">연락처</label>
              <input
                type="text"
                name="phoneNumber"
                value={shippingInfo.phoneNumber}
                onChange={handleShippingChange}
                placeholder="010-0000-0000"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">배송지 주소</label>
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  name="postcode"
                  value={shippingInfo.postcode}
                  onChange={handleShippingChange}
                  className="w-1/3 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="우편번호"
                  readOnly
                  required
                />
                <button
                  type="button"
                  onClick={handleSearchAddress}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                >
                  주소 검색
                </button>
              </div>
              <input
                type="text"
                name="address"
                value={shippingInfo.address}
                onChange={handleShippingChange}
                className="w-full px-3 py-2 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="기본 주소"
                readOnly
                required
              />
              <input
                type="text"
                name="addressDetail"
                value={shippingInfo.addressDetail}
                onChange={handleShippingChange}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="상세 주소"
                required
              />
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded mb-6">
          <h3 className="font-semibold mb-2">결제 정보</h3>
          <div className="flex justify-between items-center">
            <span>최종 결제 금액:</span>
            <span className="text-xl font-bold text-green-600">0원 (무료)</span>
          </div>
          <p className="text-gray-500 text-sm mt-2">
            펀딩 100% 달성으로 별도 결제 없이 상품이 배송됩니다.
          </p>
        </div>
        
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            취소
          </button>
          <button
            type="submit"
            className={`px-4 py-2 bg-blue-600 text-white rounded ${
              isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
            }`}
            disabled={isLoading}
          >
            {isLoading ? '주문 처리 중...' : '주문 완료하기'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FundingOrderPage;
