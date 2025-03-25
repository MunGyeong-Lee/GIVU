package com.backend.givu.model.responseDTO;

import lombok.Data;

import java.util.Map;

@Data
public class KakaoProfileDTO {
    private Long id;
    private Map<String, Object> properties;
    private KakaoAccount kakao_account;

    @Data
    public static class KakaoAccount {
        private String email;
        private String birthday;
        private String gender;
        private String age_range;
    }
}
