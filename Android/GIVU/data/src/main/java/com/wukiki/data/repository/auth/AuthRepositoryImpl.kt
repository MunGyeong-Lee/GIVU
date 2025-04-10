package com.wukiki.data.repository.auth

import android.util.Log
import com.wukiki.data.mapper.KakaoUserMapper
import com.wukiki.data.mapper.UserMapper
import com.wukiki.domain.model.ApiResult
import com.wukiki.domain.model.KakaoUser
import com.wukiki.domain.model.User
import com.wukiki.domain.repository.AuthRepository
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.withContext
import javax.inject.Inject

class AuthRepositoryImpl @Inject constructor(
    private val authRemoteDataSource: AuthRemoteDataSource
) : AuthRepository {

    override suspend fun loginWithKakao(accessToken: String): Flow<ApiResult<KakaoUser>> =
        flow {
            emit(ApiResult.loading(null))
            try {
                val response = withContext(CoroutineScope(Dispatchers.IO).coroutineContext) {
                    authRemoteDataSource.loginWithKakao(accessToken)
                }

                val responseBody = response.body()
                Log.d("AuthRepositoryImpl", "Response: $responseBody")
                if (response.isSuccessful && (responseBody != null)) {
                    Log.d("AuthRepositoryImpl", "loginWithKakao Success")
                    emit(ApiResult.success(KakaoUserMapper(responseBody)))
                } else {
                    Log.d("AuthRepositoryImpl", "loginWithKakao Fail: ${response.code()}")
                    emit(ApiResult.error(response.errorBody().toString(), null))
                }
            } catch (e: Exception) {
                Log.e("AuthRepositoryImpl", "loginWithKakao Error: $e")
                emit(ApiResult.fail())
            }
        }

    override suspend fun getUserInfo(): Flow<ApiResult<User>> =
        flow {
            emit(ApiResult.loading(null))
            try {
                val response = withContext(CoroutineScope(Dispatchers.IO).coroutineContext) {
                    authRemoteDataSource.getUserInfo()
                }

                val responseBody = response.body()
                Log.d("AuthRepositoryImpl", "Response: $responseBody")
                if (response.isSuccessful && (responseBody != null)) {
                    Log.d("AuthRepositoryImpl", "getUserInfo Success")
                    emit(ApiResult.success(UserMapper(responseBody)))
                } else {
                    Log.d("AuthRepositoryImpl", "getUserInfo Fail: ${response.code()}")
                    emit(ApiResult.error(response.errorBody().toString(), null))
                }
            } catch (e: Exception) {
                Log.e("AuthRepositoryImpl", "getUserInfo Error: $e")
                emit(ApiResult.fail())
            }
        }

    override suspend fun getNewToken(): ApiResult<String> =
        try {
            val response = withContext(CoroutineScope(Dispatchers.IO).coroutineContext) {
                authRemoteDataSource.getNewToken()
            }

            val responseBody = response.body()
            if (response.isSuccessful && (responseBody != null)) {
                ApiResult.success(responseBody.data.accessToken)
            } else {
                ApiResult.error(response.errorBody().toString(), null)
            }
        } catch (e: Exception) {
            ApiResult.fail()
        }
}