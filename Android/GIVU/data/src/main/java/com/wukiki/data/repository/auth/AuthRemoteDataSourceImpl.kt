package com.wukiki.data.repository.auth

import com.wukiki.data.api.AuthApi
import com.wukiki.data.entity.UserEntity
import okhttp3.RequestBody
import retrofit2.Response
import javax.inject.Inject

class AuthRemoteDataSourceImpl @Inject constructor(
    private val authApi: AuthApi
) : AuthRemoteDataSource {

    override suspend fun loginWithKakao(
        accessToken: String,
        body: RequestBody
    ): Response<UserEntity> =
        authApi.loginWithKakao(accessToken, body)
}