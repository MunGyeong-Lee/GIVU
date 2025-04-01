package com.wukiki.domain.usecase

import com.wukiki.domain.model.ApiResult
import com.wukiki.domain.model.Funding
import com.wukiki.domain.repository.FundingRepository
import okhttp3.MultipartBody
import okhttp3.RequestBody
import javax.inject.Inject

class GetFundingUseCase @Inject constructor(
    private val fundingRepository: FundingRepository
) {

    suspend fun registerFunding(
        files: List<MultipartBody.Part>,
        body: RequestBody
    ): ApiResult<Funding> = fundingRepository.registerFunding(files, body)

    suspend fun updateFundingDetail(
        fundingId: Int,
        files: List<MultipartBody.Part>,
        body: RequestBody
    ): ApiResult<Funding> = fundingRepository.updateFundingDetail(fundingId, files, body)

    suspend fun cancelFunding(fundingId: Int): ApiResult<Unit> =
        fundingRepository.deleteFundingDetail(fundingId)

    suspend fun fetchFundings(): ApiResult<List<Funding>> =
        fundingRepository.fetchFundings()
}