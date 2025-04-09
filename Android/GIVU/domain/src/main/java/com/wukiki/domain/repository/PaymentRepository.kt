package com.wukiki.domain.repository

import com.wukiki.domain.model.Payment

interface PaymentRepository {
    suspend fun getPaymentHistory(userId: Int): List<Payment>
}