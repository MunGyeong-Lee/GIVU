import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';

// 결제 비밀번호 모달 컴포넌트
const PaymentPasswordModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (password: string) => Promise<void>;
  amount: number;
  isLoading: boolean;
  isFreeOrder?: boolean;
}> = ({ isOpen, onClose, onSubmit, amount, isLoading, isFreeOrder = false }) => {
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // 비밀번호 변경 핸들러
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 숫자만 입력 가능하고 6자리로 제한
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
    setPassword(value);
  };

  // 제출 핸들러
  const handleSubmit = () => {
    if (password.length !== 6) {
      setError('비밀번호는 6자리 숫자여야 합니다.');
      return;
    }

    setLoading(true);
    setError(null);

    // 비밀번호 검증 및 결제 처리
    onSubmit(password)
      .catch((e: Error) => {
        // 오류 발생 시 로딩 상태 해제
        setLoading(false);

        // 비밀번호 오류 처리
        if (e.message && e.message.includes('비밀번호가 일치하지 않습니다')) {
          setError('비밀번호가 일치하지 않습니다.');
          setPassword(''); // 비밀번호 입력 초기화
        }
      });
  };

  // 모달 초기화
  const resetModal = () => {
    setPassword('');
    setError(null);
    setLoading(false);
  };

  // 모달이 닫힐 때 초기화
  useEffect(() => {
    if (!isOpen) {
      resetModal();
    }
  }, [isOpen]);

  if (!isOpen) return null;
  
  // 버튼 로딩 상태 설정 - isLoading prop 사용하도록 수정
  const buttonLoading = loading || isLoading;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">결제 비밀번호 확인</h2>

        <div className="mb-6">
          <p className="text-gray-600 text-center mb-4">
            {isFreeOrder 
              ? '무료 상품 수령을 완료하려면 비밀번호를 입력해주세요.' 
              : '결제를 완료하기 위해 6자리 비밀번호를 입력해주세요.'}
          </p>

          <p className="text-center font-bold text-lg mb-4">
            결제 금액: <span className={amount === 0 ? "text-cusBlue" : "text-cusRed"}>
              {amount === 0 ? "무료" : `${amount.toLocaleString()}원`}
            </span>
          </p>

          <div className="flex justify-center mb-3">
            <div className="flex gap-2">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="w-10 h-12 border-2 border-gray-300 rounded-md flex items-center justify-center text-xl font-bold"
                >
                  {password[i] ? '•' : ''}
                </div>
              ))}
            </div>
          </div>

          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="6자리 비밀번호 입력"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-xl tracking-widest"
            maxLength={6}
            autoFocus
          />

          {error && (
            <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
          )}
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            취소
          </button>

          <button
            onClick={handleSubmit}
            disabled={password.length !== 6 || buttonLoading}
            className={`px-6 py-2 ${
              password.length === 6 && !buttonLoading
                ? 'bg-cusRed hover:bg-cusRed-light text-white' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            } rounded-md transition-colors`}
          >
            {buttonLoading ? '처리중...' : (isFreeOrder ? '확인' : '결제하기')}
          </button>
        </div>
      </div>
    </div>
  );
};

