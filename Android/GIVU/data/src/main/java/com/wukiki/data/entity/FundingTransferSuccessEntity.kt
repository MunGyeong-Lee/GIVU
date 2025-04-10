package com.wukiki.data.entity

import com.squareup.moshi.Json
import com.squareup.moshi.JsonClass

@JsonClass(generateAdapter = true)
data class FundingTransferSuccessEntity(
    @Json(name = "code")
    val code: String,

    @Json(name = "message")
    val message: String,

    @Json(name = "data")
    val data: FundingTransferSuccessInfoEntity
)

@JsonClass(generateAdapter = true)
data class FundingTransferSuccessInfoEntity(
    @Json(name = "userId")
    val userId: Int,

    @Json(name = "fundingId")
    val fundingId: Int,

    @Json(name = "amount")
    val amount: Int
)