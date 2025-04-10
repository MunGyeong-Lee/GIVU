package com.wukiki.domain.model

data class ProductReview(
    val reviewId: Int,
    val title: String,
    val body: String,
    val image: String,
    val star: Double,

    val userId: Int,
    val nickname: String,
    val userImage: String
)
