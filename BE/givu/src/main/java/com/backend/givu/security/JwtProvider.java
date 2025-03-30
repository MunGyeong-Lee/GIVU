package com.backend.givu.security;

import com.backend.givu.exception.AuthErrorException;
import com.backend.givu.model.Enum.AuthErrorStatus;
import com.backend.givu.model.entity.CustomUserDetail;
import com.backend.givu.model.entity.RefreshToken;
import com.backend.givu.model.entity.User;
import com.backend.givu.model.repository.RefreshTokenRepository;
import com.backend.givu.model.repository.UserRepository;
import com.backend.givu.model.service.CustomUserDetailService;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.time.Instant;
import java.util.Base64;
import java.util.Date;
import java.util.UUID;


/**
 *  JWTProvider: AccessToken RefreshToken 생성 / 검증
 */
@Slf4j
@Component
@RequiredArgsConstructor

public class JwtProvider {


    @Value("${jwt.access.token.expiration.seconds}")
    private Long accessTokenValidationTime;

    @Value("${jwt.token.secret.key}")
    private String secretKeyString;
    private Key secretKey;
    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;
    private final CustomUserDetailService userDetailService;

    //JWT 생성/검증에서 사용 될 secretKey
    @PostConstruct
    public void initializeSecretKey(){
        log.info("Loaded JWT Secret Key: {}", secretKeyString); // 디버깅용
        this.secretKey = Keys.hmacShaKeyFor(Base64.getDecoder().decode(secretKeyString));
    }

    /**
     * accessToken 생성
     */
    public String generateAccessToken(Long id, String subject){
        // 토큰 생성 시간
        Instant now = Instant.now();


        return Jwts.builder()
                .claim("id", id)
                .setSubject(subject) // 사용자 이메일
                .setExpiration(Date.from(now.plusSeconds(accessTokenValidationTime)))
                .signWith(secretKey)
                .compact();
    }

    /**
     * Refresh Token 생성
     */
    public String generateRefreshToken(Long id){
        // refreshToken 생성
        RefreshToken refreshToken = new RefreshToken(UUID.randomUUID().toString(), id);
        // db 저장
        refreshTokenRepository.save(refreshToken);

        return refreshToken.getRefreshToken();
    }

    /**
     *  Refresh토큰으로 Access 토큰 재발급
     */
    public String reAccessToken(String token) throws AuthErrorException {
        // refreshToken 찾기
        RefreshToken refreshToken = refreshTokenRepository.findById(token)
                .orElseThrow(()-> new AuthErrorException(AuthErrorStatus.INVALID_TOKEN));

        // refreshToken에 연결된 userId
        Long userId = refreshToken.getUserId();

        // userId로 User 찾기
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AuthErrorException(AuthErrorStatus.GET_USER_FAILED));

        // accessToken 발급 받으러 가기
        return generateAccessToken(user.getId(), user.getEmail());
    }

    /**
     *  AccessToken 유효성 검사
     */
    public boolean validateToken(String token) throws AuthErrorException{
        try{
            /**
             * 유효성 검사
             * - JWT 토큰이 서명(secretKey)으로 진짜 만들어진 토큰인지, 그리고 구조가 올바른지 검사
             * - Jwts.parserBuilder(): JWT를 파싱(분석)할 수 있는 ParserBuilder 객체
             * - .setSigningKey(secretKey): 서명을 확인할 때 사용할 비밀 키(secretKey) 설정
             * - .build(): 설정한 빌더 정보를 바탕으로 실제 JwtParser 객체 생성
             * - .parseClaimsJws(token): 전달받은 token 문자열을 파싱해서 Claims 객체(JWT 정보 덩어리)로 바꿈
             * -  이후 jjwt 라이브러리 내부의 JwtParser 클래스가 검사를 수행
             *    : 구조 검사, 서명 검사 (secretKey로), 만료 여부 등 검사
             */
            log.info("🔐 토큰 유효성 검사 시작: {}", token);
            Jwts.parserBuilder().setSigningKey(secretKey).build().parseClaimsJws(token);
            return true;
        } catch (io.jsonwebtoken.security.SecurityException | MalformedJwtException e){
            // 잘못된 토큰
            log.warn("❌ 잘못된 토큰: {}", e.getMessage());
            throw new AuthErrorException(AuthErrorStatus.INVALID_TOKEN);
        } catch(ExpiredJwtException e){
            // 만료된 토큰
            log.warn("⏰ 토큰 만료: {}", e.getMessage());
            throw new AuthErrorException(AuthErrorStatus.EXPIRED_TOKEN);
        } catch (UnsupportedJwtException e){
            log.error("지원되지 않는 토큰입니다.");
        } catch (IllegalArgumentException e){
            log.error("잘못된 JWT 토큰입니다.");
        }
        return false;
    }

    /**
     * getAuthentication:
     *      이 토큰 안에 들어 있는 유저 정보를 꺼내서, 인증된 사용자로 인식시켜야 함 ("SecurityContextHolder"에 등록하기 위해)
     *      ->  UsernamePasswordAuthenticationToken 으로 보내 인증된 유저인지 확인
     */
    public Authentication getAuthentication(String accessToken) throws ExpiredJwtException{
        Claims claims = getTokenBody(accessToken);
        // emil로 userDetail 가져오기
        CustomUserDetail userDetail = userDetailService.loadUserByUsername(claims.getSubject());
        // UsernamePasswordAuthenticationToken으로 인증 객체 생성
        return new UsernamePasswordAuthenticationToken(userDetail, "", userDetail.getAuthorities());
    }

    /**
     * JWT claims 꺼내기
     *  - Claim  = JWT 안에 담긴 정보 [Header].[Payload].[Signature]의 payload에 해당하는 부분
     */
    public Claims getTokenBody(String jwtToken){
        return Jwts.parserBuilder()
                .setSigningKey(secretKey)   // 1. 서명 검증용 secretKey 설정
                .build()                    // 2. 파서(parser) 빌드  : 파서 객체 생성
                .parseClaimsJws(jwtToken)   // 3. JWT 파싱 및 서명 검증
                .getBody();                 // 4. Claims (payload 정보) 꺼냄
    }

}
