package com.wukiki.data.entity

import com.squareup.moshi.Json
import com.squareup.moshi.JsonClass

@JsonClass(generateAdapter = true)
data class ReviewEntity(
    @Json(name = "reviewId")
    val reviewId: Int,

    @Json(name = "fundingId")
    val fundingId: Int,

    @Json(name = "userId")
    val userId: Int,

    @Json(name = "comment")
    val comment: String,

    @Json(name = "image")
    val image: String,

    @Json(name = "createdAt")
    val createdAt: String,

    @Json(name = "updatedAt")
    val updatedAt: String,

    @Json(name = "visit")
    val visit: Int
)