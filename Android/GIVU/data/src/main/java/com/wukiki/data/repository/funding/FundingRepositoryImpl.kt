package com.wukiki.data.repository.funding

import android.util.Log
import com.wukiki.data.mapper.FundingDetailMapper
import com.wukiki.data.mapper.FundingMapper
import com.wukiki.data.mapper.FundingsMapper
import com.wukiki.data.mapper.TransferMapper
import com.wukiki.domain.model.ApiResult
import com.wukiki.domain.model.Funding
import com.wukiki.domain.model.FundingDetail
import com.wukiki.domain.model.Transfer
import com.wukiki.domain.repository.FundingRepository
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.withContext
import okhttp3.MultipartBody
import okhttp3.RequestBody
import javax.inject.Inject

class FundingRepositoryImpl @Inject constructor(
    private val fundingRemoteDataSource: FundingRemoteDataSource
) : FundingRepository {

    override suspend fun registerFunding(
        files: List<MultipartBody.Part>,
        body: RequestBody
    ): Flow<ApiResult<Funding>> = flow {
        emit(ApiResult.loading(null))
        try {
            val response = withContext(CoroutineScope(Dispatchers.IO).coroutineContext) {
                fundingRemoteDataSource.postFunding(files, body)
            }

            val responseBody = response.body()
            Log.d("FundingRepositoryImpl", "Response: $responseBody")
            if (response.isSuccessful && (responseBody != null)) {
                Log.d("FundingRepositoryImpl", "registerFunding Success")
                emit(ApiResult.success(FundingMapper(responseBody)))
            } else {
                Log.d("FundingRepositoryImpl", "registerFunding Fail: ${response.code()}")
                emit(ApiResult.error(response.errorBody().toString(), null))
            }
        } catch (e: Exception) {
            Log.e("FundingRepositoryImpl", "registerFunding Error: $e")
            emit(ApiResult.fail())
        }
    }

    override suspend fun fetchFundingDetail(fundingId: Int): Flow<ApiResult<FundingDetail>> =
        flow {
            emit(ApiResult.loading(null))
            try {
                val response = withContext(CoroutineScope(Dispatchers.IO).coroutineContext) {
                    fundingRemoteDataSource.getFundingDetail(fundingId.toString())
                }

                val responseBody = response.body()
                Log.d("FundingRepositoryImpl", "Response: $responseBody")
                if (response.isSuccessful && (responseBody != null)) {
                    Log.d("FundingRepositoryImpl", "fetchFundingDetail Success")
                    emit(ApiResult.success(FundingDetailMapper(responseBody)))
                } else {
                    Log.d("FundingRepositoryImpl", "fetchFundingDetail Fail: ${response.code()}")
                    emit(ApiResult.error(response.errorBody().toString(), null))
                }
            } catch (e: Exception) {
                Log.e("FundingRepositoryImpl", "fetchFundingDetail Error: $e")
                emit(ApiResult.fail())
            }
        }

    override suspend fun updateFundingDetail(
        fundingId: Int,
        files: List<MultipartBody.Part>,
        body: RequestBody
    ): Flow<ApiResult<Funding>> = flow {
        emit(ApiResult.loading(null))
        try {
            val response = withContext(CoroutineScope(Dispatchers.IO).coroutineContext) {
                fundingRemoteDataSource.postFundingDetail(fundingId.toString(), files, body)
            }

            val responseBody = response.body()
            Log.d("FundingRepositoryImpl", "Response: $responseBody")
            if (response.isSuccessful && (responseBody != null)) {
                Log.d("FundingRepositoryImpl", "updateFundingDetail Success")
                emit(ApiResult.success(FundingMapper(responseBody)))
            } else {
                Log.d("FundingRepositoryImpl", "updateFundingDetail Fail: ${response.code()}")
                emit(ApiResult.error(response.errorBody().toString(), null))
            }
        } catch (e: Exception) {
            Log.e("FundingRepositoryImpl", "updateFundingDetail Error: $e")
            emit(ApiResult.fail())
        }
    }

    override suspend fun deleteFundingDetail(fundingId: Int): Flow<ApiResult<Unit>> =
        flow {
            emit(ApiResult.loading(null))
            try {
                val response = withContext(CoroutineScope(Dispatchers.IO).coroutineContext) {
                    fundingRemoteDataSource.deleteFundingDetail(fundingId.toString())
                }

                val responseBody = response.body()
                Log.d("FundingRepositoryImpl", "Response: $responseBody")
                if (response.isSuccessful) {
                    Log.d("FundingRepositoryImpl", "deleteFundingDetail Success")
                    emit(ApiResult.success(responseBody))
                } else {
                    Log.d("FundingRepositoryImpl", "deleteFundingDetail Fail: ${response.code()}")
                    emit(ApiResult.error(response.errorBody().toString(), null))
                }
            } catch (e: Exception) {
                Log.e("FundingRepositoryImpl", "deleteFundingDetail Error: $e")
                emit(ApiResult.fail())
            }
        }

    override suspend fun updateFundingComplete(fundingId: Int): Flow<ApiResult<Funding>> =
        flow {
            emit(ApiResult.loading(null))
            try {
                val response = withContext(CoroutineScope(Dispatchers.IO).coroutineContext) {
                    fundingRemoteDataSource.putFundingComplete(fundingId.toString())
                }

                val responseBody = response.body()
                Log.d("FundingRepositoryImpl", "Response: $responseBody")
                if (response.isSuccessful && (responseBody != null)) {
                    Log.d("FundingRepositoryImpl", "updateFundingComplete Success")
                    emit(ApiResult.success(FundingMapper(responseBody)))
                } else {
                    Log.d("FundingRepositoryImpl", "updateFundingComplete Fail: ${response.code()}")
                    emit(ApiResult.error(response.errorBody().toString(), null))
                }
            } catch (e: Exception) {
                Log.e("FundingRepositoryImpl", "updateFundingComplete Error: $e")
                emit(ApiResult.fail())
            }
        }

    override suspend fun updateFundingImage(
        fundingId: Int,
        file: MultipartBody.Part
    ): Flow<ApiResult<String>> = flow {
        emit(ApiResult.loading(null))
        try {
            val response = withContext(CoroutineScope(Dispatchers.IO).coroutineContext) {
                fundingRemoteDataSource.putFundingImage(fundingId.toString(), file)
            }

            val responseBody = response.body()
            Log.d("FundingRepositoryImpl", "Response: $responseBody")
            if (response.isSuccessful && (responseBody != null)) {
                Log.d("FundingRepositoryImpl", "updateFundingImage Success")
                emit(ApiResult.success(responseBody.imageUrl))
            } else {
                Log.d("FundingRepositoryImpl", "updateFundingImage Fail: ${response.code()}")
                emit(ApiResult.error(response.errorBody().toString(), null))
            }
        } catch (e: Exception) {
            Log.e("FundingRepositoryImpl", "updateFundingImage Error: $e")
            emit(ApiResult.fail())
        }
    }

    override suspend fun fetchFundings(): Flow<ApiResult<List<Funding>>> =
        flow {
            emit(ApiResult.loading(null))
            try {
                val response = withContext(CoroutineScope(Dispatchers.IO).coroutineContext) {
                    fundingRemoteDataSource.getFundings()
                }

                val responseBody = response.body()
                Log.d("FundingRepositoryImpl", "Response: $responseBody")
                if (response.isSuccessful && (responseBody != null)) {
                    Log.d("FundingRepositoryImpl", "fetchFundings Success: $responseBody")
                    emit(ApiResult.success(FundingsMapper(responseBody)))
                } else {
                    Log.d("FundingRepositoryImpl", "fetchFundings Fail: ${response.code()}")
                    emit(ApiResult.error(response.errorBody().toString(), null))
                }
            } catch (e: Exception) {
                Log.e("FundingRepositoryImpl", "fetchFundings Error: $e")
                emit(ApiResult.fail())
            }
        }

    override suspend fun getPaymentOfFunding(paymentId: Int): Flow<ApiResult<Transfer>> =
        flow {
            emit(ApiResult.loading(null))
            delay(1000L)
            try {
                val response = withContext(CoroutineScope(Dispatchers.IO).coroutineContext) {
                    fundingRemoteDataSource.getFundingTransfer(paymentId)
                }

                val responseBody = response.body()
                Log.d("FundingRepositoryImpl", "Response: $responseBody")
                if (response.isSuccessful && (responseBody != null)) {
                    Log.d("FundingRepositoryImpl", "transferFunding Success")
                    emit(ApiResult.success(TransferMapper(responseBody)))
                } else {
                    Log.d("FundingRepositoryImpl", "transferFunding Fail: ${response.code()}")
                    emit(ApiResult.error(response.errorBody().toString(), null))
                }
            } catch (e: Exception) {
                Log.e("FundingRepositoryImpl", "transferFunding Error: $e")
                emit(ApiResult.fail())
            }
        }

    override suspend fun searchFundings(title: String): Flow<ApiResult<List<Funding>>> =
        flow {
            emit(ApiResult.loading(null))
            try {
                val response = withContext(CoroutineScope(Dispatchers.IO).coroutineContext) {
                    fundingRemoteDataSource.getFundingSearch(title)
                }

                val responseBody = response.body()
                Log.d("FundingRepositoryImpl", "Response: $responseBody")
                if (response.isSuccessful && (responseBody != null)) {
                    Log.d("FundingRepositoryImpl", "searchFundings Success")
                    emit(ApiResult.success(FundingsMapper(responseBody.data)))
                } else {
                    Log.d("FundingRepositoryImpl", "searchFundings Fail: ${response.code()}")
                    emit(ApiResult.error(response.errorBody().toString(), null))
                }
            } catch (e: Exception) {
                Log.e("FundingRepositoryImpl", "searchFundings Error: $e")
                emit(ApiResult.fail())
            }
        }
}