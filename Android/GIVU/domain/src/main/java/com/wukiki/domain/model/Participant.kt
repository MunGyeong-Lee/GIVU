package com.wukiki.domain.model

data class Participant(
    val userId: String,
    val fundingId: String,
    val fundingAmount: String,
    val joinedAt: String,
    val refundStatus: String
)