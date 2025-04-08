package com.wukiki.domain.usecase

import com.wukiki.domain.model.ApiResult
import com.wukiki.domain.model.Funding
import com.wukiki.domain.model.FundingDetail
import com.wukiki.domain.model.Transfer
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

    suspend fun fetchFundingDetail(fundingId: Int): ApiResult<FundingDetail> =
        fundingRepository.fetchFundingDetail(fundingId)

    suspend fun updateFundingDetail(
        fundingId: Int,
        files: List<MultipartBody.Part>,
        body: RequestBody
    ): ApiResult<Funding> = fundingRepository.updateFundingDetail(fundingId, files, body)

    suspend fun completeFunding(fundingId: Int): ApiResult<Funding> =
        fundingRepository.updateFundingComplete(fundingId)

    suspend fun cancelFunding(fundingId: Int): ApiResult<Unit> =
        fundingRepository.deleteFundingDetail(fundingId)

    suspend fun fetchFundings(): ApiResult<List<Funding>> =
        fundingRepository.fetchFundings()

    suspend fun transferFunding(fundingId: Int, amount: Int): ApiResult<Transfer> =
        fundingRepository.transferFunding(fundingId, amount)

    suspend fun searchFundings(title: String): ApiResult<List<Funding>> =
        fundingRepository.searchFundings(title)
}