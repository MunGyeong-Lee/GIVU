import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { isFundingCreator } from "../../services/review.service";
// import { makeFundingPayment, getFundingPaymentStatus } from "../../services/funding.service";

// 타입스크립트에서 canvas-confetti를 사용하기 위한 타입 선언
// declare module 'canvas-confetti' {
//   function confetti(options?: any): Promise<any>;
//   export = confetti;
// }

// 펀딩 데이터 타입 정의
interface FundingDetail {
  fundingId: number;
  title: string;
  description: string;
  category: string;
  categoryName: string | null;
  scope: string;
  participantsNumber: number;
  fundedAmount: number;
  status: string;
  image: string | null;
  createdAt: string;
  updatedAt: string | null;
  creator: boolean; // 백엔드 API 응답의 creator 필드 추가
  writer: {
    userId: number;
    nickName: string;
    image: string;
  };
  product: {
    id: number;
    productName: string;
    price: number;
    image: string;
  };
  letters: Array<{
    letterId: number;
    funding: number;
    user: {
      userId: number;
      nickName: string;
      image: string;
    };
    comment: string;
    image: string | null;
    access: string;
    createdAt: string;
    updatedAt: string;
  }>;
  reviews: Array<any>;
}

// 잔액 정보 인터페이스 추가
interface BalanceInfo {
  givuPayBalance: number;
  bankBalance: number | null;
  accountNumber: string | null;
}

// 선물 옵션 데이터
const GIFT_OPTIONS = [
  { amount: 0, label: "직접 입력하기", description: "원하는 금액으로 참여" },
  { amount: 5000, label: "5000원 선물하기", description: "커피 한잔 선물" },
  { amount: 10000, label: "10000원 선물하기", description: "디저트 한 개 선물" },
  { amount: 20000, label: "20000원 선물하기", description: "식사 한끼 선물" },
  { amount: 30000, label: "30000원 선물하기", description: "소품 한 개 선물" },
  { amount: 50000, label: "50000원 선물하기", description: "프리미엄 선물" }
];

// 임시 펀딩 데이터 (API 실패 시 사용)
const FALLBACK_DATA: FundingDetail = {
  fundingId: 1,
  title: "펀딩 제목",
  description: "펀딩 설명이 로드되지 않았습니다.",
  category: "카테고리",
  categoryName: null,
  scope: "PUBLIC",
  participantsNumber: 0,
  fundedAmount: 0,
  status: "진행중",
  image: null,
  createdAt: new Date().toISOString(),
  updatedAt: null,
  creator: false,
  writer: {
    userId: 1,
    nickName: "작성자",
    image: "https://via.placeholder.com/200x200?text=프로필"
  },
  product: {
    id: 1,
    productName: "상품명",
    price: 10000,
    image: "https://via.placeholder.com/800x500?text=상품이미지"
  },
  letters: [],
  reviews: []
};

