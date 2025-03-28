package com.wukiki.domain.model

data class KakaoUser(
    val type: String,
    val jwtToken: String,
    val refreshToken: String
)