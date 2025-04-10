package com.wukiki.data.entity

import com.squareup.moshi.Json
import com.squareup.moshi.JsonClass

@JsonClass(generateAdapter = true)
data class PaymentEntity(
    @Json(name = "code")
    val code: String,

    @Json(name = "message")
    val message: String,

    @Json(name = "data")
    val data: List<PaymentHistoryEntity>

)

@JsonClass(generateAdapter = true)
data class PaymentHistoryEntity(

    @Json(name = "paymentId")
    val paymentId: Int,

    @Json(name = "userId")
    val userId: Int,

    @Json(name = "fundingTitle")
    val fundingTitle: String?,

    @Json(name = "productName")
    val productName: String?,

    @Json(name = "amount")
    val amount: Int,

    @Json(name = "transactionType")
    val transactionType: String,

    @Json(name = "date")
    val date: String?
)