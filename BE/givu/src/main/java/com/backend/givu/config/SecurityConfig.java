package com.backend.givu.config;

import com.backend.givu.security.JwtExceptionFilter;
import com.backend.givu.security.JwtRequestFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtRequestFilter jwtRequestFilter;
    private final JwtExceptionFilter jwtExceptionFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        System.out.println("✅ SecurityConfig 등록됨");

        return http
                .cors(Customizer.withDefaults()) // CORS 설정 활성화
                // 기본 로그인 폼 미사용
                .formLogin(httpSecurityFormLoginConfigurer -> httpSecurityFormLoginConfigurer.disable())
                // 세션을 사용하지 않음 (JWT 기반 인증)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/products/*/like"  // 이 라인 추가 → 인증 필요하게!
                        ).authenticated()       // 인증 필요
                        .requestMatchers(
                                "/api-docs", 
                                "/v3/api-docs/**",              // OpenAPI JSON
                                "/swagger-ui/**",               // Swagger UI 관련 경로
                                "/swagger-ui.html",
                                "/swagger-resources/**",        // Swagger 리소스 허용
                                "/webjars/**",                  // Swagger UI에서 사용하는 WebJars 리소스 허용
                                "/error",                       // 에러 핸들링 경로
                                "/users/kakao",                 // 로그인, 회원가입
                                "/users/newToken",              // 토큰 재발급
                                "/users/generate",              // jwt 수동 발급
                                "/images/**",
                                "/products/**",
                                "/fundings/list",
                                "/fundings/search",
                                "/fundings/reindex",
                                "/kafka/send",
                                "/kafka/**"
                        ).permitAll()
                        .requestMatchers(
                                "/users/info",
                                "/users/givupay/**",    // 기뷰페이 관련
                                "/users/payment",       // 유저 거래 내역 조회
                                "/users",
                                "/users/setPassword",
                                "/users/checkPassword",
                                "/users/test",        // 테스트
                                "/products-review/**",
                                "/fundings/**",
                                "/mypage/**"
                        ).authenticated())

                /**
                 * JWT 필터 추가(인증 처리)
                 * 1. addFilterBefore - jwtExceptionFilter:
                 * 2. addFilterBefore - jwtRequestFilter : API 요청이 올때마다 Access 토큰이 유효한지 확인하는 역할
                 *
                 */
                .addFilterBefore(jwtExceptionFilter, UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class)

                // CSRF 비활성화 (Swagger 테스트 시 편리)
                .csrf(AbstractHttpConfigurer::disable)
                .build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.addAllowedOriginPattern("*"); // 필요 시 FE 도메인으로 제한 가능
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        config.addExposedHeader("*");

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}

