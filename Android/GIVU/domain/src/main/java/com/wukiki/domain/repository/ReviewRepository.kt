package com.wukiki.domain.repository

import com.wukiki.domain.model.ApiResult
import com.wukiki.domain.model.Review
import kotlinx.coroutines.flow.Flow
import okhttp3.MultipartBody
import okhttp3.RequestBody

interface ReviewRepository {

    suspend fun registerFundingReview(
        fundingId: Int,
        file: MultipartBody.Part?,
        body: RequestBody
    ): Flow<ApiResult<Review>>
}