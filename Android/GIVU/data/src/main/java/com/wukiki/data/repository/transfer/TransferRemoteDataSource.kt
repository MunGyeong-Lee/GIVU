package com.wukiki.data.repository.transfer

import com.wukiki.data.entity.FundingTransferEntity
import retrofit2.Response

interface TransferRemoteDataSource {

    suspend fun postFundingTransfer(fundingId: String, amount: Int): Response<FundingTransferEntity>
}