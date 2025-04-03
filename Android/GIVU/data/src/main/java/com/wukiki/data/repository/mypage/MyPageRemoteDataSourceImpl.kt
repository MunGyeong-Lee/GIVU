package com.wukiki.data.repository.mypage

import com.wukiki.data.api.MyPageApi
import com.wukiki.data.entity.AccountEntity
import com.wukiki.data.entity.BalanceEntity
import com.wukiki.data.entity.MyFundingEntity
import okhttp3.RequestBody
import retrofit2.Response
import javax.inject.Inject

class MyPageRemoteDataSourceImpl @Inject constructor(
    private val myPageApi: MyPageApi
) : MyPageRemoteDataSource {

    override suspend fun postAccountDeposit(body: RequestBody): Response<BalanceEntity> =
        myPageApi.postAccountDeposit(body)

    override suspend fun postAccountWithdrawal(body: RequestBody): Response<BalanceEntity> =
        myPageApi.postAccountWithdrawal(body)

    override suspend fun getAccount(): Response<AccountEntity> = myPageApi.getAccount()

    override suspend fun postAccount(): Response<AccountEntity> = myPageApi.postAccount()

    override suspend fun getMyFundings(): Response<MyFundingEntity> = myPageApi.getMyFundings()

    override suspend fun getMyParticipantFundings(): Response<MyFundingEntity> =
        myPageApi.getMyParticipantFundings()
}