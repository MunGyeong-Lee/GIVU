package com.wukiki.data.repository.transfer

import com.wukiki.data.api.TransferApi
import com.wukiki.data.entity.FundingTransferEntity
import com.wukiki.data.entity.FundingTransferRefundEntity
import com.wukiki.data.entity.FundingTransferSuccessEntity
import com.wukiki.data.entity.PaymentEntity
import retrofit2.Response
import javax.inject.Inject

class TransferRemoteDataSourceImpl @Inject constructor(
    private val transferApi: TransferApi
) : TransferRemoteDataSource {

    override suspend fun postFundingTransfer(
        fundingId: String,
        amount: Int
    ): Response<FundingTransferEntity> = transferApi.postFundingTransfer(fundingId, amount)

    override suspend fun getPaymentHistory(): Response<PaymentEntity> =
        transferApi.getPaymentHistory()

    override suspend fun postFundingTransferRefund(fundingId: String): Response<FundingTransferRefundEntity> =
        transferApi.postFundingTransferRefund(fundingId)

    override suspend fun postFundingTransferSuccess(fundingId: String): Response<FundingTransferSuccessEntity> =
        transferApi.postFundingTransferSuccess(fundingId)
}