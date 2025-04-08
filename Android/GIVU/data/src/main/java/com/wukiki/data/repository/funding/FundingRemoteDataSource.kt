package com.wukiki.data.repository.funding

import com.wukiki.data.entity.FundingDetailEntity
import com.wukiki.data.entity.FundingEntity
import com.wukiki.data.entity.FundingImageEntity
import com.wukiki.data.entity.FundingSearchEntity
import com.wukiki.data.entity.FundingTransferEntity
import okhttp3.MultipartBody
import okhttp3.RequestBody
import retrofit2.Response

interface FundingRemoteDataSource {

    suspend fun postFunding(
        files: List<MultipartBody.Part>,
        body: RequestBody
    ): Response<FundingEntity>

    suspend fun getFundingDetail(fundingId: String): Response<FundingDetailEntity>

    suspend fun postFundingDetail(
        fundingId: String,
        files: List<MultipartBody.Part>,
        body: RequestBody
    ): Response<FundingEntity>

    suspend fun deleteFundingDetail(fundingId: String): Response<Unit>

    suspend fun putFundingComplete(fundingId: String): Response<FundingEntity>

    suspend fun putFundingImage(
        fundingId: String,
        file: MultipartBody.Part
    ): Response<FundingImageEntity>

    suspend fun getFundings(): Response<List<FundingEntity>>

    suspend fun postFundingTransfer(fundingId: String, amount: Int): Response<FundingTransferEntity>

    suspend fun getFundingSearch(title: String): Response<FundingSearchEntity>
}