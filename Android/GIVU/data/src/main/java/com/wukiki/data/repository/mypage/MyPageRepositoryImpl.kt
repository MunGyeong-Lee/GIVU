package com.wukiki.data.repository.mypage

import android.util.Log
import com.wukiki.data.mapper.AccountMapper
import com.wukiki.data.mapper.MyFundingMapper
import com.wukiki.domain.model.Account
import com.wukiki.domain.model.ApiResult
import com.wukiki.domain.model.Funding
import com.wukiki.domain.repository.MyPageRepository
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.withContext
import okhttp3.RequestBody
import javax.inject.Inject

class MyPageRepositoryImpl @Inject constructor(
    private val myPageRemoteDataSource: MyPageRemoteDataSource
) : MyPageRepository {

    override suspend fun depositGivuPay(body: RequestBody): Flow<ApiResult<Pair<Int, Int>>> =
        flow {
            emit(ApiResult.loading(null))
            try {
                val response = withContext(CoroutineScope(Dispatchers.IO).coroutineContext) {
                    myPageRemoteDataSource.postAccountDeposit(body)
                }

                val responseBody = response.body()
                Log.d("MyPageRepositoryImpl", "Response: $responseBody")
                if (response.isSuccessful && (responseBody != null)) {
                    Log.d("MyPageRepositoryImpl", "depositGivuPay Success")
                    emit(ApiResult.success(
                        Pair(
                            responseBody.data.givupayBalance,
                            responseBody.data.accountBalance
                        )
                    ))
                } else {
                    Log.d("MyPageRepositoryImpl", "depositGivuPay Fail: ${response.code()}")
                    emit(ApiResult.error(response.errorBody().toString(), null))
                }
            } catch (e: Exception) {
                Log.e("MyPageRepositoryImpl", "depositGivuPay Error: $e")
                emit(ApiResult.fail())
            }
        }

    override suspend fun withdrawGivuPay(body: RequestBody): Flow<ApiResult<Pair<Int, Int>>> =
        flow {
            emit(ApiResult.loading(null))
            try {
                val response = withContext(CoroutineScope(Dispatchers.IO).coroutineContext) {
                    myPageRemoteDataSource.postAccountWithdrawal(body)
                }

                val responseBody = response.body()
                Log.d("MyPageRepositoryImpl", "Response: $responseBody")
                if (response.isSuccessful && (responseBody != null)) {
                    Log.d("MyPageRepositoryImpl", "withdrawGivuPay Success")
                    emit(ApiResult.success(
                        Pair(
                            responseBody.data.givupayBalance,
                            responseBody.data.accountBalance
                        )
                    ))
                } else {
                    Log.d("MyPageRepositoryImpl", "withdrawGivuPay Fail: ${response.code()}")
                    emit(ApiResult.error(response.errorBody().toString(), null))
                }
            } catch (e: Exception) {
                Log.e("MyPageRepositoryImpl", "withdrawGivuPay Error: $e")
                emit(ApiResult.fail())
            }
        }

    override suspend fun fetchAccount(): Flow<ApiResult<Account>> =
        flow {
            emit(ApiResult.loading(null))
            try {
                val response = withContext(CoroutineScope(Dispatchers.IO).coroutineContext) {
                    myPageRemoteDataSource.getAccount()
                }

                val responseBody = response.body()
                Log.d("MyPageRepositoryImpl", "Response: $responseBody")
                if (response.isSuccessful && (responseBody != null)) {
                    Log.d("MyPageRepositoryImpl", "fetchAccount Success")
                    emit(ApiResult.success(AccountMapper(responseBody)))
                } else {
                    Log.d("MyPageRepositoryImpl", "fetchAccount Fail: ${response.code()}")
                    emit(ApiResult.error(response.errorBody().toString(), null))
                }
            } catch (e: Exception) {
                Log.e("MyPageRepositoryImpl", "fetchAccount Error: $e")
                emit(ApiResult.fail())
            }
        }

    override suspend fun createAccount(): Flow<ApiResult<String>> =
        flow {
            emit(ApiResult.loading(null))
            try {
                val response = withContext(CoroutineScope(Dispatchers.IO).coroutineContext) {
                    myPageRemoteDataSource.postAccount()
                }

                val responseBody = response.body()
                Log.d("MyPageRepositoryImpl", "Response: $responseBody")
                if (response.isSuccessful && (responseBody != null)) {
                    Log.d("MyPageRepositoryImpl", "createAccount Success")
                    emit(ApiResult.success(responseBody.message))
                } else {
                    Log.d("MyPageRepositoryImpl", "createAccount Fail: ${response.code()}")
                    emit(ApiResult.error(response.errorBody().toString(), null))
                }
            } catch (e: Exception) {
                Log.e("MyPageRepositoryImpl", "createAccount Error: $e")
                emit(ApiResult.fail())
            }
        }

    override suspend fun fetchMyRegisterFundings(): Flow<ApiResult<List<Funding>>> =
        flow {
            emit(ApiResult.loading(null))
            try {
                val response = withContext(CoroutineScope(Dispatchers.IO).coroutineContext) {
                    myPageRemoteDataSource.getMyFundings()
                }

                val responseBody = response.body()
                Log.d("MyPageRepositoryImpl", "Response: $responseBody")
                if (response.isSuccessful && (responseBody != null)) {
                    Log.d("MyPageRepositoryImpl", "fetchMyRegisterFundings Success")
                    emit(ApiResult.success(MyFundingMapper(responseBody)))
                } else {
                    Log.d("MyPageRepositoryImpl", "fetchMyRegisterFundings Fail: ${response.code()}")
                    emit(ApiResult.error(response.errorBody().toString(), null))
                }
            } catch (e: Exception) {
                Log.e("MyPageRepositoryImpl", "fetchMyRegisterFundings Error: $e")
                emit(ApiResult.fail())
            }
        }

    override suspend fun fetchMyParticipateFundings(): Flow<ApiResult<List<Funding>>> =
        flow {
            emit(ApiResult.loading(null))
            try {
                val response = withContext(CoroutineScope(Dispatchers.IO).coroutineContext) {
                    myPageRemoteDataSource.getMyParticipantFundings()
                }

                val responseBody = response.body()
                Log.d("MyPageRepositoryImpl", "Response: $responseBody")
                if (response.isSuccessful && (responseBody != null)) {
                    Log.d("MyPageRepositoryImpl", "fetchMyParticipateFundings Success")
                    emit(ApiResult.success(MyFundingMapper(responseBody)))
                } else {
                    Log.d("MyPageRepositoryImpl", "fetchMyParticipateFundings Fail: ${response.code()}")
                    emit(ApiResult.error(response.errorBody().toString(), null))
                }
            } catch (e: Exception) {
                Log.e("MyPageRepositoryImpl", "fetchMyParticipateFundings Error: $e")
                emit(ApiResult.fail())
            }
        }
}