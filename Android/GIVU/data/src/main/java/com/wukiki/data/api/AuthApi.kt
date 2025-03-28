package com.wukiki.data.api

import com.wukiki.data.entity.KakaoUserEntity
import com.wukiki.data.entity.NewTokenEntity
import com.wukiki.data.entity.UserEntity
import retrofit2.Response
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Query

interface AuthApi {

    @POST("users/kakao")
    suspend fun loginWithKakao(
        @Query("accessToken") accessToken: String
    ): Response<KakaoUserEntity>

    @GET("users/info")
    suspend fun getUserInfo(): Response<UserEntity>

    @GET("users/newToken")
    suspend fun getNewToken(): Response<NewTokenEntity>
}