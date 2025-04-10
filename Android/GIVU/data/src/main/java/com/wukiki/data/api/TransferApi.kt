package com.wukiki.data.api

import com.wukiki.data.entity.FundingTransferEntity
import com.wukiki.data.entity.FundingTransferRefundEntity
import com.wukiki.data.entity.FundingTransferSuccessEntity
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

    @POST("transfer/{fundingId}/refund")
    suspend fun postFundingTransferRefund(
        @Path("fundingId") fundingId: String
    ): Response<FundingTransferRefundEntity>

    @POST("transfer/{fundingId}/success")
    suspend fun postFundingTransferSuccess(
        @Path("fundingId") fundingId: String
    ): Response<FundingTransferSuccessEntity>
}