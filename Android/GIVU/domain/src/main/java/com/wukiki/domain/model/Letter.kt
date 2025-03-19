package com.wukiki.domain.model

data class Letter(
    val letterId: String,
    val fundingId: String,
    val userId: String,
    val comment: String,
    val image: String,
    val private: String,
    val createdAt: String,
    val updatedAt: String
)