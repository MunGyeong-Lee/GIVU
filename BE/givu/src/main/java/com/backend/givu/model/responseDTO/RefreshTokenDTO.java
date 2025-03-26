package com.backend.givu.model.responseDTO;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PRIVATE)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
/**
 *  클라이언트에게 재발급된 Access Token을 응답할 때 사용
 */
public class RefreshTokenDTO {
    private String accessToken;

    // 재발급된 accessToken
    public static RefreshTokenDTO of(String accessToken){
        return new RefreshTokenDTO(accessToken);
    }
}
