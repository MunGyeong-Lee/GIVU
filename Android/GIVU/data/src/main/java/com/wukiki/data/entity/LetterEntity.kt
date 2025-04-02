package com.wukiki.data.entity

import com.squareup.moshi.Json
import com.squareup.moshi.JsonClass

@JsonClass(generateAdapter = true)
data class LetterEntity(
    @Json(name = "letterId")
    val letterId: Int,

    @Json(name = "funding")
    val fundingId: Int,

    @Json(name = "user")
    val user: FundingUserEntity,

    @Json(name = "comment")
    val comment: String,

    @Json(name = "image")
    val image: String?,

    @Json(name = "access")
    val access: String?,

    @Json(name = "createdAt")
    val createdAt: String?,

    @Json(name = "updatedAt")
    val updatedAt: String?
)