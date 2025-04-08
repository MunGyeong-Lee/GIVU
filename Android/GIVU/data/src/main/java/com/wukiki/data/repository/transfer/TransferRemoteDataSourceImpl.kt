package com.wukiki.data.repository.transfer

import com.wukiki.data.api.TransferApi
import com.wukiki.data.entity.FundingTransferEntity
import retrofit2.Response
import javax.inject.Inject

class TransferRemoteDataSourceImpl @Inject constructor(
    private val transferApi: TransferApi
) : TransferRemoteDataSource {

    override suspend fun postFundingTransfer(
        fundingId: String,
        amount: Int
    ): Response<FundingTransferEntity> = transferApi.postFundingTransfer(fundingId, amount)
}