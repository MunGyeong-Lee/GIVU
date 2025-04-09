package com.backend.givu.exception;

import com.backend.givu.model.responseDTO.ApiResponse;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.ExceptionHandler;


public class GlobalExceptionHandler {

    /**
     * 모든 예외 처리 (Swagger 요청은 제외)
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<?>> handleAll(Exception ex, HttpServletRequest request) {
        String uri = request.getRequestURI();

        if (uri.contains("swagger") || uri.contains("api-docs")) {
            return null;
        }

        ex.printStackTrace();

        if (ex instanceof RuntimeException) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.fail("E400", ex.getMessage()));
        }

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.fail("E500", "서버 내부 오류가 발생했습니다."));
    }

    /**
     * JPA에서 찾지 못한 경우
     */
    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ApiResponse<?>> handleEntityNotFound(EntityNotFoundException ex) {
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.fail("E404", ex.getMessage()));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<?>> handleIllegalArgument(IllegalArgumentException ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.fail("E400", ex.getMessage()));
    }

//    /**
//     * 커스텀 NotFound 예외
//     */
//    @ExceptionHandler(com.backend.givu.exception.NotFoundException.class)
//    public ResponseEntity<ApiResponse<?>> handleCustomNotFound(com.backend.givu.exception.NotFoundException ex) {
//        return ResponseEntity
//                .status(HttpStatus.NOT_FOUND)
//                .body(ApiResponse.fail("E404", ex.getMessage()));
//    }

    /**
     * 권한 없음 (예: 펀딩 수정 권한 없음)
     */
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse<?>> handleAccessDenied(AccessDeniedException ex) {
        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(ApiResponse.fail("E403", ex.getMessage()));
    }

    /**
     * 런타임 예외 (NullPointerException 등)
     */
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiResponse<?>> handleRuntimeException(RuntimeException ex) {
        ex.printStackTrace(); // 콘솔에서 확인
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.fail("E400", ex.getMessage()));
    }
}
