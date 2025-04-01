package com.wukiki.domain.model

data class Review(
    val reviewId: Int,
    val fundingId: Int,
    val userId: Int,
    val comment: String,
    val image: String,
    val createdAt: String,
    val updatedAt: String,
    val visit: String
)