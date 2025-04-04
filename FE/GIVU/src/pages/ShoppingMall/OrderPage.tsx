import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// 결제 비밀번호 모달 컴포넌트
const PaymentPasswordModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (password: string) => void;
  amount: number;
}> = ({ isOpen, onClose, onSubmit, amount }) => {
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
    onSubmit(password);
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
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">결제 비밀번호 확인</h2>
        
        <div className="mb-6">
          <p className="text-gray-600 text-center mb-4">
            결제를 완료하기 위해 6자리 비밀번호를 입력해주세요.
          </p>
          
          <p className="text-center font-bold text-lg mb-4">
            결제 금액: <span className="text-cusRed">{amount.toLocaleString()}원</span>
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
            disabled={password.length !== 6 || loading}
            className={`px-6 py-2 ${
              password.length === 6 && !loading
                ? 'bg-cusRed hover:bg-cusRed-light text-white' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            } rounded-md transition-colors`}
          >
            {loading ? '처리중...' : '결제하기'}
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
  const [orderInfo, setOrderInfo] = useState<any>(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState<boolean>(false);

  // 구매 정보 및 상품 정보 (URL에서 가져오거나 location state에서 가져옴)
  useEffect(() => {
    if (location.state?.product) {
      setOrderInfo({
        product: location.state.product,
        quantity: location.state.quantity || 1,
        options: location.state.options || {},
      });
    } else {
      // 잘못된 접근 처리
      alert('올바르지 않은 접근입니다.');
      navigate('/shopping');
    }

    // 페이지 로드 시 스크롤을 맨 위로 이동
    window.scrollTo(0, 0);
  }, [location, navigate]);

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
  const handlePaymentConfirm = async (password: string) => {
    try {
      // 비밀번호 검증 (실제로는 API 호출로 검증)
      console.log('결제 비밀번호:', password);
      
      // 토큰 가져오기
      const token = localStorage.getItem('auth_token');
      if (!token) {
        alert('로그인이 필요합니다.');
        navigate('/login');
        return;
      }
      
      // 현재 시각을 Unix 타임스탬프(밀리초)로 변환
      // const timestamp = Date.now();
      
      // 결제 요청 데이터 구성
      // const paymentData = {
      //   timestamp: timestamp,
      //   password: password,
      //   amount: totalAmount,
      //   orderId: `ORDER-${Date.now()}`, // 임시 주문 ID 생성
      //   productInfo: {
      //     productId: product.id,
      //     name: product.name || product.productName,
      //     quantity: quantity,
      //     options: options
      //   },
      //   deliveryInfo: shippingInfo
      // };
      
      // 여기서 실제 API 호출로 결제 처리 (주석 처리)
      /*
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/payment/process`,
        paymentData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.code !== 'SUCCESS') {
        throw new Error(response.data.message || '결제에 실패했습니다.');
      }
      */
      
      // 임시 처리 (API 연동 전)
      setTimeout(() => {
        setIsPasswordModalOpen(false);
        alert('결제가 완료되었습니다!');
        navigate('/mypage'); // 주문 완료 후 마이페이지로 이동
      }, 1000);
    } catch (error: any) {
      console.error('결제 처리 중 오류:', error);
      alert(`결제에 실패했습니다: ${error.message || '알 수 없는 오류'}`);
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
  
  // 최종 결제 금액
  const totalAmount = productTotal + shippingFee;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8 text-cusBlack border-b pb-4">주문/결제</h1>
      
      <form onSubmit={handleSubmitOrder}>
        {/* 주문 상품 정보 */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4 text-cusBlack">주문 상품</h2>
          <div className="bg-cusGray-light p-4 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-white rounded overflow-hidden">
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{product.name}</h3>
                <div className="text-sm text-cusBlack-light mt-1">
                  {Object.entries(options as Record<string, string>).map(([key, value]) => (
                    <div key={key}>
                      {key}: <span className="text-cusBlack">{value}</span>
                    </div>
                  ))}
                  <div>수량: <span className="text-cusBlack">{quantity}개</span></div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-cusBlack">
                  {discountedPrice.toLocaleString()}원
                </div>
                {product.discount > 0 && (
                  <div className="text-sm text-cusRed">
                    {product.discount}% 할인
                  </div>
                )}
              </div>
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
                  <p className="text-sm text-cusBlack-light">사용 가능한 기뷰페이: 100,000원</p>
                </div>
                <div className="text-cusBlue font-medium">기뷰페이로 결제됩니다</div>
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
      
      {/* 결제 비밀번호 모달 */}
      <PaymentPasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSubmit={handlePaymentConfirm}
        amount={totalAmount}
      />
    </div>
  );
};

export default OrderPage;