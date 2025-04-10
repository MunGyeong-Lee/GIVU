package com.wukiki.domain.model

data class ProductDetail(
    val product: Product,
    val likeCount: Int,
    val isLiked: Boolean
)