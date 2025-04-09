package com.wukiki.data.api

import com.wukiki.data.entity.FundingTransferEntity
import com.wukiki.data.entity.PaymentEntity
import retrofit2.Response
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Path
import retrofit2.http.Query

interface TransferApi {
    @GET("transfer/paymentHistory")
    suspend fun getPaymentHistory(): Response<PaymentEntity>

    @POST("transfer/{fundingId}")
    suspend fun postFundingTransfer(
        @Path("fundingId") fundingId: String,
        @Query("amount") amount: Int
    ): Response<FundingTransferEntity>
}