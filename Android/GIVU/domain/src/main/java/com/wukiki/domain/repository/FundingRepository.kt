package com.wukiki.domain.repository

import com.wukiki.domain.model.ApiResult
import com.wukiki.domain.model.Funding
import com.wukiki.domain.model.FundingDetail
import com.wukiki.domain.model.Transfer
import kotlinx.coroutines.flow.Flow
import okhttp3.MultipartBody
import okhttp3.RequestBody

interface FundingRepository {

    suspend fun registerFunding(
        files: List<MultipartBody.Part>,
        body: RequestBody
    ): Flow<ApiResult<Funding>>

    suspend fun fetchFundingDetail(fundingId: Int): Flow<ApiResult<FundingDetail>>

    suspend fun updateFundingDetail(
        fundingId: Int,
        files: List<MultipartBody.Part>,
        body: RequestBody
    ): Flow<ApiResult<Funding>>

    suspend fun deleteFundingDetail(fundingId: Int): Flow<ApiResult<Unit>>

    suspend fun updateFundingComplete(fundingId: Int): Flow<ApiResult<Funding>>

    suspend fun updateFundingImage(fundingId: Int, file: MultipartBody.Part): Flow<ApiResult<String>>

    suspend fun fetchFundings(): Flow<ApiResult<List<Funding>>>

    suspend fun transferFunding(fundingId: Int, amount: Int): Flow<ApiResult<Transfer>>

    suspend fun getPaymentOfFunding(paymentId: Int): Flow<ApiResult<Transfer>>

    suspend fun searchFundings(title: String): Flow<ApiResult<List<Funding>>>
}