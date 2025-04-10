package com.wukiki.data.repository.transfer

import com.wukiki.data.entity.FundingTransferEntity
import com.wukiki.data.entity.FundingTransferRefundEntity
import com.wukiki.data.entity.FundingTransferSuccessEntity
import com.wukiki.data.entity.PaymentEntity
import retrofit2.Response

interface TransferRemoteDataSource {

    suspend fun postFundingTransfer(fundingId: String, amount: Int): Response<FundingTransferEntity>

    suspend fun getPaymentHistory(): Response<PaymentEntity>

    suspend fun postFundingTransferRefund(fundingId: String): Response<FundingTransferRefundEntity>

    suspend fun postFundingTransferSuccess(fundingId: String): Response<FundingTransferSuccessEntity>
}