// 주문 페이지 컴포넌트
const OrderPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const [orderInfo, setOrderInfo] = useState<any>(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState<boolean>(false);
  const [balance, setBalance] = useState<number>(0);  // 기뷰페이 잔액
  const [isLoading, setIsLoading] = useState<boolean>(false);  // 로딩 상태
  const [, setError] = useState<string | null>(null);  // 에러 메시지
  const isMobile = window.innerWidth < 768;  // 모바일 화면 여부 확인

  // 구매 정보 및 상품 정보 (URL 파라미터 또는 location state에서 가져옴)
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        // location.state에 product 정보가 있으면 그대로 사용
        if (location.state?.product) {
          // 펀딩 상품 여부와 펀딩 ID 확인
          const isFundingProduct = location.state.isFundingProduct || false;
          const fundingId = location.state.fundingId || null;
          
          console.log('펀딩 상품 여부:', isFundingProduct);
          console.log('펀딩 ID:', fundingId);
          
          setOrderInfo({
            product: location.state.product,
            quantity: location.state.quantity || 1,
            options: location.state.options || {},
            isFundingProduct,  // 펀딩 상품 여부 추가
            fundingId,         // 펀딩 ID 추가
            totalAmount: location.state.totalAmount // 펀딩 완료된 경우 0원
          });
          return;
        }

        // URL 파라미터로부터 상품 ID를 얻은 경우, API 호출로 상품 정보 가져오기
        if (id) {
          const token = localStorage.getItem('auth_token');
          const response = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/products/${id}`,
            {
              headers: token ? {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json;charset=UTF-8'
              } : undefined
            }
          );

          const productData = response.data.product;
          setOrderInfo({
            product: {
              ...productData,
              price: productData.price,
              imageUrl: productData.image, // 이미지 필드 이름 변환
              name: productData.productName, // 상품명 필드 이름 변환
              deliveryInfo: {
                fee: 3000,
                freeFeeOver: 50000,
                estimatedDays: "1~3일 이내"
              }
            },
            quantity: 1,
            options: {},
          });
          return;
        }

        // 상품 정보가 없는 경우
        alert('상품 정보를 찾을 수 없습니다.');
        navigate('/shopping');
      } catch (error) {
        console.error('상품 정보를 가져오는 중 오류가 발생했습니다:', error);
        alert('상품 정보를 가져오는데 실패했습니다.');
        navigate('/shopping');
      }
    };

    fetchProductData();

    // 페이지 로드 시 스크롤을 맨 위로 이동
    window.scrollTo(0, 0);
  }, [id, location, navigate]);

  // 폼 상태 관리
  const [buyerInfo, setBuyerInfo] = useState({
    name: '',
    phone: '',
    email: '',
  });

  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    phone: '',
    address: '',
    addressDetail: '',
    postcode: '',
    message: '',
    customMessage: ''
  });

  const [isSameAsBuyer, setIsSameAsBuyer] = useState(false);
  //   const [paymentMethod, setPaymentMethod] = useState('givupay');
  //   const [useGivuPay, setUseGivuPay] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // 배송지 정보가 구매자 정보와 동일한지 설정
  useEffect(() => {
    if (isSameAsBuyer) {
      setShippingInfo({
        ...shippingInfo,
        name: buyerInfo.name,
        phone: buyerInfo.phone,
      });
    }
  }, [isSameAsBuyer, buyerInfo]);

  // 입력 핸들러
  const handleBuyerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBuyerInfo({
      ...buyerInfo,
      [name]: value,
    });
  };

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingInfo({
      ...shippingInfo,
      [name]: value,
    });
  };

  // 주문 제출 핸들러
  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreeTerms) {
      alert('구매 동의에 체크해주세요.');
      return;
    }

    // 비밀번호 입력 모달 표시
    setIsPasswordModalOpen(true);
  };

  // 결제 비밀번호 확인 후 주문 처리
  const handlePaymentConfirm = async (password: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // 펀딩 상품인지 확인
      const isFundingProduct = orderInfo.isFundingProduct || false;
      const fundingId = orderInfo.fundingId || null;
      
      // 결제 금액 설정 (펀딩 상품이면 항상 0원)
      let paymentAmount = isFundingProduct ? 0 : (orderInfo.product.price * orderInfo.quantity);
      
      // 로그 출력
      console.log('주문 정보:', {
        isFundingProduct,
        fundingId,
        paymentAmount
      });

      // 1. 2차 비밀번호 확인
      console.log('비밀번호 확인 시작:', password);
      const isPasswordValid = await verifyPassword(password);
      console.log('비밀번호 확인 결과:', isPasswordValid);

      if (!isPasswordValid) {
        setIsLoading(false);
        setIsPasswordModalOpen(true); // 모달은 계속 열려있게 유지
        throw new Error('비밀번호가 일치하지 않습니다. 다시 시도해주세요.');
      }

      // 2. 잔액 다시 확인 (펀딩 상품이 아닌 경우에만)
      if (!isFundingProduct && paymentAmount > 0) {
        await fetchBalance();
        
        if (balance < paymentAmount) {
          throw new Error('잔액이 부족합니다. 충전 후 다시 시도해주세요.');
        }
      }

      // 3. 주문 처리
      let result;
      
      try {
        if (isFundingProduct && fundingId) {
          // 펀딩 상품 구매 API 호출
          result = await purchaseFundingProduct(fundingId);
        } else {
          // 일반 상품 구매 API 호출
          result = await purchaseProduct(orderInfo.product.id);
        }
        
        console.log('주문 응답:', result);
        
        if (result.code === 'SUCCESS') {
          setIsPasswordModalOpen(false);
          alert('결제가 완료되었습니다!');
          
          // 쇼핑몰 메인 페이지로 이동
          navigate('/shopping');
        } else {
          throw new Error(result.message || '결제에 실패했습니다.');
        }
      } catch (apiError: any) {
        // 특정 오류 메시지 확인 및 사용자 친화적인 메시지 표시
        if (apiError.message && apiError.message.includes('이미 참여한 펀딩입니다')) {
          setIsPasswordModalOpen(false);
          alert('이미 상품을 구매하셨습니다. 마이페이지에서 확인하실 수 있습니다.');
          navigate('/mypage');
          return; // 함수 종료
        }
        // 다른 API 오류는 그대로 throw
        throw apiError;
      }

    } catch (error: any) {
      console.error('결제 처리 오류:', error);
      setError(error.message);

      // 비밀번호 오류일 경우 모달은 열린 상태로 유지
      if (error.message.includes('비밀번호가 일치하지 않습니다')) {
        setIsLoading(false);
        // 오류를 다시 throw하여 모달 컴포넌트에서 처리할 수 있게 함
        throw error;
      }

      // 다른 오류의 경우 모달 닫기
      setIsPasswordModalOpen(false);
      
      // 사용자 친화적인 오류 메시지 표시
      if (error.message.includes('이미 참여한 펀딩입니다')) {
        alert('이미 상품을 구매하셨습니다. 마이페이지에서 확인하실 수 있습니다.');
        navigate('/mypage');
      } else {
        alert(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 주소 검색 기능
  const handleSearchAddress = () => {
    // Daum 우편번호 서비스 실행
    new (window as any).daum.Postcode({
      oncomplete: function (data: any) {
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
        window.close();
      }
    }).open();
  };

  // 기뷰페이 잔액 조회
  const fetchBalance = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('로그인이 필요합니다.');
      }

      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/users/info`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      // 전체 응답 구조 확인을 위한 로그
      console.log('사용자 정보 전체 응답:', response);
      console.log('사용자 정보 data:', response.data);

      // 응답 구조에 따라 balance 값을 추출
      if (response.data.data) {
        console.log('사용자 정보 data.data:', response.data.data);

        // 잔액 정보가 있는 위치 확인
        if (response.data.data.hasOwnProperty('balance')) {
          setBalance(response.data.data.balance);
        } else if (response.data.data.user && response.data.data.user.hasOwnProperty('balance')) {
          setBalance(response.data.data.user.balance);
        } else {
          console.log('응답에서 balance 필드를 찾을 수 없습니다.');
          setBalance(0);
        }
      } else if (response.data.hasOwnProperty('balance')) {
        setBalance(response.data.balance);
      } else {
        console.log('응답에서 data 필드를 찾을 수 없습니다.');
        setBalance(0);
      }
    } catch (error) {
      console.error('잔액 조회 실패:', error);
      setError('잔액 조회에 실패했습니다.');
    }
  };

  // 컴포넌트 마운트 시 잔액 조회
  useEffect(() => {
    fetchBalance();
    console.log('잔액 조회 useEffect 실행');
  }, []);

  // 2차 비밀번호 확인
  const verifyPassword = async (password: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('로그인이 필요합니다.');
      }

      console.log('비밀번호 확인 요청 데이터:', { password });

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/checkPassword`,
        { password },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // 응답 구조 상세 로깅
      console.log('비밀번호 확인 응답 전체:', response);
      console.log('비밀번호 확인 응답 데이터:', response.data);

      // 성공 여부 확인 (다양한 응답 구조 처리)
      if (response.data.code === 'SUCCESS' || response.data.isValid === true) {
        return true;
      } else if (response.data.code === 'ERROR' || response.data.isValid === false) {
        console.log('비밀번호가 일치하지 않습니다.');
        return false;
      } else {
        // 응답 구조가 예상과 다른 경우
        console.log('예상치 못한 응답 구조:', response.data);
        return false;
      }
    } catch (error: any) {
      console.error('비밀번호 확인 API 호출 오류:', error);

      // 더 상세한 에러 로깅
      if (error.response) {
        console.log('에러 상태:', error.response.status);
        console.log('에러 데이터:', error.response.data);
      }

      throw new Error('비밀번호 확인 중 오류가 발생했습니다.');
    }
  };

  // 상품 구매 요청
  const purchaseProduct = async (productId: number) => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('로그인이 필요합니다.');
      }

      console.log('상품 구매 요청 시작 - 상품 ID:', productId);

      // 총 결제 금액 계산
      const amount = orderInfo.product.price * (orderInfo.quantity || 1);
      console.log('결제 금액:', amount);

      // Curl 예시와 동일하게 쿼리 파라미터로 amount 전달, 요청 본문은 비움
      const response = await axios({
        method: 'post',
        url: `${import.meta.env.VITE_BASE_URL}/products/purchase/${productId}`,
        params: {
          amount: amount
        },
        data: '',  // 빈 요청 본문
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json;charset=UTF-8'
        }
      });

      console.log('상품 구매 성공 응답:', response.data);
      return response.data;

    } catch (error: any) {
      console.error('상품 구매 최종 실패:', error);

      // 추가 에러 정보 로깅
      if (error.response) {
        console.log('최종 에러 상태:', error.response.status);
        console.log('최종 에러 데이터:', error.response.data);
        const errorMsg = error.response.data.message || '상품 구매에 실패했습니다.';
        console.log('최종 에러 메시지:', errorMsg);
        throw new Error(errorMsg);
      }

      throw new Error('상품 구매에 실패했습니다.');
    }
  };

  // 펀딩 상품 구매 요청 (새로 추가)
  const purchaseFundingProduct = async (fundingId: number) => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('로그인이 필요합니다.');
      }

      console.log('펀딩 상품 구매 요청 시작 - 펀딩 ID:', fundingId);
      
      // 결제 금액 - 0원 처리
      const amount = 0;
      console.log('펀딩 상품 결제 금액:', amount);
      
      // API 기본 URL 확인
      const baseUrl = import.meta.env.VITE_BASE_URL || import.meta.env.VITE_API_BASE_URL;
      if (!baseUrl) {
        throw new Error('API 기본 URL이 설정되지 않았습니다.');
      }
      
      console.log('API 기본 URL:', baseUrl);
      
      // 백엔드 API 맵핑에 맞게 수정
      // transferController에 정의된 엔드포인트 사용
      console.log('펀딩 상품 구매 API 호출:', `${baseUrl}/transfer/${fundingId}`);
      const response = await axios.post(
        `${baseUrl}/transfer/${fundingId}`,
        null, // 요청 본문은 비움
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json;charset=UTF-8'
          },
          params: {
            amount: amount
          }
        }
      );
      
      console.log('펀딩 상품 구매 성공 응답:', response.data);
      return response.data;
      
    } catch (error: any) {
      console.error('펀딩 상품 구매 최종 실패:', error);
      
      // 추가 에러 정보 로깅
      if (axios.isAxiosError(error) && error.response) {
        console.log('최종 에러 상태:', error.response.status);
        console.log('최종 에러 데이터:', error.response.data);
        
        // 에러 메시지 추출 시도 (다양한 API 응답 형식 처리)
        let errorMsg = '펀딩 상품 구매에 실패했습니다.';
        
        if (error.response.data) {
          if (typeof error.response.data === 'string') {
            errorMsg = error.response.data;
          } else if (error.response.data.message) {
            errorMsg = error.response.data.message;
          } else if (error.response.data.error) {
            errorMsg = error.response.data.error;
          }
        }
        
        console.log('최종 에러 메시지:', errorMsg);
        throw new Error(errorMsg);
      }
      
      throw new Error('펀딩 상품 구매에 실패했습니다.');
    }
  };

  if (!orderInfo) {
    return <div className="flex justify-center items-center h-screen">로딩 중...</div>;
  }

  const { product, quantity, options } = orderInfo;

  // 할인가 계산
  const discountedPrice =
    product.discount > 0
      ? Math.floor(product.price * (100 - product.discount) / 100)
      : product.price;

  // 총 상품 금액
  const productTotal = discountedPrice * quantity;

  // 배송비 - 기본값 설정 추가
  // deliveryInfo가 없는 경우를 대비한 기본값 설정
  const deliveryInfo = product.deliveryInfo || { freeFeeOver: 50000, fee: 3000 };
  const shippingFee = productTotal >= deliveryInfo.freeFeeOver ? 0 : deliveryInfo.fee;
  
  // 최종 결제 금액 (펀딩 상품이고 무료인 경우 0원)
  const isFundingProduct = orderInfo.isFundingProduct || false;
  const totalAmount = isFundingProduct ? 0 : (productTotal + shippingFee);

  return (
    <div className={`min-h-screen bg-gray-50 ${isMobile ? 'pt-4' : 'pt-24'}`}>
      <div className="container mx-auto px-4 pb-12">
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          {/* 모바일 화면에서 페이지 제목 추가 */}
          {isMobile && (
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-xl font-bold">주문/결제</h1>
              <button
                onClick={() => navigate(-1)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* 결제 정보 */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4 text-cusBlack">결제 정보</h2>
          <div className="bg-white border border-cusGray p-6 rounded-lg">
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-cusBlack-light">상품 금액</span>
                <span className="font-medium">{productTotal.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cusBlack-light">배송비</span>
                <span className="font-medium">{shippingFee > 0 ? `${shippingFee.toLocaleString()}원` : '무료'}</span>
              </div>
              {orderInfo.isFundingProduct && (
                <div className="flex justify-between text-cusBlue">
                  <span className="font-medium">펀딩 달성 특별 혜택</span>
                  <span className="font-medium">-{(productTotal + shippingFee).toLocaleString()}원</span>
                </div>
              )}
              <div className="flex justify-between pt-4 border-t border-cusGray">
                <span className="text-cusBlack font-bold">총 결제 금액</span>
                <span className="text-cusRed font-bold text-xl">{totalAmount.toLocaleString()}원</span>
              </div>
            </div>
            
            {/* 기뷰페이 사용 여부 */}
            <div className="p-4 bg-cusLightBlue-lighter rounded-lg mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <div className="flex items-center mb-1">
                    <span className="text-yellow-500 text-xl mr-2">👑</span>
                    <h3 className="text-lg font-medium text-cusBlue">기뷰페이 결제</h3>
                  </div>
                  <p className="text-sm text-cusBlack-light">사용 가능한 기뷰페이: <span className="font-bold">{Number(balance).toLocaleString()}원</span></p>
                </div>
                <div className={`font-medium ${
                  orderInfo.isFundingProduct 
                    ? 'text-cusBlue' 
                    : balance >= totalAmount 
                      ? "text-cusBlue" 
                      : "text-cusRed"
                }`}>
                  {orderInfo.isFundingProduct 
                    ? "펀딩 달성으로 무료 결제" 
                    : balance >= totalAmount 
                      ? "기뷰페이로 결제됩니다" 
                      : "잔액이 부족합니다"}
                </div>
              </div>
            </div>

            {/* 구매자 정보 */}
            <div className="mb-8">
              <h2 className="text-lg font-bold mb-4 text-cusBlack">구매자 정보</h2>
              <div className="bg-white border border-cusGray p-6 rounded-lg space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">이름</label>
                  <input
                    type="text"
                    name="name"
                    value={buyerInfo.name}
                    onChange={handleBuyerChange}
                    className="w-full p-2 border border-cusGray rounded-md focus:outline-none focus:ring-2 focus:ring-cusBlue"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">연락처</label>
                  <input
                    type="tel"
                    name="phone"
                    value={buyerInfo.phone}
                    onChange={handleBuyerChange}
                    className="w-full p-2 border border-cusGray rounded-md focus:outline-none focus:ring-2 focus:ring-cusBlue"
                    placeholder="'-' 없이 입력해주세요"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">이메일</label>
                  <input
                    type="email"
                    name="email"
                    value={buyerInfo.email}
                    onChange={handleBuyerChange}
                    className="w-full p-2 border border-cusGray rounded-md focus:outline-none focus:ring-2 focus:ring-cusBlue"
                    required
                  />
                </div>
              </div>
            </div>

            {/* 배송지 정보 */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-cusBlack">배송지 정보</h2>
                <label className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={isSameAsBuyer}
                    onChange={(e) => setIsSameAsBuyer(e.target.checked)}
                    className="mr-2 h-4 w-4 text-cusBlue"
                  />
                  구매자 정보와 동일
                </label>
              </div>

              <div className="bg-white border border-cusGray p-6 rounded-lg space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">수령인</label>
                  <input
                    type="text"
                    name="name"
                    value={shippingInfo.name}
                    onChange={handleShippingChange}
                    className="w-full p-2 border border-cusGray rounded-md focus:outline-none focus:ring-2 focus:ring-cusBlue"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">연락처</label>
                  <input
                    type="tel"
                    name="phone"
                    value={shippingInfo.phone}
                    onChange={handleShippingChange}
                    className="w-full p-2 border border-cusGray rounded-md focus:outline-none focus:ring-2 focus:ring-cusBlue"
                    placeholder="'-' 없이 입력해주세요"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">배송지 주소</label>
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      name="postcode"
                      value={shippingInfo.postcode}
                      onChange={handleShippingChange}
                      className="w-1/3 p-2 border border-cusGray rounded-md focus:outline-none focus:ring-2 focus:ring-cusBlue"
                      placeholder="우편번호"
                      readOnly
                      required
                    />
                    <button
                      type="button"
                      onClick={handleSearchAddress}
                      className="px-4 py-2 bg-cusGray text-cusBlack rounded-md hover:bg-cusGray-dark"
                    >
                      주소 검색
                    </button>
                  </div>
                  <input
                    type="text"
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleShippingChange}
                    className="w-full p-2 border border-cusGray rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-cusBlue"
                    placeholder="기본 주소"
                    readOnly
                    required
                  />
                  <input
                    type="text"
                    name="addressDetail"
                    value={shippingInfo.addressDetail}
                    onChange={handleShippingChange}
                    className="w-full p-2 border border-cusGray rounded-md focus:outline-none focus:ring-2 focus:ring-cusBlue"
                    placeholder="상세 주소"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">배송 요청사항</label>
                  <select
                    name="message"
                    value={shippingInfo.message}
                    onChange={handleShippingChange}
                    className="w-full p-2 border border-cusGray rounded-md focus:outline-none focus:ring-2 focus:ring-cusBlue"
                  >
                    <option value="">배송 시 요청사항을 선택해주세요</option>
                    <option value="부재 시 경비실에 맡겨주세요">부재 시 경비실에 맡겨주세요</option>
                    <option value="부재 시 문 앞에 놓아주세요">부재 시 문 앞에 놓아주세요</option>
                    <option value="배송 전 연락 바랍니다">배송 전 연락 바랍니다</option>
                    <option value="custom">직접 입력</option>
                  </select>
                  {shippingInfo.message === 'custom' && (
                    <textarea
                      name="customMessage"
                      value={shippingInfo.customMessage}
                      onChange={handleShippingChange}
                      className="w-full p-2 border border-cusGray rounded-md mt-2 focus:outline-none focus:ring-2 focus:ring-cusBlue"
                      placeholder="배송 요청사항을 입력해주세요"
                      rows={2}
                    ></textarea>
                  )}
                </div>
              </div>
            </div>

            {/* 결제 정보 */}
            <div className="mb-8">
              <h2 className="text-lg font-bold mb-4 text-cusBlack">결제 정보</h2>
              <div className="bg-white border border-cusGray p-6 rounded-lg">
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-cusBlack-light">상품 금액</span>
                    <span className="font-medium">{productTotal.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cusBlack-light">배송비</span>
                    <span className="font-medium">{shippingFee > 0 ? `${shippingFee.toLocaleString()}원` : '무료'}</span>
                  </div>
                  <div className="flex justify-between pt-4 border-t border-cusGray">
                    <span className="text-cusBlack font-bold">총 결제 금액</span>
                    <span className="text-cusRed font-bold text-xl">{totalAmount.toLocaleString()}원</span>
                  </div>
                </div>

                {/* 기뷰페이 사용 여부 */}
                <div className="p-4 bg-cusLightBlue-lighter rounded-lg mb-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="flex items-center mb-1">
                        <span className="text-yellow-500 text-xl mr-2">👑</span>
                        <h3 className="text-lg font-medium text-cusBlue">기뷰페이 결제</h3>
                      </div>
                      <p className="text-sm text-cusBlack-light">사용 가능한 기뷰페이: <span className="font-bold">{Number(balance).toLocaleString()}원</span></p>
                    </div>
                    <div className={`font-medium ${balance >= totalAmount ? 'text-cusBlue' : 'text-cusRed'}`}>
                      {balance >= totalAmount
                        ? "기뷰페이로 결제됩니다"
                        : "잔액이 부족합니다"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 구매 동의 */}
            <div className="mb-8">
              <div className="bg-cusGray-light p-4 rounded-lg">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mr-2 h-4 w-4 text-cusBlue"
                    required
                  />
                  <span>주문 내용을 확인하였으며, 결제에 동의합니다.</span>
                </label>
              </div>
            </div>

            {/* 결제 버튼 */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="w-full max-w-md py-4 bg-cusRed text-white font-bold text-lg rounded-lg hover:bg-cusRed-light transition-colors"
              >
                {totalAmount.toLocaleString()}원 결제하기
              </button>
            </div>
          </form>
        </div>
        
        {/* 구매 동의 */}
        <div className="mb-8">
          <div className="bg-cusGray-light p-4 rounded-lg">
            <label className="flex items-center">
              <input 
                type="checkbox" 
                checked={agreeTerms} 
                onChange={(e) => setAgreeTerms(e.target.checked)} 
                className="mr-2 h-4 w-4 text-cusBlue"
                required
              />
              <span>주문 내용을 확인하였으며, {orderInfo.isFundingProduct ? '상품 수령' : '결제'}에 동의합니다.</span>
            </label>
          </div>
        </div>
        
        {/* 결제 버튼 */}
        <div className="flex justify-center">
          <button 
            type="submit"
            className="w-full max-w-md py-4 bg-cusRed text-white font-bold text-lg rounded-lg hover:bg-cusRed-light transition-colors"
          >
            {orderInfo.isFundingProduct 
              ? "무료 상품 받기" 
              : `${totalAmount.toLocaleString()}원 결제하기`}
          </button>
        </div>
      </form>
      
      {/* 결제 비밀번호 모달 */}
      <PaymentPasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSubmit={handlePaymentConfirm}
        amount={totalAmount}
        isLoading={isLoading}
        isFreeOrder={orderInfo.isFundingProduct}
      />
    </div>
  );
};

export default OrderPage;