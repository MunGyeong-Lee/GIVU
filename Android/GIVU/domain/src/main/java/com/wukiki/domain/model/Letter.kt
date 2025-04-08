package com.wukiki.domain.model

data class Letter(
    val letterId: String,
    val isCreator: Boolean,
    val fundingId: String,
    val userId: Int,
    val userNickname: String,
    val userProfile: String,
    val comment: String,
    val image: String,
    val access: String,
    val createdAt: String,
    val updatedAt: String
)