package com.wukiki.data.repository.review

import com.wukiki.data.entity.ReviewEntity
import okhttp3.MultipartBody
import okhttp3.RequestBody
import retrofit2.Response

interface ReviewRemoteDataSource {

    suspend fun postFundingReview(
        fundingId: String,
        file: MultipartBody.Part?,
        body: RequestBody
    ): Response<ReviewEntity>
}