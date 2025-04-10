package com.wukiki.data.entity

import com.squareup.moshi.Json
import com.squareup.moshi.JsonClass

@JsonClass(generateAdapter = true)
data class FundingTransferRefundEntity(
    @Json(name = "code")
    val code: String,

    @Json(name = "message")
    val message: String,

    @Json(name = "data")
    val data: FundingTransferRefundInfoEntity
)

@JsonClass(generateAdapter = true)
data class FundingTransferRefundInfoEntity(
    @Json(name = "userId")
    val userId: Int,

    @Json(name = "fundingId")
    val fundingId: Int
)