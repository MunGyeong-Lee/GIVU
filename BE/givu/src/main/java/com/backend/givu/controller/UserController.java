package com.backend.givu.controller;

import com.backend.givu.exception.AuthErrorException;
import com.backend.givu.model.Enum.HttpStatusCode;
import com.backend.givu.model.entity.RefreshToken;
import com.backend.givu.model.responseDTO.*;
import com.backend.givu.model.entity.User;
import com.backend.givu.model.service.KakaoLoginService;
import com.backend.givu.model.service.UserService;
import com.backend.givu.security.JwtProvider;
import com.backend.givu.util.DateTimeUtil;
import com.backend.givu.util.mapper.AgeRangeMapper;
import com.backend.givu.util.mapper.GenderMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Objects;
import java.util.Optional;

@Tag(name = "User", description = "사용자 관련 API")
@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserService userService;
    private final KakaoLoginService kakaoLoginService;
    private final JwtProvider jwtProvider;

    @Operation(summary = "카카오 로그인/회원가입", description = "카카오 Access 코드를 받아 사용자 정보를 확인하고, 존재하면 로그인, 없으면 회원가입을 처리합니다.")
    @PostMapping("/kakao")
    public ResponseEntity<TokenDTO> kakaoLogin(@RequestParam String accessToken) {
//        // 1. access token 요청
//        String accessToken = kakaoLoginService.getAccessToken(code);

        // 2. 사용자 정보 요청
        KakaoProfileDTO profile = kakaoLoginService.getUserInfo(accessToken);
        Long kakaoId = profile.getId();

        // 3. DB에 존재 여부 확인
        Optional<User> existingUser = userService.getUserByKakaoId(kakaoId);

        // 4. 존재하면 그대로 반환
        if (existingUser.isPresent()) {
           TokenDTO tokenDTO = kakaoLoginService.createTokens(existingUser.get(), "Login");
           return ResponseEntity.ok(tokenDTO);
        }

        // 5. 존재하지 않으면 회원가입
        UsersDTO dto = UsersDTO.builder()
                .kakaoId(kakaoId)
                .nickName((String) profile.getProperties().get("nickname"))
                .email(Optional.ofNullable(profile.getKakao_account().getEmail()).orElse("no-email@kakao.com"))
                .profileImage((String) profile.getProperties().getOrDefault("profile_image", "https://default.image.url"))
                .gender(GenderMapper.fromKakao(profile.getKakao_account().getGender())) // null-safe 내부 처리
                .ageRange(AgeRangeMapper.fromKakao(profile.getKakao_account().getAge_range()))
                .birth(DateTimeUtil.parseKakaoBirthday(profile.getKakao_account().getBirthday())) // 동의 안 한 경우 생년월일 없음
                .address("카카오 주소 없음") // 기본값
                .build();

        User newUser = userService.saveUser(dto);
        TokenDTO tokenDTO = kakaoLoginService.createTokens(newUser, "signUp");
        return ResponseEntity.ok(tokenDTO);
    }

    @Operation(summary = "accessToken 재발급", description = "refreshToken 으로 accessToken 을 재발급 받습니다")
    @GetMapping("/newToken")
    public ResultDTO<RefreshTokenDTO> getNewToken(@RequestHeader HttpHeaders headers){
        try{
            String refreshToken = Objects.requireNonNull(headers.getFirst("Authorization")).substring(7);
            String accessToken = jwtProvider.reAccessToken(refreshToken);  // 여기서 에러 발생하면 catch로 넘어감
            return ResultDTO.of(HttpStatusCode.OK, "토큰 재발급", RefreshTokenDTO.of(accessToken));
        } catch (AuthErrorException e){
            return ResultDTO.of(e.getCode(), e.getErrorMsg(), null);
        } catch (Exception e){
            return ResultDTO.of(HttpStatusCode.INTERNAL_SERVER_ERROR, "서버 에러", null);
        }
    }


    @GetMapping("/{userId}")
    public ResponseEntity<UserInfoDTO> findUser(@PathVariable long userId){
        User user = userService.getUserById(userId);

        UserInfoDTO dto = UserInfoDTO.builder()
                .kakaoId(user.getKakaoId())
                .nickName(user.getNickname())
                .email(user.getEmail())
                .birth(user.getBirth())
                .profileImage(user.getProfileImage())
                .address(user.getAddress())
                .balance(user.getBalance())
                .gender(user.getGender())
                .ageRange(user.getAgeRange())
                .build();

        return ResponseEntity.ok(dto);
    }


    /**
     *
      *  컨트롤러 테스트
     */
    @GetMapping("/test")
    public ResponseEntity<String> testApi() {
        return ResponseEntity.ok("Success!");
    }

}
