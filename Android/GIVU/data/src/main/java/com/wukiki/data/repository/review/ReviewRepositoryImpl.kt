package com.wukiki.data.repository.review

import android.util.Log
import com.wukiki.data.mapper.ReviewMapper
import com.wukiki.data.mapper.ReviewsMapper
import com.wukiki.domain.model.ApiResult
import com.wukiki.domain.model.Review
import com.wukiki.domain.repository.ReviewRepository
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.withContext
import okhttp3.MultipartBody
import okhttp3.RequestBody
import javax.inject.Inject

class ReviewRepositoryImpl @Inject constructor(
    private val reviewRemoteDataSource: ReviewRemoteDataSource
) : ReviewRepository {

    override suspend fun fetchFundingReviews(): Flow<ApiResult<List<Review>>> = flow {
        emit(ApiResult.loading(null))
        try {
            val response = withContext(CoroutineScope(Dispatchers.IO).coroutineContext) {
                reviewRemoteDataSource.getFundingReviews()
            }

            val responseBody = response.body()
            Log.d("ReviewRepositoryImpl", "Response: $responseBody")
            if (response.isSuccessful && (responseBody != null)) {
                Log.d("ReviewRepositoryImpl", "fetchFundingReviews Success")
                emit(ApiResult.success(ReviewsMapper(responseBody)))
            } else {
                Log.d("ReviewRepositoryImpl", "fetchFundingReviews Fail: ${response.code()}")
                emit(ApiResult.error(response.errorBody().toString(), null))
            }
        } catch (e: Exception) {
            Log.e("ReviewRepositoryImpl", "fetchFundingReviews Error: $e")
            emit(ApiResult.fail())
        }
    }

    override suspend fun registerFundingReview(
        fundingId: Int,
        file: MultipartBody.Part?,
        body: RequestBody
    ): Flow<ApiResult<Review>> = flow {
        emit(ApiResult.loading(null))
        try {
            val response = withContext(CoroutineScope(Dispatchers.IO).coroutineContext) {
                reviewRemoteDataSource.postFundingReview(fundingId.toString(), file, body)
            }

            val responseBody = response.body()
            Log.d("ReviewRepositoryImpl", "Response: $responseBody")
            if (response.isSuccessful && (responseBody != null)) {
                Log.d("ReviewRepositoryImpl", "registerFundingReview Success")
                emit(ApiResult.success(ReviewMapper(responseBody)))
            } else {
                Log.d("ReviewRepositoryImpl", "registerFundingReview Fail: ${response.code()}")
                emit(ApiResult.error(response.errorBody().toString(), null))
            }
        } catch (e: Exception) {
            Log.e("ReviewRepositoryImpl", "registerFundingReview Error: $e")
            emit(ApiResult.fail())
        }
    }
}