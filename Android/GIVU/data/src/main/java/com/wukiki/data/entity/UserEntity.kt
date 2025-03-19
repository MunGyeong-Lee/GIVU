package com.wukiki.data.entity

import com.squareup.moshi.Json
import com.squareup.moshi.JsonClass

@JsonClass(generateAdapter = true)
data class UserEntity(
    @Json(name = "id")
    val id: Int,

    @Json(name = "kakaoid")
    val kakaoid: Int,

    @Json(name = "nickname")
    val nickname: String,

    @Json(name = "email")
    val email: String,

    @Json(name = "birth")
    val birth: String?,

    @Json(name = "profile_image")
    val profileImage: String?,

    @Json(name = "address")
    val address: String?,

    @Json(name = "gender")
    val gender: String,

    @Json(name = "age_range")
    val ageRange: String,

    @Json(name = "balance")
    val balance: Int,

    @Json(name = "created_at")
    val createdAt: String?,

    @Json(name = "updated_at")
    val updatedAt: String?
)