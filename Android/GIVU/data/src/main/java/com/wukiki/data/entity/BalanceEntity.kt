package com.wukiki.data.entity

import com.squareup.moshi.Json
import com.squareup.moshi.JsonClass

@JsonClass(generateAdapter = true)
data class BalanceEntity(
    @Json(name = "code")
    val code: String,

    @Json(name = "message")
    val message: String,

    @Json(name = "data")
    val data: BalanceInfoEntity
)

@JsonClass(generateAdapter = true)
data class BalanceInfoEntity(
    @Json(name = "userId")
    val userId: Int,

    @Json(name = "givupayBalance")
    val givupayBalance: Int,

    @Json(name = "accountBalance")
    val accountBalance: Int
)