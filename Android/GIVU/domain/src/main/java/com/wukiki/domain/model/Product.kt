package com.wukiki.domain.model

data class Product(
    val productId: String,
    val productName: String,
    val category: String,
    val price: String,
    val image: String,
    val favorite: String,
    val star: String,
    val createdAt: String,
    val description: String
)