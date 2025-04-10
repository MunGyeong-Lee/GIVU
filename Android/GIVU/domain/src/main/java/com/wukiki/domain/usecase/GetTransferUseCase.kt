package com.wukiki.domain.usecase

import com.wukiki.domain.model.ApiResult
import com.wukiki.domain.model.Transfer
import com.wukiki.domain.repository.TransferRepository
import kotlinx.coroutines.flow.Flow
import javax.inject.Inject

class GetTransferUseCase @Inject constructor(
    private val transferRepository: TransferRepository
) {

    suspend fun transferFunding(fundingId: Int, amount: Int): Flow<ApiResult<Transfer>> =
        transferRepository.transferFunding(fundingId, amount)

    suspend fun refundFunding(fundingId: String): Flow<ApiResult<String>> =
        transferRepository.refundTransfer(fundingId)

    suspend fun successFunding(fundingId: String): Flow<ApiResult<String>> =
        transferRepository.successTransfer(fundingId)
}