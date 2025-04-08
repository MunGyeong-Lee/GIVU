package com.wukiki.data.entity

import com.squareup.moshi.Json
import com.squareup.moshi.JsonClass

@JsonClass(generateAdapter = true)
data class FundingTransferEntity(
    @Json(name = "code")
    val code: String,

    @Json(name = "message")
    val message: String,

    @Json(name = "data")
    val data: FundingTransferInfoEntity
)

@JsonClass(generateAdapter = true)
data class FundingTransferInfoEntity(
    @Json(name = "paymentId")
    val paymentId: Int,

    @Json(name = "userId")
    val userId: Int,

    @Json(name = "fundingId")
    val fundingId: Int,

    @Json(name = "productId")
    val productId: Int,

    @Json(name = "amount")
    val amount: Int,

    @Json(name = "transactionType")
    val transactionType: String,

    @Json(name = "status")
    val status: String,

    @Json(name = "date")
    val date: String
)