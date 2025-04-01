package com.wukiki.data.api

import com.wukiki.data.entity.FundingEntity
import com.wukiki.data.entity.FundingImageEntity
import okhttp3.MultipartBody
import okhttp3.RequestBody
import retrofit2.Response
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.Multipart
import retrofit2.http.POST
import retrofit2.http.PUT
import retrofit2.http.Part
import retrofit2.http.Path

interface FundingApi {

    @Multipart
    @POST("fundings")
    suspend fun postFunding(
        @Part files: List<MultipartBody.Part>,
        @Part("data") body: RequestBody
    ): Response<FundingEntity>

    @POST("fundings/{fundingId}")
    suspend fun postFundingDetail(
        @Path("fundingId") fundingId: String,
        @Part files: List<MultipartBody.Part>,
        @Part("data") body: RequestBody
    ): Response<FundingEntity>

    @DELETE("fundings/{fundingId}")
    suspend fun deleteFundingDetail(
        @Path("fundingId") fundingId: String
    ): Response<Void>

    @PUT("fundings/{fundingId}/image")
    suspend fun putFundingImage(
        @Path("fundingId") fundingId: String,
        @Part file: MultipartBody.Part,
    ): Response<FundingImageEntity>

    @GET("fundings/list")
    suspend fun getFundings(): Response<List<FundingEntity>>
}