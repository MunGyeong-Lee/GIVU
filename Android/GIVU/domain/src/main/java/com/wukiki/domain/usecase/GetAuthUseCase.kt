package com.wukiki.domain.usecase

import com.wukiki.domain.model.ApiResult
import com.wukiki.domain.model.KakaoUser
import com.wukiki.domain.model.User
import com.wukiki.domain.repository.AuthRepository
import com.wukiki.domain.repository.DataStoreRepository
import kotlinx.coroutines.flow.Flow
import javax.inject.Inject

class GetAuthUseCase @Inject constructor(
    private val authRepository: AuthRepository,
    private val dataStoreRepository: DataStoreRepository
) {

    suspend fun loginWithKakao(accessToken: String): ApiResult<KakaoUser> =
        authRepository.loginWithKakao(accessToken)

    suspend fun fetchUserInfo(): ApiResult<User> =
        authRepository.getUserInfo()

    suspend fun setUserInfo(userInfo: User) = dataStoreRepository.setUserInfo(userInfo)

    fun getUserId(): Flow<String?> = dataStoreRepository.getUserId()

    fun getUserInfo(): Flow<User?> = dataStoreRepository.getUserInfo()

    suspend fun setJwt(jwt: String) = dataStoreRepository.setJwt(jwt)

    fun getJwt(): Flow<String?> = dataStoreRepository.getJwt()

    suspend fun logout() = dataStoreRepository.logout()
}