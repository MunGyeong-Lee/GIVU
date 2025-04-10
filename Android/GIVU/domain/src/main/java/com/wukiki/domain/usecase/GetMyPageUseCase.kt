package com.wukiki.domain.usecase

import com.wukiki.domain.model.Account
import com.wukiki.domain.model.ApiResult
import com.wukiki.domain.model.Funding
import com.wukiki.domain.repository.MyPageRepository
import kotlinx.coroutines.flow.Flow
import okhttp3.RequestBody
import javax.inject.Inject

class GetMyPageUseCase @Inject constructor(
    private val myPageRepository: MyPageRepository
) {

    suspend fun depositGivuPay(body: RequestBody): Flow<ApiResult<Pair<Int, Int>>> =
        myPageRepository.depositGivuPay(body)

    suspend fun withdrawGivuPay(body: RequestBody): Flow<ApiResult<Pair<Int, Int>>> =
        myPageRepository.withdrawGivuPay(body)

    suspend fun fetchAccount(): Flow<ApiResult<Account>> = myPageRepository.fetchAccount()

    suspend fun createAccount(): Flow<ApiResult<String>> = myPageRepository.createAccount()

    suspend fun fetchMyRegisterFundings(): Flow<ApiResult<List<Funding>>> =
        myPageRepository.fetchMyRegisterFundings()

    suspend fun fetchMyParticipateFundings(): Flow<ApiResult<List<Funding>>> =
        myPageRepository.fetchMyParticipateFundings()
}