package com.wukiki.domain.model

data class Transfer(
    val paymentId: Int,
    val userId: Int,
    val fundingId: Int,
    val productId: Int,
    val amount: Int,
    val transactionType: String,
    val status: String,
    val date: String
)