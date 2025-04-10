package com.backend.givu.security;

import ch.qos.logback.core.encoder.EchoEncoder;
import com.backend.givu.exception.AuthErrorException;
import com.backend.givu.model.Enum.AuthErrorStatus;
import com.backend.givu.model.Enum.HttpStatusCode;
import com.backend.givu.model.responseDTO.ResultDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sun.net.httpserver.HttpServer;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
@Component
@Slf4j
public class JwtExceptionFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal (HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
        throws ServletException, IOException{
        try {
            filterChain.doFilter(request, response);
        } catch (AuthErrorException e){
            log.warn("📛 JwtExceptionFilter - AuthErrorException 잡힘: {}", e.getErrorMsg());
            handleException(response, e.getErrorStatus().name(), e.getErrorMsg());
        } catch (Exception e){
            log.error("💥 JwtExceptionFilter - 알 수 없는 예외 발생: {}", e.getMessage());
            handleException(response, "UNKNOWN_ERROR", e.getMessage());
        }

    }


    private void handleException(HttpServletResponse response, String errorCode, String errorMessage) throws IOException {
        if (response.isCommitted()) return;

        int status = HttpStatusCode.BAD_REQUEST.getCode(); // 초기값 400

        //  AuthErrorStatus 이름 기반으로 Enum 찾기
        AuthErrorStatus errorStatus = null;
        try {
            errorStatus = AuthErrorStatus.valueOf(errorCode);
            status = errorStatus.getStatusCode().getCode();  // Enum에서 실제 code 꺼내기
        } catch (IllegalArgumentException ignored) {
            // 무시 (예: 알 수 없는 에러)
        }

        response.setStatus(status);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        ResultDTO<Object> responseBody = ResultDTO.of(
                errorStatus != null ? errorStatus.getStatusCode() : HttpStatusCode.BAD_REQUEST,
                errorMessage,
                null
        );

        final ObjectMapper mapper = new ObjectMapper();
        mapper.writeValue(response.getOutputStream(), responseBody);


    }
//
//    /**
//     * 아래 경로에 대한 요청은 필터를 적용하지 않음 (Swagger 등)
//     */
//
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
