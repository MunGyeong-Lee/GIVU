package com.wukiki.data.api

import com.wukiki.data.entity.UserEntity
import okhttp3.RequestBody
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.Header
import retrofit2.http.POST

interface AuthApi {

    @POST("auth/kakao")
    suspend fun loginWithKakao(
        @Header("Authorization") accessToken: String,
        @Body user: RequestBody
    ): Response<UserEntity>
}