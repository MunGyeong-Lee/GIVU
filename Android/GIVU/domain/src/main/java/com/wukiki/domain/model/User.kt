package com.wukiki.domain.model

data class User(
    val id: String,
    val kakaoid: String,
    val nickname: String,
    val email: String,
    val birth: String,
    val profileImage: String,
    val address: String,
    val gender: String,
    val ageRange: String,
    val balance: String,
    val createdAt: String,
    val updatedAt: String
)