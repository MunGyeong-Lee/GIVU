package com.backend.givu.controller;

import com.backend.givu.exception.AuthErrorException;
import com.backend.givu.model.Enum.AuthErrorStatus;
import com.backend.givu.model.Enum.HttpStatusCode;
import com.backend.givu.model.entity.User;
import com.backend.givu.model.responseDTO.KakaoProfileDTO;
import com.backend.givu.model.responseDTO.TokenDTO;
import com.backend.givu.model.service.KakaoLoginService;
import com.backend.givu.model.service.UserService;
import com.backend.givu.security.JwtProvider;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

import org.springframework.http.MediaType;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;  //실제 HTTP 요청처럼 Controller를 테스트할 수 있는 도구

    @MockBean //실제 Bean 대신 가짜(Mock) 객체를 주입해서 테스트
    private KakaoLoginService kakaoLoginService;

    @MockBean
    private UserService userService;

    @MockBean
    private JwtProvider jwtProvider;

    @Test
    @DisplayName("카카오 로그인 기존 유저 accessToken 발급 성공 테스트")
    void testLoginUserGenerateAccessToken_Success() throws Exception{
        //given
        String accessToken = "fake-access-token";
        Long kakaoId  = 12345L;

        // 가짜 카카오 사용자 정보 생성
        KakaoProfileDTO.KakaoAccount kakaoAccount = new KakaoProfileDTO.KakaoAccount();
        kakaoAccount.setEmail("test@kakako.com");
        kakaoAccount.setGender("male");
        kakaoAccount.setAge_range("20~29");
        kakaoAccount.setBirthday("0101");

        KakaoProfileDTO profileDTO  = new KakaoProfileDTO();
        profileDTO.setId(kakaoId);
        profileDTO.setKakao_account(kakaoAccount);

        // 가짜 기존 유저 생성
        HashMap<String, Object> props = new HashMap<>();
        props.put("nickname", "테스트유저");
        props.put("profile_image", "https://image.com/test.png");
        profileDTO.setProperties(props);

        User user = User.builder()
                .id(1L)
                .email("test@kakao.com")
                .nickname("테스트유저")
                .build();

        //테스트용 가짜(TokenDTO) 데이터
        TokenDTO tokenDTO = new TokenDTO("Login", "access-token", "refresh-token");

        //mocking
        // 필요한 서비스 moking / 전제 조건 설정
        // ex) kakaoLoginService.getUserInfo(accessToken) 호출 -> profileDTO 리턴 하라
        given(kakaoLoginService.getUserInfo(accessToken)).willReturn(profileDTO);
        given(userService.getUserByKakaoId(kakaoId)).willReturn(Optional.of(user));
        given(kakaoLoginService.createTokens(user,"Login")).willReturn(tokenDTO);

        // when & then
        //`POST /users/kakao` 요청 시 정상 응답이 오는지 확인
        mockMvc.perform(post("/users/kakao")
                        .param("accessToken", accessToken)  // 요청 파라미터로 accessToken 전달
                        .contentType(MediaType.APPLICATION_JSON)) // Content-Type 지정 >>> 여기까지가 컨트롤러에 HTTP 요청을 보내는 것
                .andExpect(status().isOk()) // 응답 상태 코드가 200인지 확인
                .andExpect(jsonPath("$.accessToken").value("access-token"))
                .andExpect(jsonPath("$.refreshToken").value("refresh-token"))
                .andExpect(jsonPath("$.type").value("Login"));

                /**
                 * 아래와 같은 json 형태인지 검증
                 * {
                 *   "accessToken": "access-token",
                 *   "refreshToken": "refresh-token",
                 *   "type": "Login"
                 * }
                 */

    }

    @Test
    @DisplayName("refresh 토큰으로 access 토큰 재발급 성공 테스트")
    void testGetNewToken_Success() throws Exception{
        //given
        String fakeRefreshToken = "fake-refresh-token";
        String expectedAccessToken = "new-access-toekn";

        //JwtProvider가  accessToken을 리턴하도록 mock 처리
        Mockito.when(jwtProvider.reAccessToken(anyString())).thenReturn(expectedAccessToken);

        // when & then
        mockMvc.perform(get("/users/newToken")
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + fakeRefreshToken)
                    .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(HttpStatusCode.OK.getCode()))
                .andExpect(jsonPath("$.message").value("토큰 재발급"))
                .andExpect(jsonPath("$.data.accessToken").value(expectedAccessToken));

    }

    @Test
    @DisplayName("refresh 토큰이 유효하지 않을 경우 401 리턴")
    void testGetNewToken_AuthFail() throws Exception{
        //given
        String fakeRefreshToken = "invalid-token";

        //jwtProvider 가 인증 예외를 던지도록 설정
        Mockito.when(jwtProvider.reAccessToken(anyString()))
                .thenThrow(new com.backend.givu.exception.AuthErrorException(
                        AuthErrorStatus.REFRESH_EXPIRED
                ));

        // when & then
        mockMvc.perform(get("/users/newToken")
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + fakeRefreshToken)
                    .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk()) // HTTP 상태는 200 OK지만
                .andExpect(jsonPath("$.code").value(401))
                .andExpect(jsonPath("$.message").value("refresh 토큰이 만료되었습니다."))
                .andExpect(jsonPath("$.data").doesNotExist());

    }


    @DisplayName("유효한 accessToken 요청 시 정상 응답")
    @Test
    void testValidAccessToken() throws Exception {
        String validAccessToken = "valid-token";

        // jwtProvider가 유효하다고 판단하게끔 mocking
        Mockito.when(jwtProvider.validateToken(validAccessToken)).thenReturn(true);
        Mockito.when(jwtProvider.getAuthentication(validAccessToken))
                .thenReturn(new UsernamePasswordAuthenticationToken(
                        "user",                              // principal
                        "",                                  // credentials
                        List.of(new SimpleGrantedAuthority("ROLE_USER")) // ✅ 권한 필수!
                ));

        mockMvc.perform(get("/users/test") // JWT 인증 필요한 API
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + validAccessToken))
                .andExpect(status().isOk());
    }

    @DisplayName("만료된 accessToken 요청 시 401 Unauthorized 응답")
    @Test
    void testExpiredAccessToken() throws Exception {
        String expiredToken = "expired-token";

        // jwtProvider가 만료 예외를 던지게 설정
        Mockito.when(jwtProvider.validateToken(expiredToken))
                .thenThrow(new AuthErrorException(AuthErrorStatus.EXPIRED_TOKEN));

        mockMvc.perform(get("/users/test")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + expiredToken))
                .andExpect(status().isUnauthorized());
    }

    @DisplayName("잘못된 accessToken 요청 시 400 Unauthorized 응답")
    @Test
    void testInvalidAccessToken() throws Exception {
        String invalidToken = "invalid-token";

        // jwtProvider가 유효하지 않은 토큰 예외 던지게 설정
        Mockito.when(jwtProvider.validateToken(invalidToken))
                .thenThrow(new AuthErrorException(AuthErrorStatus.INVALID_TOKEN));

        mockMvc.perform(get("/users/test")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + invalidToken))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value(400))
                .andExpect(jsonPath("$.message").value("유효하지 않은 토큰입니다."));
    }

}
