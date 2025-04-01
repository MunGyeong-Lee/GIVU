package com.wukiki.data.entity

import com.squareup.moshi.Json
import com.squareup.moshi.JsonClass

@JsonClass(generateAdapter = true)
data class FundingEntity(
    @Json(name = "fundingId")
    val fundingId: Int,

    @Json(name = "user")
    val user: FundingUserEntity,

    @Json(name = "product")
    val product: FundingProductEntity,

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
    val updatedAt: String?
)

@JsonClass(generateAdapter = true)
data class FundingUserEntity(
    @Json(name = "userId")
    val userId: Int,

    @Json(name = "nickName")
    val nickname: String,

    @Json(name = "image")
    val image: String
)

@JsonClass(generateAdapter = true)
data class FundingProductEntity(
    @Json(name = "id")
    val id: Int,

    @Json(name = "productName")
    val productName: String,

    @Json(name = "price")
    val price: Int,

    @Json(name = "image")
    val image: String
)