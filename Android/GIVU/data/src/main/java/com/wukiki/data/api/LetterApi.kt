package com.wukiki.data.api

import com.wukiki.data.entity.LetterEntity
import okhttp3.MultipartBody
import okhttp3.RequestBody
import retrofit2.Response
import retrofit2.http.DELETE
import retrofit2.http.Multipart
import retrofit2.http.POST
import retrofit2.http.Part
import retrofit2.http.Path

interface LetterApi {

    @Multipart
    @POST("fundings/letters/{fundingId}")
    suspend fun postFundingLetter(
        @Path("fundingId") fundingId: String,
        @Part image: MultipartBody.Part?,
        @Part("data") body: RequestBody
    ): Response<LetterEntity>

    @DELETE("fundings/letters/{fundingId}")
    suspend fun deleteFundingLetter(
        @Path("fundingId") fundingId: String
    ): Response<Unit>
}