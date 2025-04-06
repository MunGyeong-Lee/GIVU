package com.backend.givu.security;

import com.backend.givu.exception.AuthErrorException;
import com.nimbusds.jose.proc.SecurityContext;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * API 요청이 올때마다 Access 토큰이 유효한지 확인하는 역할
 * ( Swagger나 정적 리소스 등 인증이 필요 없는 요청은 필터를 건너 뛴다)
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class JwtRequestFilter  extends OncePerRequestFilter {
    private  final JwtProvider jwtProvider;
    private static final String BEARER_PREFIX = "Bearer ";
    /**
     * doFilterInternal : SecurityContext에 Access Token으로부터 뽑아온 인증 정보를 저장하는 메서드
     *
     *  doFilterInternal() 내부에서 수행하는 작업:
     *  – HTTP 쿠키 or 헤더에서 JWT 가져오기
     *  – 요청에 JWT가 있으면 유효성을 검사하고 사용자 이름을 구문 분석한다.
     *  – 사용자 이름에서 UserDetails를 가져와 인증 개체를 만든다.
     *  – setAuthentication(authentication) 메서드를 사용하여 SecurityContext에서 현재 UserDetails를 설정한다.
     *
     */

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
            //  "/users/kakao", "/users/newToken" 경로 요청은 필터를 실행하지 않도록 걸러야함
            log.info("📥 요청 URI: {}", request.getRequestURI());
            if(!request.getRequestURI().equals("/users/kakao") && !request.getRequestURI().equals("/users/newToken")){
                // Header에서 토큰값 추출해오기
                String jwt = resolveToken(request); //request: 헤더에서 넘어오는 JWT
                log.info("resolveToken - jwt token = {}", jwt);

                // token 검사
                try{
                    // jwtProvider.validateToken(jwt): accessToken 유효성 검사
                    if (jwt != null && jwtProvider.validateToken(jwt)){
                        // jwtProvider.getAuthentication(jwt): 이 토큰 안에 들어 있는 유저 정보를 꺼내서, 인증된 사용자로 인식시켜야 함
                        log.info("✅ 토큰 유효함. 인증 객체 설정 진행");
                        Authentication authentication = jwtProvider.getAuthentication(jwt);
                        // SecurityContext에 authentication 해당 유저의 인증 객체  등록
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                    }
                } catch (AuthErrorException e){
                    log.error("🔥 AuthErrorException 발생: {}", e.getErrorMsg());
                    throw e;
                }
            }
            filterChain.doFilter(request, response);
    }

    /**
     * resolveToken : Header에서 토큰값 추출하는 메서드
     */
    private String resolveToken(HttpServletRequest request){
        String token =request.getHeader("Authorization");  //ex) Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6...

        //Authorization 헤더에 유효한 JWT Token이 있는지 확인
        // 1. 토큰 값이 null, "", " " 같은 빈 문자열인지 확인
        // 2. 토큰 문자열이 "Bearer "로 시작하는 지 확인
        if(StringUtils.hasText(token) && token.startsWith(BEARER_PREFIX)){
            return token.substring(7); //"Bearer "를 제외한 토큰 값
        }
        return null ;
    }

//    /**
//     * 아래 경로에 대한 요청은 필터를 적용하지 않음 (Swagger 등)
//     */
//    @Override
//    protected boolean shouldNotFilter(HttpServletRequest request) {
//        String path = request.getRequestURI();
//        return path.startsWith("/swagger-ui")
//                || path.startsWith("/v3/api-docs")
//                || path.startsWith("/swagger-resources")
//                || path.startsWith("/webjars")
//                || path.equals("/")
//                || path.equals("/favicon.ico");
//    }




}
