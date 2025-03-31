package com.wukiki.data.entity

import com.squareup.moshi.Json
import com.squareup.moshi.JsonClass

@JsonClass(generateAdapter = true)
data class NewTokenEntity(
    @Json(name = "code")
    val code: Int,

    @Json(name = "message")
    val message: String,

    @Json(name = "data")
    val data: NewTokenDataEntity
)

@JsonClass(generateAdapter = true)
data class NewTokenDataEntity(
    @Json(name = "accessToken")
    val accessToken: String
)