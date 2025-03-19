package com.wukiki.data.repository.auth

import com.wukiki.data.mapper.UserMapper
import com.wukiki.domain.model.ApiResult
import com.wukiki.domain.model.User
import com.wukiki.domain.repository.AuthRepository
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.RequestBody
import javax.inject.Inject

class AuthRepositoryImpl @Inject constructor(
    private val authRemoteDataSource: AuthRemoteDataSource
) : AuthRepository {

    override suspend fun loginWithKakao(accessToken: String, body: RequestBody): ApiResult<User> =
        try {
            val response = withContext(CoroutineScope(Dispatchers.IO).coroutineContext) {
                authRemoteDataSource.loginWithKakao(accessToken, body)
            }

            val responseBody = response.body()
            if (response.isSuccessful && (responseBody != null)) {
                ApiResult.success(UserMapper(responseBody))
            } else {
                ApiResult.error(response.errorBody().toString(), null)
            }
        } catch (e: Exception) {
            ApiResult.fail()
        }
}