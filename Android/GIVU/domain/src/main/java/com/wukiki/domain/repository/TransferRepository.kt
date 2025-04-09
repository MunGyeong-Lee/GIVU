package com.wukiki.domain.repository

import com.wukiki.domain.model.ApiResult
import com.wukiki.domain.model.Payment
import com.wukiki.domain.model.Transfer
import kotlinx.coroutines.flow.Flow

interface TransferRepository {

    suspend fun transferFunding(fundingId: Int, amount: Int): Flow<ApiResult<Transfer>>

    suspend fun getPaymentHistory(): Flow<ApiResult<List<Payment>>>
}