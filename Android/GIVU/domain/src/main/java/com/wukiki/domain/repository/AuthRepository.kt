package com.wukiki.domain.repository

import com.wukiki.domain.model.ApiResult
import com.wukiki.domain.model.KakaoUser
import com.wukiki.domain.model.User
import kotlinx.coroutines.flow.Flow

interface AuthRepository {

    suspend fun loginWithKakao(accessToken: String): Flow<ApiResult<KakaoUser>>

    suspend fun getUserInfo(): Flow<ApiResult<User>>

    suspend fun getNewToken(): ApiResult<String>
}