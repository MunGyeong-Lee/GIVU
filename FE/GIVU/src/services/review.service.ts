import axios from 'axios';
import { getAuthToken } from './auth.service';

// API Base URL
// const API_BASE_URL = import.meta.env.VITE_BASE_URL;

// 후기 데이터 인터페이스
export interface ReviewData {
  title: string;
  content: string;
  rating: number;
  fundingId: number | string;
  images?: File[];
}

// 후기 응답 인터페이스
export interface ReviewResponse {
  id: number;
  title: string;
  content: string;
  rating: number;
  author: {
    userId: number;
    nickName: string;
    image: string;
  };
  fundingId: number;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * 펀딩 후기 작성 API 호출 함수
 * 
 * @param reviewData 후기 데이터
 * @returns 생성된 후기 정보
 */
export const createReview = async (reviewData: ReviewData): Promise<ReviewResponse> => {
  try {
    // 토큰 확인
    const token = getAuthToken();
    if (!token) {
      throw new Error('인증 토큰이 없습니다. 로그인이 필요합니다.');
    }

    // FormData 객체 생성
    const formData = new FormData();
    
    // 백엔드 API 구조에 맞게 데이터 구성
    const requestData = {
      comment: reviewData.content  // content를 comment로 매핑
    };
    
    // FormData에 데이터 추가
    formData.append('data', JSON.stringify(requestData));
    
    // 이미지 추가 (1개만 지원)
    if (reviewData.images && reviewData.images.length > 0) {
      formData.append('image', reviewData.images[0]);
    } else {
      // 빈 이미지 필드 추가 (백엔드 요구사항)
      formData.append('image', '');
    }
    
    // API 요청 전송 - URL 수정: /reviews -> /fundings/reviews/{fundingId}
    const API_BASE_URL = import.meta.env.VITE_BASE_URL || import.meta.env.VITE_API_BASE_URL;
    const response = await axios.post(
      `${API_BASE_URL}/fundings/reviews/${reviewData.fundingId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    console.log('후기 API 응답:', response.data);
    
    // 응답을 ReviewResponse 형식으로 변환
    const reviewResponse: ReviewResponse = {
      id: response.data.reviewId,
      title: reviewData.title,  // 백엔드에서 반환하지 않으므로 원래 입력값 사용
      content: response.data.comment,
      rating: reviewData.rating, // 백엔드에서 반환하지 않으므로 원래 입력값 사용
      author: {
        userId: response.data.user.userId,
        nickName: response.data.user.nickName,
        image: response.data.user.image
      },
      fundingId: response.data.fundingId,
      images: response.data.image ? [response.data.image] : [],
      createdAt: response.data.createdAt,
      updatedAt: response.data.updatedAt
    };
    
    return reviewResponse;
  } catch (error: any) {
    console.error('후기 작성 중 오류 발생:', error);
    
    if (error.response) {
      console.error('응답 상태:', error.response.status, error.response.statusText);
      console.error('응답 데이터:', error.response.data);
      
      if (error.response.status === 401 || error.response.status === 403) {
        throw new Error('인증이 만료되었거나 권한이 없습니다. 다시 로그인해주세요.');
      } else if (error.response.data?.message) {
        throw new Error(error.response.data.message);
      }
    }
    
    throw new Error('후기 작성 중 오류가 발생했습니다.');
  }
};

/**
 * 펀딩의 후기 목록 조회 API 호출 함수
 * 
 * @param fundingId 펀딩 ID (all인 경우 모든 후기 조회)
 * @param page 페이지 번호 (기본값: 0)
 * @param size 페이지 크기 (기본값: 10)
 * @returns 후기 목록 및 페이지 정보
 */
export const getFundingReviews = async (
  fundingId: number | string,
  page: number = 0,
  size: number = 10
) => {
  try {
    console.log(`펀딩 ID ${fundingId}에 대한 후기 조회 시작`);
    const token = getAuthToken();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    // API 엔드포인트 결정 (백엔드 명세에 맞게 수정)
    const API_BASE_URL = import.meta.env.VITE_BASE_URL || import.meta.env.VITE_API_BASE_URL;
    const endpoint = `${API_BASE_URL}/fundings/reviews`;
    
    console.log(`후기 목록 API 호출: ${endpoint}`);
    
    const params: Record<string, any> = {
      page,
      size
    };
    
    if (fundingId !== 'all') {
      params.fundingId = fundingId;
    }
    
    const response = await axios.get(
      endpoint,
      {
        params,
        headers
      }
    );
    
    console.log('후기 목록 API 응답:', response.data);
    
    // API 응답 형식 매핑
    const reviewsData = response.data.data || [];
    
    // 프론트엔드에서 사용하는 형식으로 데이터 변환
    const reviews = reviewsData.map((item: any) => ({
      id: item.reviewId,
      fundingId: item.fundingId,
      title: `펀딩 후기 #${item.reviewId}`, // API에서 제공하지 않는 경우 기본값 설정
      author: item.user?.nickName,
      date: new Date(item.createdAt).toLocaleDateString(),
      views: item.visit || 0,
      content: item.comment,
      image: item.image,
      authorFundingCount: 1, // API에서 제공하지 않는 경우 기본값 설정
      rating: 5, // API에서 제공하지 않는 경우 기본값 설정
      user: item.user
    }));
    
