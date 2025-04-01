package com.wukiki.domain.repository

import com.wukiki.domain.model.ApiResult
import com.wukiki.domain.model.Review

interface ReviewRepository {

    suspend fun registerFundingReview(fundingId: Int): ApiResult<Review>
}