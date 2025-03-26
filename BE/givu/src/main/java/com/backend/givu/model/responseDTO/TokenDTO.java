package com.backend.givu.model.responseDTO;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TokenDTO {
    private String type; // Signup 또는 Login
    private String accessToken;
    private String refreshToken;

}
