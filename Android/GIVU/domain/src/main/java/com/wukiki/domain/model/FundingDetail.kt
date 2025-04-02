package com.wukiki.domain.model

data class FundingDetail(
    val id: Int,
    val title: String,
    val description: String,
    val category: String,
    val categoryName: String,
    val scope: String,
    val participantsNumber: String,
    val fundedAmount: Int,
    val status: String,
    val images: List<String>,
    val createdAt: String,
    val updatedAt: String,
    val writerId: Int,
    val writerNickname: String,
    val writerProfile: String,
    val productId: Int,
    val productName: String,
    val productPrice: String,
    val productImage: String,
    val letters: List<Letter>,
    val reviews: List<Review>
)