package com.wukiki.domain.repository

import com.wukiki.domain.model.ApiResult
import com.wukiki.domain.model.User
import okhttp3.RequestBody

interface AuthRepository {

    suspend fun loginWithKakao(accessToken: String, body: RequestBody): ApiResult<User>
}