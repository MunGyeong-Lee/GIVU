// TanStack Query를 사용하는 Custom Hook

import { useMutation } from '@tanstack/react-query';
import { createFunding, CreateFundingData } from '../services/funding.service';
import { useNavigate } from 'react-router-dom';

interface FundingResponse {
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

/**
 * 펀딩 생성 mutation을 제공하는 hook
 */
export const useCreateFunding = () => {
  const navigate = useNavigate();

  return useMutation<FundingResponse, Error, {
    fundingData: CreateFundingData;
    mainImage: string;
    additionalImages?: string[];
  }>({
    mutationFn: async ({ fundingData, mainImage, additionalImages }) => {
      // 토큰 확인
      const token = localStorage.getItem('auth_token');
      if (!token) {
        console.error('인증 토큰이 없습니다.');
        // 로그인 페이지로 리다이렉트
        navigate('/login');
        throw new Error('로그인이 필요합니다.');
      }

      try {
        console.log('[펀딩 생성 요청 시작]', {
          title: fundingData.title,
          productId: fundingData.productId,
          scope: fundingData.scope,
          hasMainImage: !!mainImage,
          additionalImagesCount: additionalImages?.length || 0,
          hasToken: !!token
        });
        
        const response = await createFunding(fundingData, additionalImages);
        console.log('[펀딩 생성 응답 성공]', response);
        
        return response;
      } catch (error: any) {
        console.error('[펀딩 생성 오류]', error);
        
        if (error.response?.status === 403) {
          // 토큰이 만료되었거나 유효하지 않은 경우
          localStorage.removeItem('auth_token');
          navigate('/login');
          throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.');
        }
        
        throw error;
      }
    },
    onMutate: (variables) => {
      const token = localStorage.getItem('auth_token');
      console.log('[펀딩 생성 Mutation 시작]', {
        title: variables.fundingData.title,
        hasImage: !!variables.mainImage,
        isAuthenticated: !!token
      });
    },
    onError: (error) => {
      console.error('[펀딩 생성 Mutation 오류]', error);
      if (error.message.includes('로그인이 필요합니다') || 
          error.message.includes('인증이 만료되었습니다')) {
        navigate('/login');
      }
    },
    onSuccess: (data) => {
      console.log('[펀딩 생성 Mutation 성공]', data);
    },
    onSettled: (data, error) => {
      console.log('[펀딩 생성 Mutation 완료]', { data, error });
    }
  });
}; 