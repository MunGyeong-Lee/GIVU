package com.wukiki.domain.usecase

import com.wukiki.domain.model.Account
import com.wukiki.domain.model.ApiResult
import com.wukiki.domain.model.Funding
import com.wukiki.domain.repository.MyPageRepository
import okhttp3.RequestBody
import javax.inject.Inject

class GetMyPageUseCase @Inject constructor(
    private val myPageRepository: MyPageRepository
) {

    suspend fun depositGivuPay(body: RequestBody): ApiResult<Pair<Int, Int>> =
        myPageRepository.depositGivuPay(body)

    suspend fun withdrawGivuPay(body: RequestBody): ApiResult<Pair<Int, Int>> =
        myPageRepository.withdrawGivuPay(body)

    suspend fun fetchAccount(): ApiResult<Account> = myPageRepository.fetchAccount()

    suspend fun createAccount(): ApiResult<String> = myPageRepository.createAccount()

    suspend fun fetchMyRegisterFundings(): ApiResult<List<Funding>> =
        myPageRepository.fetchMyRegisterFundings()

    suspend fun fetchMyParticipateFundings(): ApiResult<List<Funding>> =
        myPageRepository.fetchMyParticipateFundings()
}