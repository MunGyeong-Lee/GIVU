package com.wukiki.data.entity

import com.squareup.moshi.Json
import com.squareup.moshi.JsonClass

@JsonClass(generateAdapter = true)
data class ProductReviewEntity(
    @Json(name = "reviewId")
    val reviewId: Int,

    @Json(name = "title")
    val title: String,

    @Json(name = "body")
    val body: String,

    @Json(name = "image")
    val image: String,

    @Json(name = "star")
    val star: Double,

    @Json(name = "user")
    val user: ProductReviewUserEntity
)

@JsonClass(generateAdapter = true)
data class ProductReviewUserEntity(
    @Json(name = "userId")
    val userId: Int,

    @Json(name = "nickName")
    val nickname: String,

    @Json(name = "image")
    val image: String
)