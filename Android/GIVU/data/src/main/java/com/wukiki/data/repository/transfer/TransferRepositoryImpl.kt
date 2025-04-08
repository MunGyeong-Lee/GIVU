package com.wukiki.data.repository.transfer

import android.util.Log
import com.wukiki.data.mapper.TransferMapper
import com.wukiki.domain.model.ApiResult
import com.wukiki.domain.model.Transfer
import com.wukiki.domain.repository.TransferRepository
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.withContext
import javax.inject.Inject

class TransferRepositoryImpl @Inject constructor(
    private val transferRemoteDataSource: TransferRemoteDataSource
) : TransferRepository {

    override suspend fun transferFunding(fundingId: Int, amount: Int): Flow<ApiResult<Transfer>> =
        flow {
            emit(ApiResult.loading(null))
            try {
                val response = withContext(CoroutineScope(Dispatchers.IO).coroutineContext) {
                    transferRemoteDataSource.postFundingTransfer(fundingId.toString(), amount)
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
}