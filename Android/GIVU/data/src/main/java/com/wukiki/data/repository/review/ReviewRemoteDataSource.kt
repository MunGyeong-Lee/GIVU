package com.wukiki.data.repository.review

import com.wukiki.data.entity.ReviewEntity
import com.wukiki.data.entity.ReviewInfoEntity
import okhttp3.MultipartBody
import okhttp3.RequestBody
import retrofit2.Response

interface ReviewRemoteDataSource {

    suspend fun getFundingReviews(): Response<ReviewEntity>

    suspend fun postFundingReview(
        fundingId: String,
        file: MultipartBody.Part?,
        body: RequestBody
    ): Response<ReviewInfoEntity>
}