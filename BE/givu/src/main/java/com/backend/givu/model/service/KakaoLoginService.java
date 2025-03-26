package com.backend.givu.model.service;

import com.backend.givu.model.entity.User;
import com.backend.givu.model.responseDTO.KakaoProfileDTO;
import com.backend.givu.model.responseDTO.TokenDTO;
import com.backend.givu.security.JwtProvider;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class KakaoLoginService {

    @Value("${kakao.client-id}")
    private String clientId;

    @Value("${kakao.redirect-uri}")
    private String redirectUri;

    @Value("${kakao.token-uri}")
    private String tokenUri;

    @Value("${kakao.user-info-uri}")
    private String userInfoUri;

    private final JwtProvider jwtProvider;


    private final RestTemplate restTemplate = new RestTemplate();

//    public String getAccessToken(String code) {
//        HttpHeaders headers = new HttpHeaders();
//        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
//
//        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
//        params.add("grant_type", "authorization_code");
//        params.add("client_id", clientId);
//        params.add("redirect_uri", redirectUri);
//        params.add("code", code);
//
//        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);
//
//        ResponseEntity<Map> response = restTemplate.postForEntity(tokenUri, request, Map.class);
//        return (String) response.getBody().get("access_token");
//    }

    // 카카오 유저정보 가져오기
    public KakaoProfileDTO getUserInfo(String accessToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);

        HttpEntity<Void> request = new HttpEntity<>(headers);

        ResponseEntity<KakaoProfileDTO> response = restTemplate.exchange(
                userInfoUri,
                HttpMethod.GET,
                request,
                KakaoProfileDTO.class
        );

        return response.getBody();
    }

    /**
     * JWT 토큰 발급
     * user: 현재 로그인한 user
     * type: signup / login
     */
    public TokenDTO createTokens(User user, String type){
        //Access Token 생성
        String accessToken = delegateAccessToken(user.getId(), user.getEmail());
        //Refresh Token 생성
        String refreshToken = jwtProvider.generateRefreshToken(user.getId());
        return new TokenDTO (type, accessToken, refreshToken);
    }


    private String delegateAccessToken(Long id, String email){
        return jwtProvider.generateAccessToken(id, email);
    }



}
