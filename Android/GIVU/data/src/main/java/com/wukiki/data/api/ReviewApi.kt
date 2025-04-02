package com.wukiki.data.api

import com.wukiki.data.entity.ReviewEntity
import okhttp3.MultipartBody
import okhttp3.RequestBody
import retrofit2.Response
import retrofit2.http.Multipart
import retrofit2.http.POST
import retrofit2.http.Part
import retrofit2.http.Path

interface ReviewApi {

    @Multipart
    @POST("fundings/reviews/{fundingId}")
    suspend fun postFundingReview(
        @Path("fundingId") fundingId: String,
        @Part file: MultipartBody.Part?,
        @Part("data") body: RequestBody
    ): Response<ReviewEntity>
}