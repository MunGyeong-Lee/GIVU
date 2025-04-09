import axios from 'axios';

// API Base URL
const API_BASE_URL = import.meta.env.VITE_BASE_URL;
console.log('API 기본 URL:', API_BASE_URL); // 실제 사용되는 URL 확인

// 토큰 가져오기 함수
const getAuthToken = () => {
  return localStorage.getItem('auth_token') || 
         localStorage.getItem('access_token') || 
         localStorage.getItem('token') ||
         localStorage.getItem('accessToken');
};

// 펀딩 생성 요청 데이터 타입 정의
export interface CreateFundingData {
  title: string;
  productId: string;
  description: string;
  category: string;
  categoryName?: string | null;
  scope: string; // "공개" 또는 "친구"
}

// 펀딩 생성 응답 타입 정의
export interface CreateFundingResponse {
  fundingId: number;
  user: {
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
  title: string;
  description: string;
  category: string;
  categoryName: string;
  scope: string;
  participantsNumber: number;
  fundedAmount: number;
  status: string;
  image: string[];
  createdAt: string;
  updatedAt: string;
}

// 펀딩 결제 응답 타입 정의
export interface FundingPaymentResponse {
  code: string;
  message: string;
  data: {
    paymentId: number;
    userId: number;
    fundingId: number;
    productId: number;
    amount: number;
    transactionType: string;
    status: string;
    date: string;
  }
}

/**
 * 펀딩 생성 API 호출 함수
 * 
 * @param fundingData 펀딩 데이터 객체
 * @param mainImage 메인 이미지 URL 또는 base64 문자열
 * @param additionalImages 추가 이미지 URL 또는 base64 문자열 배열
 * @returns 생성된 펀딩 정보
 */
export const createFunding = async (
  fundingData: CreateFundingData,
  // mainImage: string,
  additionalImages?: string[]
): Promise<CreateFundingResponse> => {
  try {
    // 토큰 확인
    const token = getAuthToken();
    if (!token) {
      throw new Error('인증 토큰이 없습니다. 로그인이 필요합니다.');
    }

    // API URL 로깅
    const apiUrl = `${API_BASE_URL}/fundings`;
    console.log('펀딩 생성 API 호출 URL:', apiUrl);
    console.log('펀딩 데이터:', fundingData);
    console.log('인증 토큰:', token.substring(0, 10) + '...');
    
    // FormData 객체 생성
    const formData = new FormData();
    
    // categoryName이 null일 경우 해당 필드 제거
    const requestData = { ...fundingData };
    if (requestData.categoryName === null) {
      requestData.categoryName = ''; // null 대신 빈 문자열로 전송
    }
    
    // data 필드에 JSON 문자열로 변환된 펀딩 데이터 추가
    formData.append('data', JSON.stringify(requestData));
    
    // 추가 이미지 처리 - 문자열 대신 파일로 변환
    if (additionalImages && additionalImages.length > 0) {
      let validImagesCount = 0;
      
      for (let i = 0; i < additionalImages.length; i++) {
        const img = additionalImages[i];
        if (img && img.startsWith('data:')) {
          try {
            // base64 문자열을 Blob으로 변환
            const imageBlob = await fetch(img).then(r => r.blob());
            // 이미지 MIME 타입 확인
            const mimeType = imageBlob.type || 'image/jpeg';
            const imageFile = new File([imageBlob], `additional-image-${i}.jpg`, { type: mimeType });
            formData.append('image', imageFile);
            validImagesCount++;
            console.log(`추가 이미지 ${i} 추가됨:`, imageFile.name, imageFile.type, imageFile.size);
          } catch (imageError) {
            console.error(`추가 이미지 ${i} 처리 오류:`, imageError);
          }
        }
      }
      
      console.log(`${validImagesCount}개의 추가 이미지 추가됨`);
    }
    
    // API 요청 로깅
    console.log('FormData 키:', Array.from(formData.keys()));
    console.log('이미지 갯수:', formData.getAll('image').length);
    
    // API 요청 전송 전 요청 정보 로깅
    console.log('API 요청 헤더:', {
      'Content-Type': 'multipart/form-data',
    });
    
    // API 요청 전송
    const response = await axios.post(
      apiUrl,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
        // 디버깅을 위해 타임아웃 설정
        timeout: 30000, // 30초
      }
    );
    
    console.log('API 응답 완료:', response.status, response.statusText);
    console.log('API 응답 데이터:', response.data);
    
    return response.data;
  } catch (error: any) {
    // 토큰 관련 오류 처리 추가
    if (error.response?.status === 403) {
      console.error('인증 오류 (403):', error.response.data);
      throw new Error('인증이 만료되었거나 유효하지 않습니다. 다시 로그인해주세요.');
    }
    
    // 더 자세한 오류 정보 출력
    console.error('펀딩 생성 중 오류 발생:', error);
    if (error.response) {
      // 서버 응답이 있는 경우
      console.error('서버 응답:', error.response.status, error.response.statusText);
      console.error('응답 데이터:', error.response.data);
      console.error('응답 헤더:', error.response.headers);
    } else if (error.request) {
      // 요청은 보냈으나 응답이 없는 경우
      console.error('요청 정보:', error.request);
      console.error('응답 없음 (서버에 도달하지 못함)');
    } else {
      // 요청 설정 중 오류 발생
      console.error('요청 설정 오류:', error.message);
    }
    console.error('요청 설정:', error.config);
    
    throw error;
  }
};

