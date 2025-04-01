package com.wukiki.data.repository.review

import com.wukiki.data.entity.ReviewEntity
import retrofit2.Response

interface ReviewRemoteDataSource {

    suspend fun postFundingReview(fundingId: String): Response<ReviewEntity>
}