const FundingDetailPage = () => {
  const navigate = useNavigate();
  const params = useParams<{ id?: string }>();
  console.log('URL 파라미터 전체:', params);
  
  // 파라미터에서 id 추출
  const fundingId = params.id;
  console.log('사용할 펀딩 ID:', fundingId);

  // ID가 없는 경우 홈으로 리다이렉트
  useEffect(() => {
    if (!fundingId) {
      console.error('펀딩 ID가 없음, 홈으로 리다이렉트');
      navigate('/');
      return;
    }
  }, [fundingId, navigate]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [fundingData, setFundingData] = useState<FundingDetail | null>(null);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isCustomInput, setIsCustomInput] = useState(false);
  const [showAllParticipants, setShowAllParticipants] = useState(false);
  const [amountError, setAmountError] = useState<string | null>(null);
  // const [paymentProcessing, setPaymentProcessing] = useState<boolean>(false);
  // const [paymentResult, setPaymentResult] = useState<any>(null);
  
  // 잔액 정보 상태 추가
  const [balanceInfo, setBalanceInfo] = useState<BalanceInfo>({
    givuPayBalance: 0,
    bankBalance: null,
    accountNumber: null
  });
  const [showBalanceInfo, setShowBalanceInfo] = useState<boolean>(false);
  const [balanceLoading, setBalanceLoading] = useState<boolean>(false);

  // 펀딩 생성자 확인 상태 추가
  const [isCreator, setIsCreator] = useState<boolean>(false);
  const [, setCreatorCheckLoading] = useState<boolean>(false);

  // 상품 구매 및 후기 작성 여부 추적 상태 추가
  const [hasPurchasedProduct, setHasPurchasedProduct] = useState<boolean>(false);
  const [hasWrittenReview, setHasWrittenReview] = useState<boolean>(false);

  // 편지 작성 관련 상태 추가
  const [letterComment, setLetterComment] = useState<string>('');
  const [letterAccess, setLetterAccess] = useState<string>('공개'); // 기본값은 공개
  const [letterImage, setLetterImage] = useState<File | null>(null);
  const [letterImagePreview, setLetterImagePreview] = useState<string | null>(null);
  const [isLetterSubmitting, setIsLetterSubmitting] = useState<boolean>(false);
  const [letterSuccess, setLetterSuccess] = useState<boolean>(false);
  const [letterError, setLetterError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 상태 관리에 isLoading 추가
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 비밀번호 확인 관련 상태 추가
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // 삭제 확인 모달 관련 상태 추가
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState<boolean>(false);

  // 수정 모달 관련 상태 추가
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    category: '',
    scope: '',
    toDelete: [] as string[]
  });
  const [editLoading, setEditLoading] = useState<boolean>(false);

  // 폭죽 효과 표시 여부
  const [showConfetti, setShowConfetti] = useState<boolean>(false);

  // 펀딩 달성율 계산 및 폭죽 효과 표시
  const fundingPercentage = useMemo(() => {
    if (!fundingData?.product || !fundingData.product.price) return 0;
    
    // 달성율 계산 (소수점 반올림)
    const percentage = Math.round((fundingData.fundedAmount / fundingData.product.price) * 100);
    
    // 최대 100%로 제한
    const result = Math.min(percentage, 100);
    console.log(`펀딩 달성률: ${result}%, 모금액: ${fundingData.fundedAmount}, 목표금액: ${fundingData.product.price}`);
    
    return result;
  }, [fundingData]);
  
  // 펀딩 100% 달성 여부 확인
  const isFundingCompleted = useMemo(() => {
    if (!fundingData?.product || !fundingData.product.price) return false;
    
    // 모금액이 목표금액 이상인지 확인
    const isCompleted = fundingData.fundedAmount >= fundingData.product.price;
    console.log(`펀딩 완료 여부: ${isCompleted ? '완료' : '진행중'}`);
    
    return isCompleted;
  }, [fundingData]);

  // 펀딩 50% 이상 달성 여부 확인
  const isHalfCompleted = useMemo(() => {
    if (!fundingData?.product || !fundingData.product.price) return false;
    
    // 모금액이 목표금액의 50% 이상인지 확인
    const isHalf = fundingData.fundedAmount >= (fundingData.product.price * 0.5);
    console.log(`펀딩 50% 이상 달성 여부: ${isHalf ? '달성' : '미달성'}`);
    
    return isHalf;
  }, [fundingData]);

  // 펀딩이 완료 상태인지 확인 (status 기준)
  const isStatusCompleted = useMemo(() => {
    if (!fundingData) return false;
    
    // status가 '완료' 또는 'COMPLETED'인지 확인
    const completedStatus = fundingData.status === '완료' || 
                           fundingData.status === 'COMPLETED' || 
                           fundingData.status === 'Completed' ||
                           fundingData.status === '환불' ||
                           fundingData.status === 'REFUNDED' ||
                           fundingData.status === 'Refunded' ||
                           fundingData.status === '취소' ||
                           fundingData.status === 'CANCELED' ||
                           fundingData.status === 'Canceled' ||
                           fundingData.status === 'canceled';
    
    console.log(`펀딩 상태 완료 여부: ${completedStatus ? '완료됨' : '진행중'}, 현재 상태: ${fundingData.status}`);
    
    return completedStatus;
  }, [fundingData]);

  // 펀딩이 완료된 상태인지 (100% 달성 또는 성공 처리되었거나 환불된 경우)
  const isCompleted = useMemo(() => {
    if (!fundingData) return false;
    
    // 상태가 완료 또는 환불인 경우
    const isStatusDone = fundingData.status === '완료' || 
                        fundingData.status === 'COMPLETED' || 
                        fundingData.status === 'Completed' ||
                        fundingData.status === '환불' || 
                        fundingData.status === 'REFUNDED' || 
                        fundingData.status === 'Refunded' ||
                        fundingData.status === '취소' ||
                        fundingData.status === 'CANCELED' ||
                        fundingData.status === 'Canceled' ||
                        fundingData.status === 'canceled';
    
    // 100% 달성된 경우 자동으로 완료 상태로 간주
    const is100PercentDone = isFundingCompleted;
    
    return isStatusDone || is100PercentDone;
  }, [fundingData, isFundingCompleted]);

  // 펀딩 상태 표시 텍스트 및 스타일
  const fundingStatusInfo = useMemo(() => {
    // fundingData가 없는 경우 기본값 반환
    if (!fundingData) {
      return {
        text: "로딩 중",
        bgColor: "bg-gray-100",
        textColor: "text-gray-800",
        borderColor: "border-gray-200",
        description: "펀딩 정보를 불러오는 중입니다."
      };
    }
    
    // 환불 상태 확인 (50% 미만이고 환불 버튼 클릭한 경우)
    const isRefunded = fundingData.status === '환불' || 
                      fundingData.status === 'REFUNDED' || 
                      fundingData.status === 'Refunded' ||
                      fundingData.status === '취소' ||
                      fundingData.status === 'CANCELED' ||
                      fundingData.status === 'Canceled' ||
                      fundingData.status === 'canceled';

    // 성공 처리된 상태 확인 (50% 이상이고 성공 처리 버튼 클릭한 경우)
    const isSuccessCompleted = fundingData.status === '완료' || 
                              fundingData.status === 'COMPLETED' || 
                              fundingData.status === 'Completed';

    if (isRefunded) {
      // 취소 상태인 경우 달성률에 따라 메시지 구분
      if (fundingData.status === '취소' || 
          fundingData.status === 'CANCELED' || 
          fundingData.status === 'Canceled' || 
          fundingData.status === 'canceled') {
        
        // 달성률 50% 이상이면 성공 처리로 표시
        if (fundingPercentage >= 50) {
          return {
            text: "펀딩 성공 처리",
            bgColor: "bg-purple-100",
            textColor: "text-purple-800",
            borderColor: "border-purple-200",
            description: "펀딩이 성공적으로 처리되었습니다. 모금된 금액이 GIVU Pay로 이체되었습니다."
          };
        } 
        // 달성률 50% 미만이면 환불 완료로 표시
        else {
          return {
            text: "환불 완료",
            bgColor: "bg-gray-100",
            textColor: "text-gray-800",
            borderColor: "border-gray-200",
            description: "펀딩이 환불 처리되었습니다. 참여자들에게 모든 금액이 환불되었습니다."
          };
        }
      }
      
      // 기존 환불 상태 처리
      return {
        text: "환불 완료",
        bgColor: "bg-gray-100",
        textColor: "text-gray-800",
        borderColor: "border-gray-200",
        description: "펀딩이 환불 처리되었습니다. 참여자들에게 모든 금액이 환불되었습니다."
      };
    } else if (isFundingCompleted) {
      // 100% 달성했지만 아직 완료 처리되지 않은 경우 (자동으로 펀딩 완료로 간주)
      return {
        text: "펀딩 달성 완료",
        bgColor: "bg-green-100",
        textColor: "text-green-800", 
        borderColor: "border-green-200",
        description: "목표 금액 100%를 달성했습니다! 상품 구매 및 후기 작성이 가능합니다."
      };  
    } else if (isSuccessCompleted) {
      // 성공 처리된 펀딩
      return {
        text: "펀딩 완료",
        bgColor: "bg-purple-100",
        textColor: "text-purple-800", 
        borderColor: "border-purple-200",
        description: "펀딩이 완료되었습니다. 모금된 금액이 GIVU Pay로 이체되었습니다."
      };
    
    } else if (isHalfCompleted) {
      // 50% 이상 달성했지만 아직 성공 처리되지 않은 경우
      return {
        text: "펀딩 진행 중 (50% 이상)",
        bgColor: "bg-blue-100",
        textColor: "text-blue-800",
        borderColor: "border-blue-200",
        description: "목표 금액의 50% 이상을 달성했습니다. 펀딩 성공 처리 버튼을 눌러 펀딩을 완료할 수 있습니다."
      };
    } else {
      // 50% 미만이고 환불 처리되지 않은 경우
      return {
        text: "펀딩 진행 중",
        bgColor: "bg-yellow-100",
        textColor: "text-yellow-800",
        borderColor: "border-yellow-200",
        description: "목표 금액의 달성을 위해 펀딩이 진행 중입니다. 50% 미만인 경우 환불 처리가 가능합니다."
      };
    }
  }, [isFundingCompleted, isHalfCompleted, fundingData, fundingPercentage]);

  // 펀딩 상세 정보 가져오기 함수 정의 (useCallback으로 감싸기)
  const fetchFundingDetail = useCallback(async () => {
    try {
      // ID가 없으면 API 호출하지 않음
      if (!fundingId) {
        console.error('펀딩 ID가 없음');
        setError('펀딩 ID가 잘못되었습니다.');
        setLoading(false);
        return;
      }

      console.log('펀딩 상세 정보 요청 시작, ID:', fundingId);
      setLoading(true);
      
      // API Base URL 확인 - 다른 파일에서 사용하는 방식으로 수정
      const baseUrl = import.meta.env.VITE_BASE_URL || import.meta.env.VITE_API_BASE_URL || 'https://j12d107.p.ssafy.io/api';
      console.log('API 기본 URL 확인:', {
        VITE_BASE_URL: import.meta.env.VITE_BASE_URL,
        VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
        '사용할 URL': baseUrl
      });
      
      // 토큰 확인 - 다양한 키 이름으로 시도
      const token = localStorage.getItem('auth_token') || 
                   localStorage.getItem('access_token') ||
                   localStorage.getItem('token') ||
                   localStorage.getItem('accessToken');
      console.log('토큰 존재 여부:', !!token);
      
      // 전체 API URL 로깅 - 경로 수정: funding -> fundings (복수형)
      const apiUrl = `${baseUrl}/fundings/${fundingId}`;
      console.log('요청 URL:', apiUrl);
      
      // API 요청 - 더 많은 오류 정보 캡처
      try {
        const response = await axios.get(
          apiUrl,
          {
            headers: {
              'Authorization': token ? `Bearer ${token}` : '',
              'Content-Type': 'application/json'
            }
          }
        );
        
        console.log('펀딩 상세 응답 전체:', response);
        console.log('펀딩 상세 응답 데이터:', response.data);
        
        // 응답 구조 확인
        if (response.data) {
          if (response.data.code === 'SUCCESS') {
            console.log('응답 데이터 구조:', response.data.data);
            
            // API 응답의 creator 필드 확인 및 로깅
            console.log('펀딩 생성자 여부(creator):', response.data.data.creator);
            
            // 응답에서 creator 필드를 꺼내서 isCreator 상태에 설정
            if (response.data.data.creator !== undefined) {
              setIsCreator(response.data.data.creator);
            }
            
            // 펀딩 데이터 설정
            setFundingData(response.data.data);
            
            // 상태값 로그 추가
            console.log('현재 펀딩 상태값:', response.data.data.status);
            console.log('펀딩 상태 전체 정보:', {
              status: response.data.data.status,
              isCompleted: response.data.data.fundedAmount >= response.data.data.product?.price,
              fundedAmount: response.data.data.fundedAmount,
              targetAmount: response.data.data.product?.price
            });
            
            // 상품 구매 여부와 후기 작성 여부 확인
            if (response.data.data.hasOwnProperty('hasPurchased')) {
              setHasPurchasedProduct(response.data.data.hasPurchased);
            } else {
              // API 응답에 정보가 없으면 localStorage에서 확인
              const purchaseKey = `funding_${fundingId}_purchased`;
              const hasPurchased = localStorage.getItem(purchaseKey) === 'true';
              setHasPurchasedProduct(hasPurchased);
            }
            
            // 후기 작성 여부 확인
            if (response.data.data.hasOwnProperty('hasReview') || 
                (response.data.data.reviews && response.data.data.reviews.length > 0)) {
              setHasWrittenReview(true);
            } else {
              // API 응답에 정보가 없으면 localStorage에서 확인
              const reviewKey = `funding_${fundingId}_reviewed`;
              const hasReviewed = localStorage.getItem(reviewKey) === 'true';
              setHasWrittenReview(hasReviewed);
            }
          } else {
            console.error('응답 코드 오류:', response.data.code, response.data.message);
            // 임시 데이터로 UI 표시 (실제 환경에서는 제거할 것)
            setFundingData(FALLBACK_DATA);
            setError(response.data?.message || '펀딩 정보를 가져오지 못했습니다.');
          }
        } else {
          console.error('응답 데이터가 없음');
          // 임시 데이터로 UI 표시 (실제 환경에서는 제거할 것)
          setFundingData(FALLBACK_DATA);
          setError('서버 응답이 올바르지 않습니다.');
        }
      } catch (apiError: any) {
        console.error('API 요청 오류 상세정보:', apiError);
        console.error('오류 상태 코드:', apiError.response?.status);
        console.error('오류 응답 데이터:', apiError.response?.data);
        console.error('오류 메시지:', apiError.message);
        
        // axios 오류 세부 정보 기반으로 사용자 친화적인 오류 메시지 설정
        let errorMessage = '펀딩 정보를 가져오는 중 오류가 발생했습니다.';
        if (apiError.response) {
          // 서버가 응답을 반환했으나 2xx 범위가 아닌 경우
          if (apiError.response.status === 404) {
            errorMessage = '펀딩을 찾을 수 없습니다.';
          } else if (apiError.response.status === 401 || apiError.response.status === 403) {
            errorMessage = '접근 권한이 없습니다.';
          } else if (apiError.response.data?.message) {
            errorMessage = apiError.response.data.message;
          }
        } else if (apiError.request) {
          // 요청은 전송되었으나 응답을 받지 못한 경우
          errorMessage = '서버로부터 응답이 없습니다. 네트워크 연결을 확인해주세요.';
        }
        
        setError(errorMessage);
        setFundingData(FALLBACK_DATA); // 임시 데이터로 UI 표시
        throw apiError; // 상위 catch 블록으로 오류 전파
      }
    } catch (err) {
      console.error('펀딩 상세 조회 오류:', err);
      // 이미 내부 catch 블록에서 처리되었으므로 추가 작업은 필요 없음
    } finally {
      setLoading(false);
    }
  }, [fundingId, setError, setLoading, setFundingData]); // 사용하는 상태 setter 함수들 추가
  
  // 펀딩 상세 데이터 가져오기
  useEffect(() => {
    fetchFundingDetail();
  }, [fetchFundingDetail]);

  // 컴포넌트가 마운트될 때 스크롤을 맨 위로 이동
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // URL에서 구매 완료 상태 확인
  useEffect(() => {
    // URL 쿼리 파라미터 확인
    const queryParams = new URLSearchParams(window.location.search);
    const purchaseComplete = queryParams.get('purchase_complete');
    const reviewComplete = queryParams.get('review_complete');
    
    // 구매 완료 상태가 URL에 있으면 상태 업데이트 및 API 호출
    if (purchaseComplete === 'true' && fundingId) {
      localStorage.setItem(`funding_${fundingId}_purchased`, 'true');
      setHasPurchasedProduct(true);
      
      // 배송 상태로 API 호출 추가
      const updateFundingToShipping = async () => {
        try {
          setIsLoading(true);
          const baseUrl = import.meta.env.VITE_BASE_URL || import.meta.env.VITE_API_BASE_URL || 'https://j12d107.p.ssafy.io/api';
          
          // 토큰 확인
          const token = localStorage.getItem('auth_token') || 
                       localStorage.getItem('access_token') ||
                       localStorage.getItem('token') ||
                       localStorage.getItem('accessToken');
                       
          if (!token) {
            console.error('토큰이 없어 상태 업데이트를 할 수 없습니다.');
            return;
          }
          
          // 고정 주소 사용 (주소는 API에 필요하지만 내용은 중요하지 않을 수 있음)
          const address = '기본 배송 주소';
          
          console.log(`펀딩 상태 업데이트 API 호출 시작: 펀딩 ID ${fundingId}, 주소: ${address}`);
          
          // 펀딩 상태 업데이트 API 호출
          const response = await axios.put(
            `${baseUrl}/fundings/${fundingId}/purchase?address=${encodeURIComponent(address)}`,
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
            console.log('펀딩 상태가 "배송 중"으로 업데이트되었습니다.');
            
            // 즉시 상태 업데이트 (API 호출 없이)
            if (fundingData) {
              setFundingData({
                ...fundingData,
                status: 'shipping'
              });
            }
            
            // 페이지 새로고침
            setTimeout(() => {
              fetchFundingDetail();
            }, 500);
          } else {
            console.error('펀딩 상태 업데이트 실패:', response.data.message);
          }
        } catch (error) {
          console.error('펀딩 상태 업데이트 중 오류:', error);
        } finally {
          setIsLoading(false);
        }
      };
      
      // API 호출 실행
      updateFundingToShipping();
      
      // 쿼리 파라미터 제거 (URL 정리)
      queryParams.delete('purchase_complete');
      const newUrl = queryParams.toString() 
        ? `${window.location.pathname}?${queryParams.toString()}`
        : window.location.pathname;
      window.history.replaceState(null, '', newUrl);
    }
    
    // 후기 작성 완료 상태가 URL에 있으면 상태 업데이트
    if (reviewComplete === 'true' && fundingId) {
      localStorage.setItem(`funding_${fundingId}_reviewed`, 'true');
      setHasWrittenReview(true);
      
      // 쿼리 파라미터 제거 (URL 정리)
      queryParams.delete('review_complete');
      const newUrl = queryParams.toString() 
        ? `${window.location.pathname}?${queryParams.toString()}`
        : window.location.pathname;
      window.history.replaceState(null, '', newUrl);
    }
  }, [fundingId, fetchFundingDetail]);

  // 펀딩 100% 달성 시 폭죽 효과 및 구매 페이지 자동 이동 처리
  useEffect(() => {
    // 펀딩이 100% 달성되었고, 데이터가 있으며, 현재 사용자가 펀딩 생성자인 경우에만 처리
    if (fundingData && isCompleted) {
      // 1. 폭죽 효과 표시 (기존 코드)
      if (!showConfetti) {
        const fundingId = fundingData.fundingId.toString();
        const hasShownConfetti = localStorage.getItem(`confetti_${fundingId}`);
        
        if (!hasShownConfetti) {
          setShowConfetti(true);
          localStorage.setItem(`confetti_${fundingId}`, 'true');
          
          if (typeof window !== 'undefined') {
            // 축하 메시지 표시
            alert("🎉 축하합니다! 펀딩 목표가 달성되었습니다! 🎉");
            
            // 동적으로 confetti 라이브러리 로드 (기존 코드와 동일)
            import('canvas-confetti').then((confettiModule) => {
              const confetti = confettiModule.default;
              
              const duration = 3 * 1000;
              const end = Date.now() + duration;
              
              let lastFireTime = 0;
              const fireInterval = 200;
              
              const frame = () => {
                const now = Date.now();
                
                if (now - lastFireTime > fireInterval) {
                  lastFireTime = now;
                  
                  confetti({
                    particleCount: 50,
                    startVelocity: 25,
                    spread: 250,
                    origin: { x: 0.5, y: 0.5 },
                    zIndex: 2000,
                    gravity: 1.2,
                    scalar: 1,
                    colors: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF']
                  });
                }
                
                if (now < end) {
                  requestAnimationFrame(frame);
                }
              };
              
              frame();
            }).catch((error) => {
              console.error('폭죽 효과를 표시하는 중 오류가 발생했습니다:', error);
            });
          }
        }
      }
      
      // 2. 생성자인 경우 구매 페이지 자동 이동 처리 부분 제거
      // 확인 창을 표시하지 않도록 수정
      if (isCreator) {
        console.log('펀딩 목표 달성 & 생성자 확인됨');
        
        const fundingId = fundingData.fundingId.toString();
        localStorage.setItem(`purchase_${fundingId}`, 'true');
      }
    }
  }, [fundingData, isCompleted, isCreator, showConfetti]);

  // 펀딩 생성자 확인 함수 수정
  useEffect(() => {
    const checkFundingCreator = async () => {
      if (!fundingId) return;
      
      try {
        setCreatorCheckLoading(true);
        console.log('펀딩 생성자 확인 시작, ID:', fundingId);
        
        // API 응답에서 이미 creator 필드를 받았는지 확인
        if (fundingData && fundingData.creator !== undefined) {
          console.log('API 응답의 creator 필드 사용:', fundingData.creator);
          setIsCreator(fundingData.creator);
          
          // 생성자인 경우 폼 데이터 초기화
          if (fundingData.creator) {
            setEditFormData({
              title: fundingData.title,
              description: fundingData.description,
              category: fundingData.category,
              scope: fundingData.scope,
              toDelete: []
            });
          }
          
          setCreatorCheckLoading(false);
          return;
        }
        
        // 백업: API로 생성자 여부 확인
        let isUserCreator = false;
        
        try {
          // API 호출로 생성자 여부 확인
          const result = await isFundingCreator(fundingId);
          console.log('API로 확인한 생성자 여부:', result);
          isUserCreator = result;
        } catch (apiError) {
          console.error('API 호출 오류:', apiError);
          // API 호출 실패시 2번 방법으로 대체
        }
        
        // 백업: 데이터 비교로 생성자 확인
        if (!isUserCreator && fundingData) {
          // 로컬스토리지에서 현재 사용자 ID 가져오기
          const userId = localStorage.getItem('user_id');
          console.log('로컬 저장된 사용자 ID:', userId);
          console.log('펀딩 작성자 ID:', fundingData.writer.userId);
          
          // 사용자 ID와 펀딩 작성자 ID 비교
          if (userId && fundingData.writer && 
              (userId === fundingData.writer.userId.toString() || 
               parseInt(userId) === fundingData.writer.userId)) {
            console.log('ID 비교를 통해 생성자 확인됨');
            isUserCreator = true;
          }
        }
        
        // 테스트 환경에서는 항상 생성자로 설정 (실제 환경에서는 아래 주석 처리)
        // isUserCreator = true;
        
        // 최종 결과 설정
        console.log('최종 생성자 여부 확인 결과:', isUserCreator);
        setIsCreator(isUserCreator);
        
        // 생성자인 경우 폼 데이터 초기화
        if (isUserCreator && fundingData) {
          setEditFormData({
            title: fundingData.title,
            description: fundingData.description,
            category: fundingData.category,
            scope: fundingData.scope,
            toDelete: []
          });
        }
      } catch (error) {
        console.error('펀딩 생성자 확인 중 오류:', error);
        setIsCreator(false);
      } finally {
        setCreatorCheckLoading(false);
      }
    };

    // 펀딩 데이터가 로드된 후 생성자 확인
    if (fundingData) {
      checkFundingCreator();
    }
  }, [fundingId, fundingData]);

  // 이미지 슬라이더 제어 함수
  /* 현재 사용되지 않는 함수들 - 나중에 여러 이미지 지원시 활성화
  const nextImage = () => {
    if (!fundingData || !fundingData.image) return;
    
    // 실제로 여러 이미지가 있다면 아래와 같이 처리
    // setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    
    // 임시로 단일 이미지만 처리
    setCurrentImageIndex(0);
  };

  const prevImage = () => {
    if (!fundingData || !fundingData.image) return;
    
    // 실제로 여러 이미지가 있다면 아래와 같이 처리
    // setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    
    // 임시로 단일 이미지만 처리
    setCurrentImageIndex(0);
  };
  */

  // 금액 옵션 선택 함수 수정
  const selectAmount = (amount: number) => {
    // 오류 상태 초기화
    setAmountError(null);
    
    if (amount === 0) {
      // 직접 입력 모드
      setIsCustomInput(true);
      setSelectedAmount(null);
      setCustomAmount('');
    } else {
      // 남은 금액 계산
      const maxAmount = fundingData && fundingData.product 
        ? Math.max(fundingData.product.price - fundingData.fundedAmount, 0)
        : 0;
      
      // 최대 금액 제한 (남은 금액을 초과하지 못하도록)
      if (amount > maxAmount) {
        setAmountError(`남은 목표 금액(${maxAmount.toLocaleString()}원)을 초과할 수 없습니다.`);
        // 금액은 선택하지만 오류 메시지 표시
        setIsCustomInput(false);
        setSelectedAmount(amount);
        setCustomAmount('');
      } else {
        // 정상 금액
      setIsCustomInput(false);
      setSelectedAmount(amount);
      setCustomAmount('');
      }
    }
  };

  // 직접 입력 금액 처리 함수
  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    const numValue = value === "" ? 0 : parseInt(value);
    
    // 오류 메시지 초기화
    setAmountError("");
    
    // 값이 남은 목표 금액보다 크면 오류 메시지 표시
    if (numValue > remainingAmount) {
      setAmountError(`목표까지 남은 금액(${remainingAmount.toLocaleString()}원)보다 큰 금액은 펀딩할 수 없습니다.`);
    }
    
    setCustomAmount(value);
    setSelectedAmount(numValue);
    setIsCustomInput(true);
  };

  // 참여자 목록 토글 함수
  const toggleParticipantsList = () => {
    setShowAllParticipants(!showAllParticipants);
  };

  // 참여자 표시 개수
  const displayedParticipants = fundingData?.letters 
    ? (showAllParticipants 
        ? fundingData.letters 
        : fundingData.letters.slice(0, 3))
    : [];

  // 남은 목표 금액 계산
  const remainingAmount = useMemo(() => {
    if (!fundingData || !fundingData.product) return 0;
    return Math.max(fundingData.product.price - fundingData.fundedAmount, 0);
  }, [fundingData]);

  // 비밀번호 확인 후 결제 진행 함수
  const processPayment = async () => {
    const authToken = localStorage.getItem('auth_token') || 
                     localStorage.getItem('access_token') ||
                     localStorage.getItem('token') ||
                     localStorage.getItem('accessToken');

    if (!authToken) {
      alert('로그인이 필요합니다.');
      return;
    }

    if (!selectedAmount) {
      alert('금액을 선택해주세요.');
      return;
    }

    if (!fundingId) {
      alert('펀딩 정보를 찾을 수 없습니다.');
      return;
    }

    try {
      setIsLoading(true);
      const baseUrl = import.meta.env.VITE_BASE_URL || import.meta.env.VITE_API_BASE_URL || 'https://j12d107.p.ssafy.io/api';
      
      // 1. 먼저 비밀번호 검증 API 호출
      try {
        console.log('비밀번호 검증 시작');
        const verifyResponse = await axios.post(
          `${baseUrl}/users/checkPassword`,
          { password: password },
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        console.log('비밀번호 검증 응답:', verifyResponse.data);
        
        // 비밀번호 검증 실패
        if (verifyResponse.data.code !== 'SUCCESS') {
          // API 검증 실패 시, 로컬 스토리지에서 직접 비밀번호 확인
          console.log('API 검증 실패, 로컬 스토리지 확인 시도');
          const encodedPassword = localStorage.getItem('account_password');
          
          if (encodedPassword) {
            try {
              const storedPassword = atob(encodedPassword);
              const isMatch = password === storedPassword;
              console.log(`로컬 스토리지 비밀번호 확인 결과: ${isMatch ? '일치' : '불일치'}`);
              
              if (isMatch) {
                // 로컬 비밀번호와 일치하면 검증 성공으로 처리
                console.log('로컬 스토리지 비밀번호와 일치');
                // 계속 결제 처리
              } else {
                // 로컬 비밀번호와도 불일치
                setPasswordError('비밀번호가 올바르지 않습니다.');
                setPassword('');
                setIsLoading(false);
                return;
              }
            } catch (decodeError) {
              console.error('로컬 비밀번호 디코딩 오류:', decodeError);
              setPasswordError('비밀번호 확인 중 오류가 발생했습니다.');
              setPassword('');
              setIsLoading(false);
              return;
            }
          } else {
            // 로컬에 저장된 비밀번호가 없는 경우
            setPasswordError('비밀번호가 올바르지 않습니다.');
            setPassword('');
            setIsLoading(false);
            return;
          }
        }
      } catch (verifyError) {
        console.error('비밀번호 검증 중 오류:', verifyError);
        
        // API 호출 실패 시 로컬 스토리지에서 확인 시도
        try {
          console.log('API 호출 실패, 로컬 스토리지 확인 시도');
          const encodedPassword = localStorage.getItem('account_password');
          
          if (encodedPassword) {
            try {
              const storedPassword = atob(encodedPassword);
              const isMatch = password === storedPassword;
              console.log(`로컬 스토리지 비밀번호 확인 결과: ${isMatch ? '일치' : '불일치'}`);
              
              if (isMatch) {
                // 로컬 비밀번호와 일치하면 검증 성공으로 처리
                console.log('로컬 스토리지 비밀번호와 일치');
                // 계속 결제 처리
              } else {
                // 로컬 비밀번호와도 불일치
                setPasswordError('비밀번호가 올바르지 않습니다.');
                setPassword('');
                setIsLoading(false);
                return;
              }
            } catch (decodeError) {
              console.error('로컬 비밀번호 디코딩 오류:', decodeError);
              setPasswordError('비밀번호 확인 중 오류가 발생했습니다.');
              setPassword('');
              setIsLoading(false);
              return;
            }
          } else {
            // 로컬에 저장된 비밀번호가 없는 경우
            if (axios.isAxiosError(verifyError)) {
              if (verifyError.response?.status === 401) {
                setPasswordError('비밀번호가 올바르지 않습니다.');
              } else {
                setPasswordError(verifyError.response?.data?.message || '비밀번호 검증 중 오류가 발생했습니다.');
              }
            } else {
              setPasswordError('비밀번호 확인 중 오류가 발생했습니다.');
            }
            setPassword('');
            setIsLoading(false);
            return;
          }
        } catch (localError) {
          console.error('로컬 비밀번호 확인 중 오류:', localError);
          setPasswordError('비밀번호 확인 중 오류가 발생했습니다.');
          setPassword('');
          setIsLoading(false);
          return;
        }
      }
      
      // 2. 비밀번호 검증 성공 후 결제 API 호출
      console.log('펀딩 요청 정보:', {
        url: `${baseUrl}/transfer/${parseInt(fundingId as string)}`,
        amount: selectedAmount,
        token: authToken?.substring(0, 20) + '...' // 토큰 일부만 표시
      });
      
      // 비밀번호를 제외하고 결제 API 호출
      const response = await axios.post(
        `${baseUrl}/transfer/${parseInt(fundingId as string)}?amount=${selectedAmount}`,
        {}, // 검증은 이미 완료되었으므로 비밀번호 제외
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('펀딩 응답:', response.data);

      if (response.data.code === 'SUCCESS') {
        const paymentId = response.data.data?.paymentId;
        alert('펀딩 요청이 성공적으로 등록되었습니다. 잔액 차감은 시스템에 의해 자동으로 처리됩니다.');
        
        // 결제 ID가 있으면 결제 현황 조회 API 호출
        if (paymentId) {
          try {
            const statusResponse = await axios.get(
              `${baseUrl}/transfer/${paymentId}`,
              {
                headers: {
                  Authorization: `Bearer ${authToken}`
                }
              }
            );
            console.log('결제 상태 응답:', statusResponse.data);
          } catch (statusError) {
            console.error('결제 상태 조회 중 오류:', statusError);
          }
        }
        
        // 모달 닫고 마이페이지로 이동
        setShowPasswordModal(false);
        alert('마이페이지에서 펀딩 참여 내역을 확인할 수 있습니다.');
        navigate('/mypage');
      } else {
        alert(`펀딩 처리 중 오류가 발생했습니다: ${response.data.message || '알 수 없는 오류'}`);
        setShowPasswordModal(false);
      }
    } catch (error) {
      console.error('펀딩 처리 중 오류:', error);
      
      // 더 자세한 오류 정보 로깅
      if (axios.isAxiosError(error)) {
        console.error('오류 상태 코드:', error.response?.status);
        console.error('오류 응답 데이터:', error.response?.data);
        console.error('오류 헤더:', error.response?.headers);
        
        if (error.response?.status === 404) {
          alert('펀딩을 찾을 수 없습니다.');
        } else if (error.response?.status === 401) {
          alert('로그인이 필요합니다.');
        } else if (error.response?.status === 400) {
          const errorMessage = error.response?.data?.message || '입력값을 확인해주세요';
          alert(`잘못된 요청입니다: ${errorMessage}`);
        } else {
          alert(`펀딩 처리 중 오류가 발생했습니다: ${error.response?.data?.message || error.message || '알 수 없는 오류'}`);
        }
      } else {
        alert('알 수 없는 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 결제 버튼 클릭 핸들러 수정
  const handleGiftClick = () => {
    // 금액이 선택되지 않았거나 오류가 있는 경우 중단
    if (!selectedAmount || amountError) {
      if (!selectedAmount) {
        alert('금액을 선택해주세요.');
      } else if (amountError) {
        alert(amountError);
      }
      return;
    }
    
    // 로그인 확인
    const authToken = localStorage.getItem('auth_token') || 
                     localStorage.getItem('access_token') ||
                     localStorage.getItem('token') ||
                     localStorage.getItem('accessToken');

    if (!authToken) {
      alert('로그인이 필요합니다.');
      return;
    }
    
    // 비밀번호 입력 모달 표시
    setPasswordError(null);
    setPassword('');
    setShowPasswordModal(true);
  };
  
  // 비밀번호 입력 처리
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setPasswordError(null);
  };
  
  // 비밀번호 확인 모달 취소
  const handlePasswordCancel = () => {
    setShowPasswordModal(false);
    setPassword('');
    setPasswordError(null);
  };
  
  // Enter 키 처리
  const handlePasswordKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (password.trim()) {
        processPayment();
      }
    }
  };

  // 잔액 정보 가져오기 함수
  const fetchBalanceInfo = async () => {
    setBalanceLoading(true);
    const token = localStorage.getItem('auth_token') || 
                  localStorage.getItem('access_token') || 
                  localStorage.getItem('token');
    
    if (!token) {
      console.error('인증 토큰이 없습니다.');
      setBalanceLoading(false);
      return;
    }
    
    const baseUrl = import.meta.env.VITE_BASE_URL || import.meta.env.VITE_API_BASE_URL || 'https://j12d107.p.ssafy.io/api';
    
    try {
      // 1. GIVU Pay 잔액 가져오기
      let givuPayBalance = 0;
      
      try {
        const userInfoResponse = await axios.get(`${baseUrl}/users/info`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        console.log('사용자 정보 조회 응답:', userInfoResponse.data);
        
        if (userInfoResponse.data && userInfoResponse.data.balance !== undefined) {
          givuPayBalance = Number(userInfoResponse.data.balance);
          console.log('기뷰페이 잔액 확인됨:', givuPayBalance);
        } else {
          // 대체 API 호출
          const balanceResponse = await axios.get(`${baseUrl}/mypage/getUserBalance`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          console.log('기뷰페이 잔액 대체 API 응답:', balanceResponse.data);
          
          if (balanceResponse.data?.code === 'SUCCESS' && 
              balanceResponse.data?.data?.balance !== undefined) {
            givuPayBalance = Number(balanceResponse.data.data.balance);
            console.log('대체 API에서 기뷰페이 잔액 확인됨:', givuPayBalance);
          }
        }
      } catch (error) {
        console.error('GIVU Pay 잔액 조회 오류:', error);
      }
      
      // 2. 연동 계좌 정보 가져오기
      let hasAccount = false;
      let bankBalance = null;
      let accountNumber = null;
      
      try {
        console.log('연동 계좌 정보 요청 시작');
        const accountResponse = await axios.get(`${baseUrl}/mypage/checkAccount`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        console.log('연동 계좌 조회 API 응답:', accountResponse.data);
        
        // 계좌가 존재하는 경우
        if (accountResponse.data && accountResponse.data.code === 'SUCCESS') {
          console.log('연동 계좌 정보 존재함');
          hasAccount = true;
          
          // API 응답 데이터 구조에 따라 계좌 정보 설정
          if (accountResponse.data.data) {
            // 연동 계좌 번호 설정
            if (accountResponse.data.data.accountNo) {
              accountNumber = accountResponse.data.data.accountNo;
              console.log('계좌번호 확인됨:', accountNumber);
            }
            
            // 연동 계좌 잔액 설정
            if (accountResponse.data.data.balance !== undefined) {
              bankBalance = Number(accountResponse.data.data.balance);
              console.log('계좌 잔액 확인됨:', bankBalance);
            }
          }
        } else {
          console.log('연동된 계좌 정보가 없음');
          hasAccount = false;
        }
      } catch (error) {
        console.error('연동 계좌 정보 조회 오류:', error);
        
        // 로컬 스토리지에서 계좌 정보 확인 (백업)
        const storedAccountNumber = localStorage.getItem('account_number');
        const storedBankBalance = localStorage.getItem('bank_balance');
        
        if (storedAccountNumber) {
          console.log('로컬 스토리지에서 계좌 정보 복구');
          hasAccount = true;
          accountNumber = storedAccountNumber;
          
          if (storedBankBalance) {
            bankBalance = Number(storedBankBalance);
          }
        }
      }
      
      // 잔액 정보 업데이트
      setBalanceInfo({
        givuPayBalance,
        bankBalance: hasAccount ? (bankBalance || 0) : null,
        accountNumber: hasAccount ? accountNumber : null
      });
      
      // 잔액 정보 표시
      setShowBalanceInfo(true);
    } catch (error) {
      console.error('잔액 정보 조회 중 오류 발생:', error);
    } finally {
      setBalanceLoading(false);
    }
  };

  // 편지 이미지 선택 처리 함수
  const handleLetterImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setLetterImage(file);
      
      // 이미지 미리보기 생성
      const reader = new FileReader();
      reader.onloadend = () => {
        setLetterImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 편지 이미지 삭제 함수
  const handleRemoveLetterImage = () => {
    setLetterImage(null);
    setLetterImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 편지 제출 함수
  const handleLetterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fundingId) {
      setLetterError('펀딩 ID가 유효하지 않습니다.');
      return;
    }
    
    if (letterComment.trim() === '') {
      setLetterError('편지 내용을 입력해주세요.');
      return;
    }
    
    try {
      setIsLetterSubmitting(true);
      setLetterError(null);
      
      // API Base URL 가져오기
      const baseUrl = import.meta.env.VITE_BASE_URL || import.meta.env.VITE_API_BASE_URL || 'https://j12d107.p.ssafy.io/api';
      
      // 토큰 확인
      const token = localStorage.getItem('auth_token') || 
                    localStorage.getItem('access_token') ||
                    localStorage.getItem('token');
                    
      if (!token) {
        setLetterError('로그인이 필요합니다.');
        return;
      }
      
      // FormData 객체 생성
      const formData = new FormData();
      
      // JSON 데이터 추가
      const letterData = {
        comment: letterComment,
        access: letterAccess
      };
      
      formData.append('data', new Blob([JSON.stringify(letterData)], { type: 'application/json' }));
      
      // 이미지가 있는 경우 추가
      if (letterImage) {
        formData.append('image', letterImage);
      }
      
      // API 요청
      const response = await axios.post(
        `${baseUrl}/fundings/letters/${fundingId}`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      console.log('편지 작성 응답 전체:', response);
      console.log('편지 작성 응답 데이터:', response.data);
      
      // 응답이 있으면 성공으로 간주 (백엔드 응답 구조가 다양할 수 있음)
      if (response.data) {
        // 성공 상태 설정
        setLetterSuccess(true);
        
        // 응답 데이터 로깅
        console.log('편지 작성 성공으로 간주:', response.data);
        
        // letterId가 있는 경우 자동으로 목록 업데이트
        if (response.data.letterId && fundingData) {
          try {
            // 새 편지를 letters 배열 앞에 추가
            const updatedLetters = [
              {
                letterId: response.data.letterId,
                funding: Number(fundingId),
                user: response.data.user,
                comment: response.data.comment,
                image: response.data.image,
                access: response.data.access,
                createdAt: response.data.createdAt,
                updatedAt: response.data.updatedAt
              },
              ...fundingData.letters
            ];
            
            // 업데이트된 fundingData 설정
            setFundingData({
              ...fundingData,
              letters: updatedLetters,
              participantsNumber: fundingData.participantsNumber + 1
            });
            
            console.log('편지 목록 자동 업데이트 완료');
          } catch (updateError) {
            console.error('편지 목록 업데이트 중 오류:', updateError);
            // 자동 업데이트 실패 시 전체 데이터 다시 로드
            fetchFundingDetail();
          }
        } else {
          // 응답에 letterId가 없는 경우 전체 데이터 다시 로드
          console.log('응답에 letterId가 없어 전체 데이터 다시 로드');
          fetchFundingDetail();
        }
        
        // 폼 초기화
        setLetterComment('');
        setLetterAccess('공개');
        setLetterImage(null);
        setLetterImagePreview(null);
        
        // 3초 후 성공 메시지 숨기기
        setTimeout(() => {
          setLetterSuccess(false);
        }, 3000);
      } else {
        // 응답 데이터가 없는 경우에만 에러 표시
        console.error('편지 작성 응답에 데이터가 없음:', response);
        setLetterError('편지 작성에 실패했습니다. 응답 데이터가 없습니다.');
      }
    } catch (err: any) {
      console.error('편지 작성 중 오류:', err);
      
      // 자세한 오류 정보 로깅
      if (err.response) {
        console.error('응답 상태:', err.response.status);
        console.error('응답 데이터:', err.response.data);
      }
      
      setLetterError(err.response?.data?.message || '편지 작성 중 오류가 발생했습니다.');
    } finally {
      setIsLetterSubmitting(false);
    }
  };

  // 상품 구매 페이지로 이동하는 함수
  const navigateToOrderPage = useCallback(() => {
    if (!fundingData || !fundingData.product) return;
    
    // 100% 달성된 경우에만 구매 가능
    if (!isFundingCompleted) {
      alert('펀딩이 100% 달성된 경우에만 상품 구매가 가능합니다.');
      return;
    }
    
    // 이미 shipping 상태인 경우 추가 처리 없이 리턴
    if (fundingData.status === 'shipping') {
      alert('이미 상품 주문이 완료되었습니다.');
      return;
    }
    
    // 펀딩 상품 주문 페이지로 이동
    navigate(`/funding/order/${fundingData.product.id}`, {
      state: {
        product: fundingData.product,
        isFundingProduct: true, // 펀딩으로 구매된 상품임을 표시
        totalAmount: 0, // 펀딩 금액이 100% 달성되었으므로 결제 금액 0원
        fundingId: fundingData.fundingId, // 펀딩 ID 전달
      }
    });
  }, [fundingData, navigate, isFundingCompleted]);

  // 후기 작성 페이지로 이동하는 함수 추가
  const navigateToReviewPage = useCallback(() => {
    if (!fundingData) return;
    
    // 100% 달성된 경우에만 후기 작성 가능
    if (!isFundingCompleted) {
      alert('펀딩이 100% 달성된 경우에만 후기 작성이 가능합니다.');
      return;
    }
    
    // 이미 후기를 작성한 경우 처리
    if (hasWrittenReview) {
      alert('이미 후기를 작성하셨습니다. 각 펀딩당 한 번만 후기 작성이 가능합니다.');
      return;
    }
    
    // 후기가 있는 경우 후기 리스트 페이지로, 없는 경우 작성 페이지로 이동
    if (fundingData.reviews && fundingData.reviews.length > 0) {
      // 후기 리스트 페이지로 이동
      navigate('/funding/review');
    } else {
      // 후기 작성 페이지로 이동 (returnUrl 추가)
      navigate(`/funding/review/write?fundingId=${fundingData.fundingId}&returnUrl=${encodeURIComponent(`/funding/${fundingData.fundingId}?review_complete=true`)}`);
      
      // 후기 작성 완료 상태는 후기 작성 페이지에서 작성 완료 후 설정
    }
  }, [fundingData, navigate, isFundingCompleted, hasWrittenReview]);

  // 수정 모달 표시 함수
  const openEditModal = () => {
    if (!fundingData) return;
    
    // 폼 데이터 초기화
    setEditFormData({
      title: fundingData.title,
      description: fundingData.description,
      category: fundingData.category,
      scope: fundingData.scope,
      toDelete: []
    });
    
    // 모달 표시
    setShowEditModal(true);
  };
  
  // 폼 데이터 변경 핸들러
  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // 펀딩 수정 처리 함수
  const handleUpdateFunding = async () => {
    if (!fundingId || !fundingData) {
      alert('펀딩 정보를 찾을 수 없습니다.');
      return;
    }
    
    try {
      setEditLoading(true);
      const baseUrl = import.meta.env.VITE_BASE_URL || import.meta.env.VITE_API_BASE_URL || 'https://j12d107.p.ssafy.io/api';
      
      // 토큰 가져오기
      const token = localStorage.getItem('auth_token') || 
                   localStorage.getItem('access_token') ||
                   localStorage.getItem('token') ||
                   localStorage.getItem('accessToken');
                   
      if (!token) {
        alert('로그인이 필요합니다.');
        setEditLoading(false);
        return;
      }
      
      // FormData 생성
      const formData = new FormData();
      
      // JSON 데이터 추가
      formData.append('data', new Blob([JSON.stringify(editFormData)], { type: 'application/json' }));
      
      // API 호출
      const response = await axios.post(
        `${baseUrl}/fundings/${fundingId}`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      console.log('펀딩 수정 응답:', response);
      
      // 수정 성공 처리
      alert('펀딩이 성공적으로 수정되었습니다.');
      
      // 모달 닫기
      setShowEditModal(false);
      
      // 페이지 새로고침
      fetchFundingDetail();
    } catch (error) {
      console.error('펀딩 수정 중 오류:', error);
      
      // 오류 세부 정보 확인
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 403) {
          alert('펀딩 수정 권한이 없습니다.');
        } else {
          alert(`펀딩 수정 중 오류가 발생했습니다: ${error.response?.data?.message || error.message}`);
        }
      } else {
        alert('펀딩 수정 중 알 수 없는 오류가 발생했습니다.');
      }
    } finally {
      setEditLoading(false);
    }
  };

  // 펀딩 삭제 처리 함수 추가
  const handleDeleteFunding = async () => {
    if (!fundingId || !fundingData) {
      alert('펀딩 정보를 찾을 수 없습니다.');
      return;
    }

    try {
      setIsLoading(true);
      const baseUrl = import.meta.env.VITE_BASE_URL || import.meta.env.VITE_API_BASE_URL || 'https://j12d107.p.ssafy.io/api';
      
      // 토큰 가져오기
      const token = localStorage.getItem('auth_token') || 
                   localStorage.getItem('access_token') ||
                   localStorage.getItem('token') ||
                   localStorage.getItem('accessToken');
                   
      if (!token) {
        alert('로그인이 필요합니다.');
        setIsLoading(false);
        return;
      }
      
      // 삭제 API 호출
      const response = await axios.delete(
        `${baseUrl}/fundings/${fundingId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('펀딩 삭제 응답:', response);
      
      // 삭제 성공 처리
      alert('펀딩이 성공적으로 삭제되었습니다.');
      navigate('/funding/list');
    } catch (error) {
      console.error('펀딩 삭제 중 오류:', error);
      
      // 오류 세부 정보 확인
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 403) {
          alert('펀딩 삭제 권한이 없습니다.');
        } else {
          alert(`펀딩 삭제 중 오류가 발생했습니다: ${error.response?.data?.message || error.message}`);
        }
      } else {
        alert('펀딩 삭제 중 알 수 없는 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
      setShowDeleteConfirmModal(false);
    }
  };

  // 삭제 확인 모달 표시 함수
  const showDeleteConfirmation = () => {
    setShowDeleteConfirmModal(true);
  };

  // 펀딩 환불 처리 함수 추가
  const handleFundingRefund = async () => {
    if (!fundingId || !fundingData) {
      alert('펀딩 정보를 찾을 수 없습니다.');
      return;
    }

    // 이미 완료된 펀딩인지 확인
    if (isStatusCompleted) {
      alert('이미 완료된 펀딩입니다.');
      return;
    }

    // 펀딩 달성률이 50% 이상인 경우 경고 (50% 미만일 때만 환불 가능)
    if (isHalfCompleted) {
      alert('펀딩 달성률이 50% 미만인 경우에만 환불이 가능합니다.');
      return;
    }

    try {
      setIsLoading(true);
      const baseUrl = import.meta.env.VITE_BASE_URL || import.meta.env.VITE_API_BASE_URL || 'https://j12d107.p.ssafy.io/api';
      
      // 토큰 확인
      const token = localStorage.getItem('auth_token') || 
                   localStorage.getItem('access_token') ||
                   localStorage.getItem('token') ||
                   localStorage.getItem('accessToken');
                   
      if (!token) {
        alert('로그인이 필요합니다.');
        setIsLoading(false);
        return;
      }
      
      // 환불 확인 모달
      const isConfirmed = window.confirm(
        `현재 모금액 ${fundingData.fundedAmount.toLocaleString()}원(${fundingPercentage}%)을 환불 처리하시겠습니까?\n펀딩에 참여한 모든 사용자의 금액이 환불됩니다.`
      );
      
      if (!isConfirmed) {
        setIsLoading(false);
        return;
      }
      
      // 펀딩 환불 API 호출
      const response = await axios.post(
        `${baseUrl}/transfer/${fundingId}/refund`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('펀딩 환불 처리 응답:', response.data);
      
      if (response.data.code === 'SUCCESS') {
        alert('펀딩이 성공적으로 환불 처리되었습니다. 모든 참여자에게 금액이 환불되었습니다.');
        // 페이지 새로고침 - API에서 최신 상태 가져오기
        fetchFundingDetail();
      } else {
        alert(`펀딩 환불 처리 중 오류가 발생했습니다: ${response.data.message || '알 수 없는 오류'}`);
      }
    } catch (error) {
      console.error('펀딩 환불 처리 중 오류:', error);
      
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 403) {
          alert('펀딩 환불 처리 권한이 없습니다.');
        } else {
          alert(`펀딩 환불 처리 중 오류가 발생했습니다: ${error.response?.data?.message || error.message || '알 수 없는 오류'}`);
        }
      } else {
        alert('펀딩 환불 처리 중 알 수 없는 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 펀딩 성공 처리 함수 추가
  const handleFundingSuccess = async () => {
    if (!fundingId || !fundingData) {
      alert('펀딩 정보를 찾을 수 없습니다.');
      return;
    }

    // 이미 완료된 펀딩인지 확인
    if (isStatusCompleted) {
      alert('이미 완료된 펀딩입니다.');
      return;
    }

    // 50% 미만인 경우 경고
    if (!isHalfCompleted) {
      alert('펀딩이 최소 50% 이상 달성되어야 성공 처리가 가능합니다.');
      return;
    }

    try {
      setIsLoading(true);
      const baseUrl = import.meta.env.VITE_BASE_URL || import.meta.env.VITE_API_BASE_URL || 'https://j12d107.p.ssafy.io/api';
      
      // 토큰 확인
      const token = localStorage.getItem('auth_token') || 
                   localStorage.getItem('access_token') ||
                   localStorage.getItem('token') ||
                   localStorage.getItem('accessToken');
                   
      if (!token) {
        alert('로그인이 필요합니다.');
        setIsLoading(false);
        return;
      }
      
      // 성공 확인 모달
      const isConfirmed = window.confirm(
        `현재 모금액 ${fundingData.fundedAmount.toLocaleString()}원(${fundingPercentage}%)으로 펀딩을 성공 처리하시겠습니까?\n모금된 금액은 기뷰페이로 이체됩니다.`
      );
      
      if (!isConfirmed) {
        setIsLoading(false);
        return;
      }
      
      // 펀딩 성공 API 호출
      const response = await axios.post(
        `${baseUrl}/transfer/${fundingId}/success`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('펀딩 성공 처리 응답:', response.data);
      
      if (response.data.code === 'SUCCESS') {
        alert('펀딩이 성공적으로 처리되었습니다. 모금액이 기뷰페이로 이체되었습니다.');
        // 페이지 새로고침 - API에서 최신 상태 가져오기
        fetchFundingDetail();
      } else {
        alert(`펀딩 성공 처리 중 오류가 발생했습니다: ${response.data.message || '알 수 없는 오류'}`);
      }
    } catch (error) {
      console.error('펀딩 성공 처리 중 오류:', error);
      
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 403) {
          alert('펀딩 성공 처리 권한이 없습니다.');
        } else {
          alert(`펀딩 성공 처리 중 오류가 발생했습니다: ${error.response?.data?.message || error.message || '알 수 없는 오류'}`);
        }
      } else {
        alert('펀딩 성공 처리 중 알 수 없는 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 로딩 중 표시
  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6 flex justify-center items-center h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">펀딩 정보를 불러오는 중입니다...</p>
        </div>
      </div>
    );
  }

  // 에러 표시
  if (error && !fundingData) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error || '펀딩 정보를 불러올 수 없습니다.'}</p>
          <button 
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-black text-white rounded-lg"
          >
            이전 페이지로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  // 펀딩 데이터가 없는 경우 (이미 위에서 에러 처리했으므로 여기까지 오지 않겠지만 안전장치)
  if (!fundingData) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p>펀딩 정보를 불러올 수 없습니다.</p>
          <button 
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-black text-white rounded-lg"
          >
            이전 페이지로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto py-8 px-4 relative">
      {/* 100% 달성 축하 메시지 */}
      {isCompleted && (
        <div className="fixed top-0 left-0 w-full bg-purple-600 text-white py-2 text-center z-40 animate-pulse">
          <span className="font-bold">축하합니다! 펀딩 목표가 달성되었습니다! 🎉</span>
        </div>
      )}
      
      {/* 100% 달성 & 생성자인 경우 상품 구매 버튼 표시 - 상단 버튼 제거하고 하단에만 유지 */}
      
      {/* 잔액 정보 표시 섹션 */}
      <div className="mb-6 bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 flex justify-between items-center bg-gray-50">
          <h2 className="text-lg font-semibold">내 잔액 정보</h2>
          <button 
            onClick={fetchBalanceInfo} 
            className="px-3 py-1.5 bg-black text-white rounded-md text-sm hover:bg-gray-800 transition"
            disabled={balanceLoading}
          >
            {balanceLoading ? '로딩 중...' : '잔액 조회'}
          </button>
        </div>
        
        {showBalanceInfo && (
          <div className="p-4">
            <div className="mb-2">
              <span className="font-semibold">GIVU Pay 잔액:</span> 
              <span className="ml-2 text-primary-color">{balanceInfo.givuPayBalance.toLocaleString()} 원</span>
            </div>
            
            {balanceInfo.accountNumber !== null ? (
              <div>
                <span className="font-semibold">연동 계좌 잔액:</span>
                <span className="ml-2">{(balanceInfo.bankBalance || 0).toLocaleString()} 원</span>
                {balanceInfo.accountNumber && (
                  <span className="ml-2 text-xs text-gray-500">
                    ({balanceInfo.accountNumber.replace(/(\d{4})(\d{4})(\d{4})(\d*)/, '$1-$2-$3-$4')})
                  </span>
                )}
              </div>
            ) : (
              <div className="text-sm text-gray-500">
                연동된 계좌가 없습니다. 마이페이지에서 계좌를 연동해 주세요.
              </div>
            )}
          </div>
        )}
      </div>

      {/* 이미지 슬라이더 섹션 */}
      <div className="relative mb-6 bg-gray-100 rounded-lg overflow-hidden">
        <div className="h-[400px] flex items-center justify-center">
          <img
            src={fundingData.product?.image || fundingData.image || "/src/assets/images/default-finding-image.jpg"}
            alt={`${fundingData.title} 이미지`}
            className="max-h-full object-contain"
          />
          {/* 펀딩 완료 도장 추가 */}
          {isFundingCompleted && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-red-600 bg-opacity-80 rounded-full w-36 h-36 flex items-center justify-center transform rotate-[-20deg] border-4 border-red-700">
                <span className="text-white text-4xl font-bold">완료</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 펀딩 완료 메시지 */}
      <div className={`${fundingStatusInfo.bgColor} border ${fundingStatusInfo.borderColor} rounded-lg p-4 shadow-md mb-6`}>
          <div className="flex items-center gap-3">
          <div className={`${fundingStatusInfo.bgColor} p-2 rounded-full`}>
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${fundingStatusInfo.textColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
            <h3 className={`text-lg font-bold ${fundingStatusInfo.textColor}`}>
              펀딩 상태: {fundingStatusInfo.text}
            </h3>
            <p className={fundingStatusInfo.textColor}>
              {fundingStatusInfo.description}<br/>
              목표 금액 {fundingData.product?.price.toLocaleString()}원 중 {fundingData.fundedAmount.toLocaleString()}원이 모금되었습니다.
            </p>
            </div>
          </div>
        </div>

      {/* 펀딩 요약 정보 수정 */}
      <div className="border border-gray-200 rounded-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-xl font-bold">{fundingData.title}</h1>
          <span className="text-gray-600">{fundingData.categoryName || fundingData.category}</span>
        </div>

        <div className="flex flex-col md:flex-row justify-between mb-4">
          <div>
            <span className="text-gray-600">참여자: {fundingData.participantsNumber}명</span>
            <span className="ml-4 px-2 py-1 bg-gray-100 rounded text-sm">{fundingData.status}</span>
          </div>
          <div className="md:text-right">
            <div className="text-gray-600">
              현재 모금액: {fundingData.fundedAmount.toLocaleString()}원 ({fundingPercentage}%)
            </div>
            <div className="font-bold">
              목표 금액: {fundingData.product?.price.toLocaleString() || "설정되지 않음"}원
            </div>
          </div>
        </div>

        {/* 진행 바 */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
          <div
            className="bg-black h-2.5 rounded-full"
            style={{ width: `${fundingPercentage}%` }}
          ></div>
        </div>

        {/* 펀딩 생성자인 경우 수정/삭제 버튼 표시 */}
        {isCreator && (
          <div className="flex justify-end gap-2 mt-2">
            {/* 100% 달성한 경우, 상품 구매 버튼 표시 */}
            {isFundingCompleted && (
              <button
                onClick={navigateToOrderPage}
                className={`px-3 py-1.5 text-white rounded-md text-sm transition-colors flex items-center ${
                  hasPurchasedProduct ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'
                }`}
                disabled={hasPurchasedProduct}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {fundingData.status === 'shipping' ? '구매 완료' : '펀딩 물품 주문하기'}
              </button>
            )}
            
            {/* 100% 달성한 경우, 후기 작성 버튼 표시 */}
            {isFundingCompleted && (
              <button
                onClick={navigateToReviewPage}
                className={`px-3 py-1.5 text-white rounded-md text-sm transition-colors flex items-center ${
                  hasWrittenReview ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
                disabled={hasWrittenReview}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                {hasWrittenReview ? '후기 작성 완료' : '후기 작성'}
              </button>
            )}
            
            {/* 50% 이상 달성한 경우 펀딩 즉시 성공 처리 버튼 - 이미 성공 처리된 경우 비활성화 */}
            {isHalfCompleted && !isFundingCompleted && !isStatusCompleted && (
              <button
                onClick={handleFundingSuccess}
                className={`px-3 py-1.5 text-white rounded-md text-sm transition-colors flex items-center ${
                  isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                }`}
                disabled={isLoading}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {isLoading ? '처리 중...' : '펀딩 성공 처리'}
              </button>
            )}
            
            {/* 이미 완료된 경우 비활성화된 완료 버튼 표시 */}
            {isStatusCompleted && (
              <button
                className="px-3 py-1.5 text-white rounded-md text-sm transition-colors flex items-center bg-gray-400 cursor-not-allowed"
                disabled={true}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                펀딩 완료됨
              </button>
            )}
            
            {/* 수정/삭제 버튼은 펀딩이 완료되지 않은 경우에만 표시 */}
            {!isStatusCompleted && !isFundingCompleted && (
              <>
            <button
              onClick={openEditModal}
                  className="px-3 py-1.5 text-white rounded-md text-sm transition-colors flex items-center bg-gray-700 hover:bg-gray-800"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              수정
            </button>
            <button
              onClick={showDeleteConfirmation}
                  className="px-3 py-1.5 text-white rounded-md text-sm transition-colors flex items-center bg-red-600 hover:bg-red-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              삭제
            </button>
              </>
            )}
            
            {/* 환불 버튼 추가 - 50% 미만이고 완료되지 않은 경우에만 활성화 */}
            {!isHalfCompleted && !isStatusCompleted && !isFundingCompleted && (
              <button
                onClick={handleFundingRefund}
                className={`px-3 py-1.5 text-white rounded-md text-sm transition-colors flex items-center ${
                  isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-yellow-600 hover:bg-yellow-700'
                }`}
                disabled={isLoading}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
                환불
              </button>
            )}
          </div>
        )}
      </div>

      {/* 대상자 소개 섹션 */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4">대상자 소개</h2>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="border border-gray-200 rounded-lg p-6 md:w-1/2">
            <div className="mb-4">
              <div className="w-24 h-24 rounded-lg mb-4 overflow-hidden">
                <img 
                  src={fundingData.writer.image || "https://via.placeholder.com/200x200?text=프로필"}
                  alt={`${fundingData.writer.nickName}의 프로필`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="font-bold">{fundingData.writer.nickName}</div>
              <div className="text-gray-600">{fundingData.categoryName || fundingData.category}</div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-6 md:w-1/2">
            <h3 className="font-bold mb-4">펀딩 소개글</h3>
            <p className="text-gray-600">{fundingData.description}</p>
          </div>
        </div>
      </section>

      {/* 참여자 섹션 */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4">참여자 섹션</h2>
        <div className="border border-gray-200 rounded-lg p-6">
          <div className="mb-6">
            <h3 className="font-bold mb-4">함께하는 사람들 ({fundingData.participantsNumber}명)</h3>
          </div>

          <div>
            <h3 className="font-bold mb-4">참여자 목록</h3>
            {displayedParticipants.length > 0 ? (
            <div className="space-y-6">
                {displayedParticipants.map((letter) => (
                  <div key={letter.letterId} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full overflow-hidden">
                        <img 
                          src={letter.user.image || "https://via.placeholder.com/50x50"}
                          alt={`${letter.user.nickName}의 프로필`}
                          className="w-full h-full object-cover"
                        />
                    </div>
                      <span className="font-bold">{letter.user.nickName}</span>
                  </div>
                    <p className="text-gray-600 pl-10">{letter.comment}</p>
                    {letter.image && (
                      <div className="pl-10 mt-2">
                        <img 
                          src={letter.image} 
                          alt="편지 첨부 이미지" 
                          className="max-w-xs rounded-lg border border-gray-200"
                        />
                      </div>
                    )}
                </div>
              ))}
            </div>
            ) : (
              <p className="text-gray-500 text-center py-4">아직 참여자가 없습니다.</p>
            )}

            {fundingData.letters.length > 3 && (
              <button
                onClick={toggleParticipantsList}
                className="w-full py-2 border border-gray-200 rounded-md mt-4 text-gray-600 hover:bg-gray-50"
              >
                {showAllParticipants ? "숨기기" : "펼쳐보기"}
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 편지 작성 섹션 추가 */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4">응원 편지 남기기</h2>
        <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg p-6">
          {letterSuccess && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>편지가 성공적으로 등록되었습니다! 참여자 목록에서 확인해 보세요.</span>
            </div>
          )}

          {letterError && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
              <p>{letterError}</p>
              <p className="mt-2 text-sm">
                메시지가 표시되어도 편지가 등록되었을 수 있으니 참여자 목록을 확인해보세요.
              </p>
            </div>
          )}

          {isCompleted || isStatusCompleted ? (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">
              <p>이 펀딩은 완료 처리되어 더 이상 편지를 보낼 수 없습니다.</p>
            </div>
          ) : (
          <form onSubmit={handleLetterSubmit}>
            <div className="mb-6">
              <label htmlFor="letterComment" className="block text-sm font-bold text-gray-700 mb-2">
                응원 메시지
              </label>
              <textarea
                id="letterComment"
                value={letterComment}
                onChange={(e) => setLetterComment(e.target.value)}
                placeholder="응원의 메시지를 남겨주세요!"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                rows={4}
                maxLength={200}
              />
              <div className="text-right text-sm text-gray-500 mt-1">
                {letterComment.length}/200자
              </div>
            </div>

            <div className="mb-6">
              <p className="block text-sm font-bold text-gray-700 mb-2">
                이미지 첨부 (선택)
              </p>

              {!letterImagePreview ? (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-purple-50 transition-colors"
                >
                  <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm text-gray-500 mt-2">클릭하여 이미지 첨부하기</p>
                </div>
              ) : (
                <div className="relative">
                  <img 
                    src={letterImagePreview} 
                    alt="미리보기" 
                    className="max-h-48 rounded-lg mx-auto object-contain bg-white p-2 border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveLetterImage}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLetterImageChange}
                className="hidden"
              />
              
              <div className="text-xs text-gray-500 mt-1 pl-1">
                * JPG, PNG 파일만 업로드 가능합니다 (최대 5MB)
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                공개 설정
              </label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="letterAccess"
                    value="공개"
                    checked={letterAccess === '공개'}
                    onChange={() => setLetterAccess('공개')}
                    className="form-radio h-4 w-4 text-purple-600"
                  />
                  <span className="ml-2 text-gray-700">공개</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="letterAccess"
                    value="비밀"
                    checked={letterAccess === '비밀'}
                    onChange={() => setLetterAccess('비밀')}
                    className="form-radio h-4 w-4 text-purple-600"
                  />
                  <span className="ml-2 text-gray-700">비공개</span>
                </label>
              </div>
            </div>

            <div className="text-right">
              <button
                type="submit"
                disabled={isLetterSubmitting || letterComment.trim() === ''}
                className={`px-6 py-3 rounded-lg text-white font-bold transition-colors ${
                  isLetterSubmitting || letterComment.trim() === ''
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-purple-600 hover:bg-purple-700'
                }`}
              >
                {isLetterSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    전송 중...
                  </span>
                ) : (
                  '편지 보내기'
                )}
              </button>
            </div>
          </form>
          )}
        </div>
      </section>

      {/* 선물하기 섹션 수정 */}
      <section className="mb-10">
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-black rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold">
              <span className="text-red-500">{fundingData.writer.nickName}님</span>의<br />
              위시 펀딩 동참하기
            </h2>
          </div>

          <div className="bg-white rounded-lg p-4 mb-6">
            <div className="text-purple-600 font-bold">
              목표까지 {remainingAmount.toLocaleString()}원 남았어요
            </div>
            <div className="w-full bg-purple-100 rounded-full h-2 my-2">
              <div
                className="bg-purple-500 h-2 rounded-full"
                style={{ width: `${fundingPercentage}%` }}
              ></div>
            </div>
            <div className="text-right text-gray-600">
              목표금액 {fundingData.product?.price.toLocaleString() || "0"}원
            </div>
          </div>

          {isCompleted || isStatusCompleted ? (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">
              <p>이 펀딩은 완료 처리되어 더 이상 선물하기를 할 수 없습니다.</p>
            </div>
          ) : (
            <>
          {/* 오류 메시지 표시 */}
          {amountError && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{amountError}</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {GIFT_OPTIONS.map((option) => (
              <button
                key={option.amount}
                onClick={() => selectAmount(option.amount)}
                className={`p-4 rounded-lg text-white flex flex-col items-start ${
                  selectedAmount === option.amount && !isCustomInput 
                    ? 'bg-gray-800' 
                    : 'bg-black'
                }`}
              >
                <span className="font-bold text-lg mb-2">{option.label}</span>
                <span className="text-sm">{option.description}</span>
              </button>
            ))}
          </div>

          {/* 직접 입력 필드 추가 */}
          {isCustomInput && (
            <div className="mb-6">
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  금액을 직접 입력해주세요
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                    placeholder="금액을 입력하세요"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                    원
                  </span>
                </div>
                {customAmount && (
                  <p className="mt-2 text-sm text-gray-600">
                    {parseInt(customAmount).toLocaleString()}원을 선물합니다
                  </p>
                )}
              </div>
            </div>
          )}

          <button 
            onClick={handleGiftClick}
            className={`w-full py-3 text-white font-bold rounded-lg transition ${
              (selectedAmount || (isCustomInput && customAmount)) && !amountError
                ? 'bg-black hover:bg-gray-800' 
                : 'bg-gray-400 cursor-not-allowed'
            }`}
            disabled={!selectedAmount && (!isCustomInput || !customAmount) || !!amountError}
          >
            {selectedAmount ? 
              `${selectedAmount.toLocaleString()}원 선물하기` : 
              '선물하기'
            }
          </button>
            </>
          )}
        </div>
      </section>

      {/* 안내사항 섹션 */}
      <section className="mb-6">
        <div className="space-y-6 text-sm">
          <div>
            <h3 className="font-bold flex items-center">
              <span className="text-red-500 mr-1">✓</span> 펀딩 참여 안내
            </h3>
            <ul className="ml-4 mt-2 space-y-1 list-disc text-gray-600">
              <li>펀딩에 참여하시면 GIVU 페이로 결제가 진행됩니다</li>
              <li>펀딩 목표 금액 달성 시, 마이페이지 내 펀딩 목록에서 상품 구매를 진행할 수 있습니다.</li>
              <li>펀딩 참여 내역은 마이페이지에서 확인하실 수 있습니다</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold flex items-center">
              <span className="text-yellow-500 mr-1">💰</span> GIVU 페이 안내
            </h3>
            <ul className="ml-4 mt-2 space-y-1 list-disc text-gray-600">
              <li>펀딩 참여 시 GIVU 페이 잔액이 부족할 경우, 충전 후 참여가 가능합니다</li>
              <li>펀딩 참여 시 참여하신 금액은 GIVU 페이로 차감 완료됩니다</li>
              <li>GIVU 페이 충전 금액의 환불은 고객센터를 통해 가능합니다</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold flex items-center">
              <span className="text-orange-500 mr-1">🎁</span> 선물 관련 안내
            </h3>
            <ul className="ml-4 mt-2 space-y-1 list-disc text-gray-600">
              <li>목표 금액 달성 시 GIVU 자사몰에 등록된 상품으로 구매가 진행됩니다</li>
              <li>선물 수령자의 주소지로 배송이 이루어집니다</li>
              <li>상품 하자 및 오배송의 경우 교환/반품이 가능합니다</li>
              <li>단순 변심에 의한 교환/반품은 불가합니다</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold flex items-center">
              <span className="text-red-500 mr-1">❌</span> 펀딩 취소 안내
            </h3>
            <ul className="ml-4 mt-2 space-y-1 list-disc text-gray-600">
              <li>펀딩 달성률에 따라 취소 정책이 달라집니다.
                <br />(50% 이하 → 참여자 환불 / 50% 이상 → 정상자 GIVU 페이 증정)</li>
              <li>목표 금액 달성 후에는 취소가 불가합니다</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold flex items-center">
              <span className="text-yellow-500 mr-1">⚠</span> 교환/반품이 불가능한 경우
            </h3>
            <ul className="ml-4 mt-2 space-y-1 list-disc text-gray-600">
              <li>선물 수령자가 상품을 사용하거나 훼손한 경우</li>
              <li>상품의 포장을 개봉하여 가치가 하락한 경우</li>
              <li>시간 경과로 재판매가 어려울 정도로 상품 가치가 하락한 경우</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold flex items-center">
              <span className="text-gray-500 mr-1">📞</span> 고객 지원
            </h3>
            <ul className="ml-4 mt-2 space-y-1 list-disc text-gray-600">
              <li>펀딩 관련 문의: 채널톡 상담</li>
              <li>상품 관련 문의: GIVU 고객센터</li>
              <li>운영시간: 평일 10:00 - 18:00 (주말/공휴일 제외)</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 푸터 안내 */}
      <footer className="text-center text-sm text-gray-500 mt-10 pb-6">
        <p>모든 펀딩 정보는 실제 정보와 다를 수 있습니다.</p>
        <p className="mt-1">© 2025 GIVU. All rights reserved.</p>
      </footer>

      {/* 펀딩 환불 처리 완료 시 하단에 고정된 버튼 표시 */}
      {isCreator && isCompleted && (
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 shadow-lg z-40">
          <div className="max-w-3xl mx-auto flex justify-between items-center">
            <div>
              <h3 className="font-bold text-lg text-gray-800">펀딩 완료! 🎉</h3>
              <p className="text-gray-600">환불 처리가 완료되었습니다.</p>
            </div>
            <div className="flex gap-3">
              {fundingData.reviews?.length > 0 ? (
                  <button
                    onClick={navigateToReviewPage}
                    className="px-6 py-3 text-white font-bold rounded-lg transition-colors shadow-sm flex items-center bg-purple-600 hover:bg-purple-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  후기 보기
                  </button>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* 비밀번호 확인 모달 추가 */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">결제 비밀번호 확인</h3>
            <p className="mb-4 text-gray-600">
              GIVU Pay 결제를 위해 비밀번호를 입력해주세요.
            </p>
            
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                결제 비밀번호
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={handlePasswordChange}
                onKeyPress={handlePasswordKeyPress}
                placeholder="비밀번호를 입력하세요"
                className={`w-full px-3 py-2 border rounded-md ${
                  passwordError ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                autoFocus
              />
              {passwordError && (
                <p className="mt-1 text-sm text-red-500">{passwordError}</p>
              )}
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={handlePasswordCancel}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={processPayment}
                disabled={!password.trim() || isLoading}
                className={`px-4 py-2 rounded-md text-white ${
                  !password.trim() || isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-purple-600 hover:bg-purple-700'
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    확인 중...
                  </span>
                ) : (
                  '결제 확인'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 펀딩 삭제 확인 모달 추가 */}
      {showDeleteConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4 text-red-600">펀딩 삭제 확인</h3>
            <div className="mb-6">
              <p className="mb-2 text-gray-700">
                정말로 이 펀딩을 삭제하시겠습니까?
              </p>
              <p className="text-gray-500 text-sm">
                삭제된 펀딩은 복구할 수 없으며, 관련된 모든 데이터가 영구적으로 삭제됩니다.
              </p>
              {fundingData && fundingData.participantsNumber > 0 && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-yellow-700 text-sm">
                    <span className="font-bold">주의!</span> 이 펀딩에는 이미 {fundingData.participantsNumber}명이 참여하고 있습니다.
                    삭제하면 참여자들의 데이터도 함께 삭제됩니다.
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirmModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={handleDeleteFunding}
                disabled={isLoading}
                className={`px-4 py-2 rounded-md text-white ${
                  isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    삭제 중...
                  </span>
                ) : (
                  '펀딩 삭제'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 펀딩 수정 모달 추가 */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">펀딩 정보 수정</h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  펀딩 제목
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={editFormData.title}
                  onChange={handleEditFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  펀딩 설명
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={editFormData.description}
                  onChange={handleEditFormChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                />
              </div>
              
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  카테고리
                </label>
                <select
                  id="category"
                  name="category"
                  value={editFormData.category}
                  onChange={handleEditFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="생일">생일</option>
                  <option value="결혼">결혼</option>
                  <option value="집들이">집들이</option>
                  <option value="기념일">기념일</option>
                  <option value="기타">기타</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="scope" className="block text-sm font-medium text-gray-700 mb-1">
                  공개 범위
                </label>
                <select
                  id="scope"
                  name="scope"
                  value={editFormData.scope}
                  onChange={handleEditFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="공개">공개</option>
                  <option value="비공개">비공개</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={handleUpdateFunding}
                disabled={editLoading}
                className={`px-4 py-2 rounded-md text-white ${
                  editLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-purple-600 hover:bg-purple-700'
                }`}
              >
                {editLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    저장 중...
                  </span>
                ) : (
                  '저장하기'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 관리자 버튼 섹션 - 펀딩 완료 상태(isStatusCompleted)에 따라 표시 여부 결정 */}
      {isCreator && !isStatusCompleted && !isFundingCompleted && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-lg font-bold mb-3">펀딩 관리</h3>
          <div className="flex flex-wrap gap-2">
            {/* 편집 버튼 */}
            <button
              onClick={openEditModal}
              className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              펀딩 정보 수정
            </button>
            
            {/* 삭제 버튼 */}
            <button
              onClick={showDeleteConfirmation}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              펀딩 삭제
            </button>
            
            {/* 펀딩 50% 이상인 경우에만 성공 처리 버튼 표시 */}
            {isHalfCompleted && (
              <button
                onClick={handleFundingSuccess}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                펀딩 성공 처리
              </button>
            )}
            
            {/* 펀딩 50% 미만인 경우에만 환불 버튼 표시 */}
            {!isHalfCompleted && (
              <button
                onClick={handleFundingRefund}
                className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
              >
                펀딩 환불 처리
              </button>
            )}
          </div>
          <p className="mt-2 text-sm text-gray-500">
            {isHalfCompleted 
              ? "펀딩 성공 처리 시 모금액이 기뷰페이로 이체됩니다." 
              : "환불 처리 시 펀딩에 참여한 모든 사용자에게 금액이 환불됩니다."}
          </p>
        </div>
      )}
      
      {/* 100% 달성 시 버튼 섹션 */}
      {isCreator && isFundingCompleted && (
        <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <h3 className="text-lg font-bold mb-3 text-green-800">펀딩 달성 완료</h3>
          <p className="text-green-700 mb-4">
            축하합니다! 펀딩 목표 금액의 100%를 달성했습니다. 이제 상품을 구매하거나 후기를 작성할 수 있습니다.
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={navigateToOrderPage}
              className={`px-4 py-2 text-white rounded-md transition-colors flex items-center ${
                hasPurchasedProduct ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'
              }`}
              disabled={hasPurchasedProduct}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {fundingData.status === 'shipping' ? '구매 완료' : '펀딩 물품 주문하기'}
            </button>
            <button
              onClick={navigateToReviewPage}
              className={`px-4 py-2 text-white rounded-md transition-colors flex items-center ${
                hasWrittenReview ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
              disabled={hasWrittenReview}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              {hasWrittenReview ? '후기 작성 완료' : '후기 작성하기'}
            </button>
          </div>
        </div>
      )}
      
      {/* 펀딩이 성공 처리되거나 환불된 경우 안내 메시지 */}
      {isCreator && isStatusCompleted && (
        <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
          <h3 className="text-lg font-bold mb-2 text-purple-800">펀딩 완료됨</h3>
          <p className="text-purple-700">
            이 펀딩은 이미 완료 처리되었습니다. 더 이상 수정이나 관리 작업을 수행할 수 없습니다.
          </p>
        </div>
      )}
    </main>
  );
};

export default FundingDetailPage;
