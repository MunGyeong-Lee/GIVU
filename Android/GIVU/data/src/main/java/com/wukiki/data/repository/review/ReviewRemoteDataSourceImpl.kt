package com.wukiki.data.repository.review

import com.wukiki.data.api.ReviewApi
import com.wukiki.data.entity.ReviewEntity
import retrofit2.Response
import javax.inject.Inject

class ReviewRemoteDataSourceImpl @Inject constructor(
    private val reviewApi: ReviewApi
) : ReviewRemoteDataSource {

    override suspend fun postFundingReview(fundingId: String): Response<ReviewEntity> =
        reviewApi.postFundingReview(fundingId)
}