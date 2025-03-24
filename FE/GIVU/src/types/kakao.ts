// 카카오 사용자 정보 타입
export interface KakaoUser {
  id: number;
  connected_at: string;
  properties: {
    nickname: string;
    profile_image?: string;
    thumbnail_image?: string;
  };
  kakao_account: {
    profile_nickname_needs_agreement: boolean;
    profile_image_needs_agreement: boolean;
    profile: {
      nickname: string;
      thumbnail_image_url?: string;
      profile_image_url?: string;
      is_default_image?: boolean;
    };
    email_needs_agreement?: boolean;
    email?: string;
    age_range_needs_agreement?: boolean;
    age_range?: string;
    birthday_needs_agreement?: boolean;
    birthday?: string;
    gender_needs_agreement?: boolean;
    gender?: string;
  };
}

// 카카오 인증 토큰 타입
export interface KakaoAuthTokens {
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
  refresh_token_expires_in: number;
}

// 카카오 로그인 응답 타입
export interface KakaoLoginResponse {
  status: 'success' | 'error';
  data?: KakaoUser;
  error?: string;
} 