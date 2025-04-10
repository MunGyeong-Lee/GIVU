package com.wukiki.data.repository.review

import com.wukiki.data.api.ReviewApi
import com.wukiki.data.entity.ReviewEntity
import com.wukiki.data.entity.ReviewInfoEntity
import okhttp3.MultipartBody
import okhttp3.RequestBody
import retrofit2.Response
import javax.inject.Inject

class ReviewRemoteDataSourceImpl @Inject constructor(
    private val reviewApi: ReviewApi
) : ReviewRemoteDataSource {

    override suspend fun getFundingReviews(): Response<ReviewEntity> = reviewApi.getFundingReviews()

    override suspend fun postFundingReview(
        fundingId: String,
        file: MultipartBody.Part?,
        body: RequestBody
    ): Response<ReviewInfoEntity> =
        reviewApi.postFundingReview(fundingId, file, body)
}