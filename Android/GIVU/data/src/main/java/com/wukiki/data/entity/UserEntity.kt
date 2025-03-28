package com.wukiki.data.entity

import com.squareup.moshi.Json
import com.squareup.moshi.JsonClass

@JsonClass(generateAdapter = true)
data class UserEntity(
    @Json(name = "kakaoId")
    val kakaoid: Long,

    @Json(name = "nickName")
    val nickname: String,

    @Json(name = "email")
    val email: String,

    @Json(name = "birth")
    val birth: String?,

    @Json(name = "profileImage")
    val profileImage: String?,

    @Json(name = "address")
    val address: String?,

    @Json(name = "gender")
    val gender: String?,

    @Json(name = "ageRange")
    val ageRange: String?,

    @Json(name = "balance")
    val balance: Int
)