package com.wukiki.domain.repository

import com.wukiki.domain.model.ApiResult
import com.wukiki.domain.model.Funding
import com.wukiki.domain.model.FundingDetail
import okhttp3.MultipartBody
import okhttp3.RequestBody

interface FundingRepository {

    suspend fun registerFunding(
        files: List<MultipartBody.Part>,
        body: RequestBody
    ): ApiResult<Funding>

    suspend fun fetchFundingDetail(fundingId: Int): ApiResult<FundingDetail>

    suspend fun updateFundingDetail(
        fundingId: Int,
        files: List<MultipartBody.Part>,
        body: RequestBody
    ): ApiResult<Funding>

    suspend fun deleteFundingDetail(fundingId: Int): ApiResult<Unit>

    suspend fun updateFundingImage(fundingId: Int, file: MultipartBody.Part): ApiResult<String>

    suspend fun fetchFundings(): ApiResult<List<Funding>>
}