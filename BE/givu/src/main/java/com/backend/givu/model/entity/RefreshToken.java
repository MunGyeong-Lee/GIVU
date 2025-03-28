package com.backend.givu.model.entity;

import org.springframework.data.annotation.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.redis.core.RedisHash;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@RedisHash(value = "jwtToken")
public class RefreshToken {
    @Id
    private String refreshToken;  // key
    private Long userId;        // value
}
