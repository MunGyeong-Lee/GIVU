package com.wukiki.domain.repository

import com.wukiki.domain.model.Account
import com.wukiki.domain.model.ApiResult
import okhttp3.RequestBody

interface MyPageRepository {

    suspend fun depositGivuPay(body: RequestBody): ApiResult<Account>

    suspend fun withdrawGivuPay(body: RequestBody): ApiResult<Account>

    suspend fun fetchAccount(): ApiResult<Int>

    suspend fun createAccount(): ApiResult<String>
}