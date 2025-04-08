package com.wukiki.domain.usecase

import com.wukiki.domain.model.ApiResult
import com.wukiki.domain.model.Funding
import com.wukiki.domain.model.FundingDetail
import com.wukiki.domain.model.Transfer
import com.wukiki.domain.repository.FundingRepository
import kotlinx.coroutines.flow.Flow
import okhttp3.MultipartBody
import okhttp3.RequestBody
import javax.inject.Inject

class GetFundingUseCase @Inject constructor(
    private val fundingRepository: FundingRepository
) {

    suspend fun registerFunding(
        files: List<MultipartBody.Part>,
        body: RequestBody
    ): Flow<ApiResult<Funding>> = fundingRepository.registerFunding(files, body)

    suspend fun fetchFundingDetail(fundingId: Int): Flow<ApiResult<FundingDetail>> =
        fundingRepository.fetchFundingDetail(fundingId)

    suspend fun updateFundingDetail(
        fundingId: Int,
        files: List<MultipartBody.Part>,
        body: RequestBody
    ): Flow<ApiResult<Funding>> = fundingRepository.updateFundingDetail(fundingId, files, body)

    suspend fun completeFunding(fundingId: Int): Flow<ApiResult<Funding>> =
        fundingRepository.updateFundingComplete(fundingId)

    suspend fun cancelFunding(fundingId: Int): Flow<ApiResult<Unit>> =
        fundingRepository.deleteFundingDetail(fundingId)

    suspend fun fetchFundings(): Flow<ApiResult<List<Funding>>> =
        fundingRepository.fetchFundings()

    suspend fun transferFunding(fundingId: Int, amount: Int): Flow<ApiResult<Transfer>> =
        fundingRepository.transferFunding(fundingId, amount)

    suspend fun fetchPaymentOfFunding(paymentId: Int): Flow<ApiResult<Transfer>> =
        fundingRepository.getPaymentOfFunding(paymentId)

    suspend fun searchFundings(title: String): Flow<ApiResult<List<Funding>>> =
        fundingRepository.searchFundings(title)
}