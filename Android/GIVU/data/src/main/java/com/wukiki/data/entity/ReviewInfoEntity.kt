package com.wukiki.data.entity

import com.squareup.moshi.Json
import com.squareup.moshi.JsonClass

@JsonClass(generateAdapter = true)
data class ReviewEntity(
    @Json(name = "code")
    val code: String,

    @Json(name = "message")
    val message: String,

    @Json(name = "data")
    val data: List<ReviewInfoEntity>
)

@JsonClass(generateAdapter = true)
data class ReviewInfoEntity(
    @Json(name = "reviewId")
    val reviewId: Int,

    @Json(name = "fundingId")
    val fundingId: Int,

    @Json(name = "user")
    val user: FundingUserEntity,

    @Json(name = "comment")
    val comment: String,

    @Json(name = "image")
    val image: String?,

    @Json(name = "createdAt")
    val createdAt: String?,

    @Json(name = "updatedAt")
    val updatedAt: String?,

    @Json(name = "visit")
    val visit: Int
)