package com.wukiki.data.repository.auth

import com.wukiki.data.entity.KakaoUserEntity
import com.wukiki.data.entity.NewTokenEntity
import com.wukiki.data.entity.UserEntity
import retrofit2.Response

interface AuthRemoteDataSource {

    suspend fun loginWithKakao(accessToken: String): Response<KakaoUserEntity>

    suspend fun getUserInfo(): Response<UserEntity>

    suspend fun getNewToken(): Response<NewTokenEntity>
}