package com.wukiki.domain.usecase

import com.wukiki.domain.model.ApiResult
import com.wukiki.domain.model.Review
import com.wukiki.domain.repository.ReviewRepository
import kotlinx.coroutines.flow.Flow
import okhttp3.MultipartBody
import okhttp3.RequestBody
import javax.inject.Inject

class GetReviewUseCase @Inject constructor(
    private val reviewRepository: ReviewRepository
) {

    suspend fun fetchFundingReviews(): Flow<ApiResult<List<Review>>> =
        reviewRepository.fetchFundingReviews()

    suspend fun finishReview(
        fundingId: Int,
        file: MultipartBody.Part?,
        body: RequestBody
    ): Flow<ApiResult<Review>> = reviewRepository.registerFundingReview(fundingId, file, body)
}