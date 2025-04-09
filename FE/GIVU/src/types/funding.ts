// 유저 정보 타입
export interface UserInfo {
  userId: number;
  nickName: string;
  image: string;
}

// 상품 정보 타입
export interface ProductInfo {
  id: number;
  productName: string;
  price: number;
  image: string;
}

// 펀딩 아이템 타입
export interface FundingItem {
  fundingId: number;
  user: UserInfo;
  product: ProductInfo;
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
  hidden: boolean; // 친구만 볼 수 있는 비밀 펀딩 여부
}

// 히어로 섹션에서 사용할 간소화된 펀딩 타입
export interface HeroFundingItem {
  id: number;
  title: string;
  imageUrl: string;
  progressPercentage: number; // 달성률
  parcitipantsNumber: number; // 참여자 수
}
