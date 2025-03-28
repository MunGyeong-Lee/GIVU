package com.wukiki.domain.model

data class Payment(
    val transactionId: String,
    val userId: String,
    val relatedFundingId: String,
    val relatedProductId: String,
    val transactionType: String,
    val amount: String,
    val status: String,
    val date: String
)