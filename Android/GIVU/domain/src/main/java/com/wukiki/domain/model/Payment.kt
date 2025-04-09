package com.wukiki.domain.model

data class Payment(
    val paymentId: String,
    val userId: String,
    val fundingTitle: String,
    val productName: String?,
    val amount: String,
    val transactionType: String,
    val date: String
)