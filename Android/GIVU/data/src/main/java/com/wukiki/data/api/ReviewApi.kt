package com.wukiki.data.api

import com.wukiki.data.entity.ReviewEntity
import retrofit2.Response
import retrofit2.http.POST
import retrofit2.http.Path

interface ReviewApi {

    @POST("fundings/reviews/{fundingId}")
    suspend fun postFundingReview(
        @Path("fundingId") fundingId: String
    ): Response<ReviewEntity>
}