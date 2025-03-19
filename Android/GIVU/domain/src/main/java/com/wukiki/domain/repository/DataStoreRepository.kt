package com.wukiki.domain.repository

import com.wukiki.domain.model.User
import kotlinx.coroutines.flow.Flow

interface DataStoreRepository {

    suspend fun setUserId(id: String)

    fun getUserId(): Flow<String?>

    suspend fun setUserInfo(userInfo: User)

    fun getUserInfo(): Flow<User?>

    suspend fun logout()
}