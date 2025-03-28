package com.wukiki.data.entity

import com.squareup.moshi.Json
import com.squareup.moshi.JsonClass

@JsonClass(generateAdapter = true)
data class KakaoUserEntity(
    @Json(name = "type")
    val type: String,

    @Json(name = "accessToken")
    val jwtToken: String,

    @Json(name = "refreshToken")
    val refreshToken: String
)