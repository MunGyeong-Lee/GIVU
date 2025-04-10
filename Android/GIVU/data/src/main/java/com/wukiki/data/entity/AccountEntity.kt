package com.wukiki.data.entity

import com.squareup.moshi.Json
import com.squareup.moshi.JsonClass

@JsonClass(generateAdapter = true)
data class AccountEntity(
    @Json(name = "code")
    val code: String,

    @Json(name = "message")
    val message: String,

    @Json(name = "data")
    val data: AccountInfoEntity?
)

@JsonClass(generateAdapter = true)
data class AccountInfoEntity(
    @Json(name = "accountNo")
    val accountNo: String,

    @Json(name = "balance")
    val balance: Int
)