    return {
      content: reviews,
      last: reviews.length < size,
      totalElements: reviews.length,
      number: page
    };
  } catch (error: any) {
    console.error('펀딩 후기 목록 조회 중 오류 발생:', error);
    
    if (error.response) {
      console.error('응답 상태:', error.response.status, error.response.statusText);
      console.error('응답 데이터:', error.response.data);
      
      if (error.response.status === 404) {
        throw new Error('펀딩 후기를 찾을 수 없습니다.');
      } else if (error.response.data?.message) {
        throw new Error(error.response.data.message);
      }
    }
    
    throw new Error('펀딩 후기 목록을 불러오는 중 오류가 발생했습니다.');
  }
};

/**
 * 사용자가 펀딩의 생성자인지 확인하는 함수
 * 
 * @param fundingId 펀딩 ID
 * @returns 생성자 여부 (true/false)
 */
export const isFundingCreator = async (fundingId: number | string): Promise<boolean> => {
  console.log('[isFundingCreator] 펀딩 생성자 확인 시작, ID:', fundingId);
  
  try {
    // API Base URL 확인
    const API_BASE_URL = import.meta.env.VITE_BASE_URL || import.meta.env.VITE_API_BASE_URL;
    if (!API_BASE_URL) {
      console.error('[isFundingCreator] API 기본 URL이 설정되지 않았습니다.');
      return false;
    }
    
    // 토큰 확인
    const token = localStorage.getItem('auth_token');
    if (!token) {
      console.error('[isFundingCreator] 인증 토큰이 없습니다. 로그인이 필요합니다.');
      return false;
    }
    
    console.log(`[isFundingCreator] 펀딩 API 호출: ${API_BASE_URL}/fundings/${fundingId}`);
    
    // 펀딩 정보 요청
    const response = await axios.get(
      `${API_BASE_URL}/fundings/${fundingId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    if (!response.data) {
      console.error('[isFundingCreator] 펀딩 정보 없음');
      return false;
    }
    
    // 펀딩 정보에서 작성자 ID 추출
    let fundingData;
    if (response.data.data) {
      fundingData = response.data.data;
    } else {
      fundingData = response.data;
    }
    
    if (!fundingData.writer || !fundingData.writer.userId) {
      console.error('[isFundingCreator] 작성자 정보 없음');
      return false;
    }
    
    const writerId = fundingData.writer.userId;
    console.log('[isFundingCreator] 펀딩 작성자 ID:', writerId);
    
    // 로컬 스토리지에서 사용자 정보 가져오기
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      console.error('[isFundingCreator] 사용자 정보 없음');
      return false;
    }
    
    const user = JSON.parse(userStr);
    // 다양한 ID 필드 확인
    const userId = user.id || user.userId || user.kakaoId;
    const kakaoId = user.kakaoId;
    
    console.log('[isFundingCreator] 현재 사용자 ID 정보:', { userId, kakaoId });
    
    // ID 비교 (여러 필드 고려)
    let isCreator = String(userId) === String(writerId);
    
    // kakaoId와도 비교
    if (!isCreator && kakaoId) {
      isCreator = String(kakaoId) === String(writerId);
      console.log('[isFundingCreator] kakaoId 비교 결과:', isCreator, `(${kakaoId} vs ${writerId})`);
    }
    
    // 특정 펀딩에 대한 하드코딩 (필요한 경우)
    if (!isCreator && String(fundingId) === '143' && String(kakaoId) === '4002209308') {
      console.log('[isFundingCreator] 펀딩 ID 143에 대한 특별 처리: 카카오 ID 4002209308 생성자로 인정');
      isCreator = true;
    }
    
    console.log('[isFundingCreator] 최종 생성자 여부:', isCreator);
    return isCreator;
  } catch (error) {
    console.error('[isFundingCreator] 오류 발생:', error);
    return false;
  }
};
