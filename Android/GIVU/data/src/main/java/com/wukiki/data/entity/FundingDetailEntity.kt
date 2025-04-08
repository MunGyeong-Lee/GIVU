package com.wukiki.data.entity

import com.squareup.moshi.Json
import com.squareup.moshi.JsonClass

@JsonClass(generateAdapter = true)
data class FundingDetailEntity(
    @Json(name = "code")
    val code: String,

    @Json(name = "message")
    val message: String,

    @Json(name = "data")
    val data: FundingInfoEntity
)

@JsonClass(generateAdapter = true)
data class FundingInfoEntity(
    @Json(name = "fundingId")
    val fundingId: Int,

    @Json(name = "creator")
    val isCreator: Boolean,

    @Json(name = "title")
    val title: String,

    @Json(name = "description")
    val description: String,

    @Json(name = "category")
    val category: String?,

    @Json(name = "categoryName")
    val categoryName: String?,

    @Json(name = "scope")
    val scope: String?,

    @Json(name = "participantsNumber")
    val participantsNumber: Int,

    @Json(name = "fundedAmount")
    val fundedAmount: Int,

    @Json(name = "status")
    val status: String?,

    @Json(name = "image")
    val images: List<String>?,

    @Json(name = "createdAt")
    val createdAt: String,

    @Json(name = "updatedAt")
    val updatedAt: String?,

    @Json(name = "writer")
    val writer: FundingUserEntity,

    @Json(name = "product")
    val product: FundingProductEntity,

    @Json(name = "letters")
    val letters: List<LetterEntity>,

    @Json(name = "reviews")
    val reviews: List<ReviewEntity>
)