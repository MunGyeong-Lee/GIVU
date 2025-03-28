package com.backend.givu.util;

import com.backend.givu.security.JwtProvider;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class JwtUtil {

    private final JwtProvider jwtProvider;

    public Long getUserId(String token) {
        Claims claims = jwtProvider.getTokenBody(token.replace("Bearer ", ""));
        return Long.parseLong(claims.get("id").toString());
    }
}

