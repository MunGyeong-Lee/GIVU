import apiClient from './index';

// 펀딩 관련 타입 정의
export interface Funding {
  id: number;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface FundingCreateRequest {
  title: string;
  description: string;
  targetAmount: number;
  startDate: string;
  endDate: string;
}

// 펀딩 API 함수들
export const fundingApi = {
  // 펀딩 목록 조회
  getFundings: () => {
    return apiClient.get<Funding[]>('/fundings');
  },

  // 펀딩 상세 조회
  getFunding: (id: number) => {
    return apiClient.get<Funding>(`/fundings/${id}`);
  },

  // 펀딩 생성
  createFunding: (data: FundingCreateRequest) => {
    return apiClient.post<Funding>('/fundings', data);
  },

  // 펀딩 수정
  updateFunding: (id: number, data: Partial<FundingCreateRequest>) => {
    return apiClient.put<Funding>(`/fundings/${id}`, data);
  },

  // 펀딩 삭제
  deleteFunding: (id: number) => {
    return apiClient.delete(`/fundings/${id}`);
  },
};

export default fundingApi; 