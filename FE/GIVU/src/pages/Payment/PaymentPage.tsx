import { useState, useEffect } from 'react';
import { useLocation, useNavigate} from 'react-router-dom';
// import axios from 'axios';

interface PaymentState {
  amount: number;
  title: string;
  creatorName: string;
}

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
//   const { id } = useParams();
  
  // location.state가 없을 경우 기본값 설정
  const paymentData = location.state as PaymentState || {
    amount: 10000,
    title: "테스트 펀딩",
    creatorName: "테스트 사용자"
  };
  
  const { amount, title } = paymentData;
  const [balance, setBalance] = useState<number>(50000); // 임시 잔액 데이터
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 실제 API 연동 시 주석 해제
    // const fetchBalance = async () => {
    //   try {
    //     setLoading(true);
    //     const token = localStorage.getItem('auth_token');
    //     if (!token) {
    //       navigate('/login');
    //       return;
    //     }
    //
    //     const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/users/balance`, {
    //       headers: {
    //         'Authorization': `Bearer ${token}`
    //       }
    //     });
    //     setBalance(response.data.balance);
    //   } catch (err) {
    //     setError('잔액 조회에 실패했습니다.');
    //     console.error('Error fetching balance:', err);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    
    // API 대신 임시 데이터 사용
    setLoading(true);
    setTimeout(() => {
      setBalance(50000); // 임시 잔액 데이터
      setLoading(false);
    }, 500);
    
    // fetchBalance();
  }, [navigate]);

  const handlePayment = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        navigate('/login');
        return;
      }

      if (balance < amount) {
        alert('잔액이 부족합니다. GIVU 페이를 충전해주세요.');
        return;
      }

      // 실제 API 연동 대신 성공 처리
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        alert('결제가 완료되었습니다!');
        navigate('/funding');
      }, 1000);
      
      // 실제 API 연동 시 주석 해제
      // const response = await axios.post(
      //   `${import.meta.env.VITE_API_BASE_URL}/payments`,
      //   {
      //     amount,
      //     title,
      //     creatorName
      //   },
      //   {
      //     headers: {
      //       'Authorization': `Bearer ${token}`
      //     }
      //   }
      // );
      //
      // if (response.status === 200) {
      //   alert('결제가 완료되었습니다!');
      //   navigate('/funding');
      // }
    } catch (err) {
      setError('결제 처리 중 오류가 발생했습니다.');
      console.error('Error processing payment:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-8">결제하기</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">결제 정보</h2>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-600">펀딩 제목</span>
            <span className="font-medium">{title}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">선물 금액</span>
            <span className="font-medium">{amount.toLocaleString()}원</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">현재 GIVU 페이 잔액</span>
            <span className="font-medium">{balance.toLocaleString()}원</span>
          </div>
          <div className="flex justify-between text-lg font-bold">
            <span>결제 후 잔액</span>
            <span className={balance - amount < 0 ? 'text-red-500' : ''}>
              {(balance - amount).toLocaleString()}원
            </span>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h3 className="font-semibold mb-2">결제 안내</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• 결제는 GIVU 페이를 통해 진행됩니다.</li>
          <li>• 결제 후에는 취소가 불가능합니다.</li>
          <li>• 결제가 완료되면 펀딩 목록으로 이동합니다.</li>
        </ul>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex-1 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          취소
        </button>
        <button
          onClick={handlePayment}
          disabled={balance < amount}
          className={`flex-1 py-3 rounded-lg text-white font-medium ${
            balance < amount
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-black hover:bg-gray-800'
          }`}
        >
          결제하기
        </button>
      </div>
    </div>
  );
};

export default PaymentPage; 