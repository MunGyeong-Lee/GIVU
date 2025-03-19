package com.wukiki.data.repository.auth

import com.wukiki.data.entity.UserEntity
import okhttp3.RequestBody
import retrofit2.Response

interface AuthRemoteDataSource {

    suspend fun loginWithKakao(accessToken: String, body: RequestBody): Response<UserEntity>
}