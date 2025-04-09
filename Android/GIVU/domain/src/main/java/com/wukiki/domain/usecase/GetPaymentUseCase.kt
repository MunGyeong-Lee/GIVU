package com.wukiki.domain.usecase

import com.wukiki.domain.model.ApiResult
import com.wukiki.domain.model.Payment
import com.wukiki.domain.repository.TransferRepository
import kotlinx.coroutines.flow.Flow
import retrofit2.Response
import javax.inject.Inject

class GetPaymentUseCase @Inject constructor(
    private val transferRepository: TransferRepository
) {

    suspend fun getPaymentHistoryList(): Flow<ApiResult<List<Payment>>> =
        transferRepository.getPaymentHistory()
}