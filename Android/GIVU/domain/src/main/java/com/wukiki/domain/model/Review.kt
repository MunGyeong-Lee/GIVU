package com.wukiki.domain.model

data class Review(
    val reviewId: String,
    val fundingId: String,
    val userId: String,
    val comment: String,
    val image: String,
    val createdAt: String,
    val updatedAt: String,
    val visit: String
)