/**
 * 펀딩 결제 API 호출 함수
 * 펀딩에 참여하여 금액을 지불합니다 (기뷰페이 -> 펀딩)
 * 
 * @param fundingId 펀딩 ID
 * @param amount 결제 금액
 * @returns 결제 정보 응답
 */
export const makeFundingPayment = async (
  fundingId: number | string,
  amount: number
): Promise<FundingPaymentResponse> => {
  try {
    // 토큰 확인 - 다양한 키 이름 지원
    const token = getAuthToken();
    if (!token) {
      throw new Error('인증 토큰이 없습니다. 로그인이 필요합니다.');
    }

    // 금액 유효성 검사 및 정수 변환
    if (typeof amount !== 'number' || amount <= 0) {
      throw new Error('결제 금액은 0보다 큰 숫자여야 합니다.');
    }
    
    // 정수로 변환 (소수점 절사)
    const intAmount = Math.floor(amount);
    
    // API URL
    const apiUrl = `${API_BASE_URL}/fundings/${fundingId}/transfer`;
    console.log('펀딩 결제 API 호출 URL:', apiUrl);
    
    // 백엔드에서 요구하는 형식으로 JSON 데이터 구성
    const requestData = {
      amount: intAmount
    };
    
    console.log('펀딩 결제 요청 데이터:', JSON.stringify(requestData));
    
    // API 요청 전송
    const response = await axios.post(
      apiUrl,
      requestData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    console.log('펀딩 결제 API 응답 상태:', response.status, response.statusText);
    console.log('펀딩 결제 API 응답 데이터:', response.data);
    
    // 응답 검증
    if (response.data && response.data.code === 'SUCCESS') {
      return response.data;
    } else {
      throw new Error(response.data?.message || '결제 처리 중 오류가 발생했습니다.');
    }
  }
  
  catch (error: any) {
    console.error('펀딩 결제 API 호출 오류:', error);
    
    if (error.response) {
      console.error('응답 상태:', error.response.status);
      console.error('응답 데이터:', error.response.data);
      
      if (error.response.status === 400) {
        throw new Error(error.response.data?.message || '잘못된 요청입니다. 금액을 확인해주세요.');
      } else if (error.response.status === 401) {
        throw new Error('로그인이 필요합니다.');
      } else if (error.response.status === 403) {
        throw new Error('권한이 없습니다.');
      } else if (error.response.status === 404) {
        throw new Error('펀딩을 찾을 수 없습니다.');
      } else if (error.response.data?.message) {
        throw new Error(error.response.data.message);
      }
    }
    
    throw new Error('결제 처리 중 오류가 발생했습니다.');
  }
};

/**
 * 펀딩 결제 현황 조회 API 호출 함수
 * 
 * @param paymentId 결제 ID
 * @returns 결제 현황 정보
 */
export const getFundingPaymentStatus = async (paymentId: number | string) => {
  try {
    // 토큰 확인
    const token = getAuthToken();
    if (!token) {
      throw new Error('인증 토큰이 없습니다. 로그인이 필요합니다.');
    }
    
    // API URL
    const apiUrl = `${API_BASE_URL}/fundings/${paymentId}/transfer`;
    console.log('펀딩 결제 현황 조회 API 호출 URL:', apiUrl);
    
    // API 요청 전송
    const response = await axios.get(
      apiUrl,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    console.log('펀딩 결제 현황 API 응답 상태:', response.status, response.statusText);
    console.log('펀딩 결제 현황 API 응답 데이터:', response.data);
    
    // 응답 검증
    if (response.data && response.data.code === 'SUCCESS') {
      return response.data.data;
    } else {
      throw new Error(response.data?.message || '결제 현황 조회 중 오류가 발생했습니다.');
    }
  } catch (error: any) {
    console.error('펀딩 결제 현황 조회 API 호출 오류:', error);
    
    if (error.response) {
      console.error('응답 상태:', error.response.status);
      console.error('응답 데이터:', error.response.data);
      
      if (error.response.status === 404) {
        throw new Error('결제 정보를 찾을 수 없습니다.');
      } else if (error.response.data?.message) {
        throw new Error(error.response.data.message);
      }
    }
    
    throw new Error('결제 현황 조회 중 오류가 발생했습니다.');
  }
}; 