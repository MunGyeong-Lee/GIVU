package com.wukiki.domain.model

data class Payment(
    val paymentId: Int,
    val userId: Int,
    val fundingTitle: String?,
    val productName: String?,
    val amount: Int,
    val transactionType: String,
    val date: String
)