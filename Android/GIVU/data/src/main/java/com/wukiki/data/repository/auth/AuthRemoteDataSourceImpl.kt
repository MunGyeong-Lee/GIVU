package com.wukiki.data.repository.auth

import com.wukiki.data.api.AuthApi
import com.wukiki.data.entity.KakaoUserEntity
import com.wukiki.data.entity.NewTokenEntity
import com.wukiki.data.entity.UserEntity
import retrofit2.Response
import javax.inject.Inject

class AuthRemoteDataSourceImpl @Inject constructor(
    private val authApi: AuthApi
) : AuthRemoteDataSource {

    override suspend fun loginWithKakao(accessToken: String): Response<KakaoUserEntity> =
        authApi.loginWithKakao(accessToken)

    override suspend fun getUserInfo(): Response<UserEntity> =
        authApi.getUserInfo()

    override suspend fun getNewToken(): Response<NewTokenEntity> =
        authApi.getNewToken()
}