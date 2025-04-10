package com.wukiki.data.repository.mypage

import com.wukiki.data.entity.AccountEntity
import com.wukiki.data.entity.BalanceEntity
import com.wukiki.data.entity.MyFundingEntity
import okhttp3.RequestBody
import retrofit2.Response

interface MyPageRemoteDataSource {

    suspend fun postAccountDeposit(body: RequestBody): Response<BalanceEntity>

    suspend fun postAccountWithdrawal(body: RequestBody): Response<BalanceEntity>

    suspend fun getAccount(): Response<AccountEntity>

    suspend fun postAccount(): Response<AccountEntity>

    suspend fun getMyFundings(): Response<MyFundingEntity>

    suspend fun getMyParticipantFundings(): Response<MyFundingEntity>
}