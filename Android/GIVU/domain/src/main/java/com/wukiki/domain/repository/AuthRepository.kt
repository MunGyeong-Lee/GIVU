package com.wukiki.domain.repository

import com.wukiki.domain.model.ApiResult
import com.wukiki.domain.model.KakaoUser
import com.wukiki.domain.model.User

interface AuthRepository {

    suspend fun loginWithKakao(accessToken: String): ApiResult<KakaoUser>

    suspend fun getUserInfo(): ApiResult<User>

    suspend fun getNewToken(): ApiResult<String>
}