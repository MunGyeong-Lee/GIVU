package com.wukiki.domain.model

data class Funding(
    val id: Int,
    val userId: Int,
    val userNickname: String,
    val userProfile: String,
    val productId: Int,
    val productName: String,
    val productPrice: String,
    val productImage: String,
    val title: String,
    val body: String,
    val description: String,
    val category: String,
    val categoryName: String,
    val scope: String,
    val participantsNumber: String,
    val fundedAmount: Int,
    val status: String,
    val images: List<String>,
    val createdAt: String,
    val updatedAt: String
)