package com.wukiki.data.api

import com.wukiki.data.entity.AccountEntity
import com.wukiki.data.entity.BalanceEntity
import okhttp3.RequestBody
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST

interface MyPageApi {

    @POST("mypage/account/deposit")
    suspend fun postAccountDeposit(
        @Body body: RequestBody
    ): Response<BalanceEntity>

    @POST("mypage/account/withdrawal")
    suspend fun postAccountWithdrawal(
        @Body body: RequestBody
    ): Response<BalanceEntity>

    @GET("mypage/checkAccount")
    suspend fun getAccount(): Response<AccountEntity>

    @POST("mypage/createAccount")
    suspend fun postAccount(): Response<AccountEntity>
}