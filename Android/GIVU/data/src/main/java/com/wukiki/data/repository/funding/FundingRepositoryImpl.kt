package com.wukiki.data.repository.funding

import android.util.Log
import com.wukiki.data.mapper.FundingDetailMapper
import com.wukiki.data.mapper.FundingMapper
import com.wukiki.data.mapper.FundingsMapper
import com.wukiki.domain.model.ApiResult
import com.wukiki.domain.model.Funding
import com.wukiki.domain.model.FundingDetail
import com.wukiki.domain.repository.FundingRepository
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
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
    ): ApiResult<Funding> =
        try {
            val response = withContext(CoroutineScope(Dispatchers.IO).coroutineContext) {
                fundingRemoteDataSource.postFunding(files, body)
            }

            val responseBody = response.body()
            Log.d("FundingRepositoryImpl", "Response: $responseBody")
            if (response.isSuccessful && (responseBody != null)) {
                Log.d("FundingRepositoryImpl", "registerFunding Success")
                ApiResult.success(FundingMapper(responseBody))
            } else {
                Log.d("FundingRepositoryImpl", "registerFunding Fail: ${response.code()}")
                ApiResult.error(response.errorBody().toString(), null)
            }
        } catch (e: Exception) {
            Log.e("FundingRepositoryImpl", "registerFunding Error: $e")
            ApiResult.fail()
        }

    override suspend fun fetchFundingDetail(fundingId: Int): ApiResult<FundingDetail> =
        try {
            val response = withContext(CoroutineScope(Dispatchers.IO).coroutineContext) {
                fundingRemoteDataSource.getFundingDetail(fundingId.toString())
            }

            val responseBody = response.body()
            Log.d("FundingRepositoryImpl", "Response: $responseBody")
            if (response.isSuccessful && (responseBody != null)) {
                Log.d("FundingRepositoryImpl", "fetchFundingDetail Success")
                ApiResult.success(FundingDetailMapper(responseBody))
            } else {
                Log.d("FundingRepositoryImpl", "fetchFundingDetail Fail: ${response.code()}")
                ApiResult.error(response.errorBody().toString(), null)
            }
        } catch (e: Exception) {
            Log.e("FundingRepositoryImpl", "fetchFundingDetail Error: $e")
            ApiResult.fail()
        }

    override suspend fun updateFundingDetail(
        fundingId: Int,
        files: List<MultipartBody.Part>,
        body: RequestBody
    ): ApiResult<Funding> =
        try {
            val response = withContext(CoroutineScope(Dispatchers.IO).coroutineContext) {
                fundingRemoteDataSource.postFundingDetail(fundingId.toString(), files, body)
            }

            val responseBody = response.body()
            Log.d("FundingRepositoryImpl", "Response: $responseBody")
            if (response.isSuccessful && (responseBody != null)) {
                Log.d("FundingRepositoryImpl", "updateFundingDetail Success")
                ApiResult.success(FundingMapper(responseBody))
            } else {
                Log.d("FundingRepositoryImpl", "updateFundingDetail Fail: ${response.code()}")
                ApiResult.error(response.errorBody().toString(), null)
            }
        } catch (e: Exception) {
            Log.e("FundingRepositoryImpl", "updateFundingDetail Error: $e")
            ApiResult.fail()
        }

    override suspend fun deleteFundingDetail(fundingId: Int): ApiResult<Unit> =
        try {
            val response = withContext(CoroutineScope(Dispatchers.IO).coroutineContext) {
                fundingRemoteDataSource.deleteFundingDetail(fundingId.toString())
            }

            val responseBody = response.body()
            Log.d("FundingRepositoryImpl", "Response: $responseBody")
            if (response.isSuccessful) {
                Log.d("FundingRepositoryImpl", "deleteFundingDetail Success")
                ApiResult.success(responseBody)
            } else {
                Log.d("FundingRepositoryImpl", "deleteFundingDetail Fail: ${response.code()}")
                ApiResult.error(response.errorBody().toString(), null)
            }
        } catch (e: Exception) {
            Log.e("FundingRepositoryImpl", "deleteFundingDetail Error: $e")
            ApiResult.fail()
        }

    override suspend fun updateFundingImage(
        fundingId: Int,
        file: MultipartBody.Part
    ): ApiResult<String> =
        try {
            val response = withContext(CoroutineScope(Dispatchers.IO).coroutineContext) {
                fundingRemoteDataSource.putFundingImage(fundingId.toString(), file)
            }

            val responseBody = response.body()
            Log.d("FundingRepositoryImpl", "Response: $responseBody")
            if (response.isSuccessful && (responseBody != null)) {
                Log.d("FundingRepositoryImpl", "updateFundingImage Success")
                ApiResult.success(responseBody.imageUrl)
            } else {
                Log.d("FundingRepositoryImpl", "updateFundingImage Fail: ${response.code()}")
                ApiResult.error(response.errorBody().toString(), null)
            }
        } catch (e: Exception) {
            Log.e("FundingRepositoryImpl", "updateFundingImage Error: $e")
            ApiResult.fail()
        }

    override suspend fun fetchFundings(): ApiResult<List<Funding>> =
        try {
            val response = withContext(CoroutineScope(Dispatchers.IO).coroutineContext) {
                fundingRemoteDataSource.getFundings()
            }

            val responseBody = response.body()
            Log.d("FundingRepositoryImpl", "Response: $responseBody")
            if (response.isSuccessful && (responseBody != null)) {
                Log.d("FundingRepositoryImpl", "fetchFundings Success")
                ApiResult.success(FundingsMapper(responseBody))
            } else {
                Log.d("FundingRepositoryImpl", "fetchFundings Fail: ${response.code()}")
                ApiResult.error(response.errorBody().toString(), null)
            }
        } catch (e: Exception) {
            Log.e("FundingRepositoryImpl", "fetchFundings Error: $e")
            ApiResult.fail()
        }
}