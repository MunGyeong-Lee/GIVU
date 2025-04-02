package com.wukiki.domain.usecase

import com.wukiki.domain.model.ApiResult
import com.wukiki.domain.model.Review
import com.wukiki.domain.repository.ReviewRepository
import okhttp3.MultipartBody
import okhttp3.RequestBody
import javax.inject.Inject

class GetReviewUseCase @Inject constructor(
    private val reviewRepository: ReviewRepository
) {

    suspend fun finishReview(
        fundingId: Int,
        file: MultipartBody.Part?,
        body: RequestBody
    ): ApiResult<Review> = reviewRepository.registerFundingReview(fundingId, file, body)
}