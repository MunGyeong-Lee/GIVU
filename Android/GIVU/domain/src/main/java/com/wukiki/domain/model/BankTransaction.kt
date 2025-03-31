package com.wukiki.domain.model

data class BankTransaction(
    val id: String,
    val transactionType: String,
    val amount: String,
    val bankName: String,
    val date: String
)