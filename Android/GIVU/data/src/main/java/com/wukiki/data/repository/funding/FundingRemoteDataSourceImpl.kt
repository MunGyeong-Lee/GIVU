package com.wukiki.data.repository.funding

import com.wukiki.data.api.FundingApi
import com.wukiki.data.entity.FundingEntity
import com.wukiki.data.entity.FundingImageEntity
import okhttp3.MultipartBody
import okhttp3.RequestBody
import retrofit2.Response
import javax.inject.Inject

class FundingRemoteDataSourceImpl @Inject constructor(
    private val fundingApi: FundingApi
) : FundingRemoteDataSource {

    override suspend fun postFunding(
        files: List<MultipartBody.Part>,
        body: RequestBody
    ): Response<FundingEntity> = fundingApi.postFunding(files, body)

    override suspend fun postFundingDetail(
        fundingId: String,
        files: List<MultipartBody.Part>,
        body: RequestBody
    ): Response<FundingEntity> = fundingApi.postFundingDetail(fundingId, files, body)

    override suspend fun deleteFundingDetail(fundingId: String): Response<Unit> =
        fundingApi.deleteFundingDetail(fundingId)

    override suspend fun putFundingImage(
        fundingId: String,
        file: MultipartBody.Part
    ): Response<FundingImageEntity> = fundingApi.putFundingImage(fundingId, file)

    override suspend fun getFundings(): Response<List<FundingEntity>> = fundingApi.getFundings()
}