package com.wukiki.domain.model

data class Funding(
    val id: String,
    val userId: String,
    val productId: String,
    val title: String,
    val body: String,
    val description: String,
    val category: String,
    val categoryName: String,
    val scope: String,
    val participantsNumber: String,
    val fundedAmount: String,
    val status: String,
    val images: List<String>,
    val createdAt: String,
    val updatedAt: String
)