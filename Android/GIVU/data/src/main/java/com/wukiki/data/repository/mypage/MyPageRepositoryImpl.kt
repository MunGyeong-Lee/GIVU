package com.wukiki.data.repository.mypage

import android.util.Log
import com.wukiki.data.mapper.AccountMapper
import com.wukiki.domain.model.Account
import com.wukiki.domain.model.ApiResult
import com.wukiki.domain.repository.MyPageRepository
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.RequestBody
import javax.inject.Inject

class MyPageRepositoryImpl @Inject constructor(
    private val myPageRemoteDataSource: MyPageRemoteDataSource
) : MyPageRepository {

    override suspend fun depositGivuPay(body: RequestBody): ApiResult<Account> =
        try {
            val response = withContext(CoroutineScope(Dispatchers.IO).coroutineContext) {
                myPageRemoteDataSource.postAccountDeposit(body)
            }

            val responseBody = response.body()
            Log.d("MyPageRepositoryImpl", "Response: $responseBody")
            if (response.isSuccessful && (responseBody != null)) {
                Log.d("MyPageRepositoryImpl", "depositGivuPay Success")
                ApiResult.success(AccountMapper(responseBody))
            } else {
                Log.d("MyPageRepositoryImpl", "depositGivuPay Fail: ${response.code()}")
                ApiResult.error(response.errorBody().toString(), null)
            }
        } catch (e: Exception) {
            Log.e("MyPageRepositoryImpl", "depositGivuPay Error: $e")
            ApiResult.fail()
        }

    override suspend fun withdrawGivuPay(body: RequestBody): ApiResult<Account> =
        try {
            val response = withContext(CoroutineScope(Dispatchers.IO).coroutineContext) {
                myPageRemoteDataSource.postAccountWithdrawal(body)
            }

            val responseBody = response.body()
            Log.d("MyPageRepositoryImpl", "Response: $responseBody")
            if (response.isSuccessful && (responseBody != null)) {
                Log.d("MyPageRepositoryImpl", "withdrawGivuPay Success")
                ApiResult.success(AccountMapper(responseBody))
            } else {
                Log.d("MyPageRepositoryImpl", "withdrawGivuPay Fail: ${response.code()}")
                ApiResult.error(response.errorBody().toString(), null)
            }
        } catch (e: Exception) {
            Log.e("MyPageRepositoryImpl", "withdrawGivuPay Error: $e")
            ApiResult.fail()
        }

    override suspend fun fetchAccount(): ApiResult<Int> =
        try {
            val response = withContext(CoroutineScope(Dispatchers.IO).coroutineContext) {
                myPageRemoteDataSource.getAccount()
            }

            val responseBody = response.body()
            Log.d("MyPageRepositoryImpl", "Response: $responseBody")
            if (response.isSuccessful && (responseBody != null)) {
                Log.d("MyPageRepositoryImpl", "fetchAccount Success")
                ApiResult.success(responseBody.data?.balance ?: 0)
            } else {
                Log.d("MyPageRepositoryImpl", "fetchAccount Fail: ${response.code()}")
                ApiResult.error(response.errorBody().toString(), null)
            }
        } catch (e: Exception) {
            Log.e("MyPageRepositoryImpl", "fetchAccount Error: $e")
            ApiResult.fail()
        }

    override suspend fun createAccount(): ApiResult<String> =
        try {
            val response = withContext(CoroutineScope(Dispatchers.IO).coroutineContext) {
                myPageRemoteDataSource.postAccount()
            }

            val responseBody = response.body()
            Log.d("MyPageRepositoryImpl", "Response: $responseBody")
            if (response.isSuccessful && (responseBody != null)) {
                Log.d("MyPageRepositoryImpl", "createAccount Success")
                ApiResult.success(responseBody.message)
            } else {
                Log.d("MyPageRepositoryImpl", "createAccount Fail: ${response.code()}")
                ApiResult.error(response.errorBody().toString(), null)
            }
        } catch (e: Exception) {
            Log.e("MyPageRepositoryImpl", "createAccount Error: $e")
            ApiResult.fail()
        }
}