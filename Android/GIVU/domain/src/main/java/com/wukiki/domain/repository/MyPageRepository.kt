package com.wukiki.domain.repository

import com.wukiki.domain.model.Account
import com.wukiki.domain.model.ApiResult
import com.wukiki.domain.model.Funding
import kotlinx.coroutines.flow.Flow
import okhttp3.RequestBody

interface MyPageRepository {

    suspend fun depositGivuPay(body: RequestBody): Flow<ApiResult<Pair<Int, Int>>>

    suspend fun withdrawGivuPay(body: RequestBody): Flow<ApiResult<Pair<Int, Int>>>

    suspend fun fetchAccount(): Flow<ApiResult<Account>>

    suspend fun createAccount(): Flow<ApiResult<String>>

    suspend fun fetchMyRegisterFundings(): Flow<ApiResult<List<Funding>>>

    suspend fun fetchMyParticipateFundings(): Flow<ApiResult<List<Funding>>>
}