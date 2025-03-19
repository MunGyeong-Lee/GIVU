package com.wukiki.domain.usecase

import com.wukiki.domain.model.ApiResult
import com.wukiki.domain.model.User
import com.wukiki.domain.repository.AuthRepository
import com.wukiki.domain.repository.DataStoreRepository
import kotlinx.coroutines.flow.Flow
import okhttp3.RequestBody
import javax.inject.Inject

class GetAuthUseCase @Inject constructor(
    private val authRepository: AuthRepository,
    private val dataStoreRepository: DataStoreRepository
) {

    suspend fun loginWithKakao(accessToken: String, body: RequestBody): ApiResult<User?> =
        authRepository.loginWithKakao(accessToken, body)

    suspend fun setUserInfo(userInfo: User) = dataStoreRepository.setUserInfo(userInfo)

    fun getUserId(): Flow<String?> = dataStoreRepository.getUserId()

    fun getUserInfo(): Flow<User?> = dataStoreRepository.getUserInfo()
}