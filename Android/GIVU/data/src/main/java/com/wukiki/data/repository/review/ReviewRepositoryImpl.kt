package com.wukiki.data.repository.review

import android.util.Log
import com.wukiki.data.entity.ReviewMapper
import com.wukiki.data.mapper.ProductReviewsMapper
import com.wukiki.domain.model.ApiResult
import com.wukiki.domain.model.Review
import com.wukiki.domain.repository.ReviewRepository
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import javax.inject.Inject

class ReviewRepositoryImpl @Inject constructor(
    private val reviewRemoteDataSource: ReviewRemoteDataSource
) : ReviewRepository {

    override suspend fun registerFundingReview(fundingId: Int): ApiResult<Review> =
        try {
            val response = withContext(CoroutineScope(Dispatchers.IO).coroutineContext) {
                reviewRemoteDataSource.postFundingReview(fundingId.toString())
            }

            val responseBody = response.body()
            Log.d("ReviewRepositoryImpl", "Response: $responseBody")
            if (response.isSuccessful && (responseBody != null)) {
                Log.d("ReviewRepositoryImpl", "registerFundingReview Success")
                ApiResult.success(ReviewMapper(responseBody))
            } else {
                Log.d("ReviewRepositoryImpl", "registerFundingReview Fail: ${response.code()}")
                ApiResult.error(response.errorBody().toString(), null)
            }
        } catch (e: Exception) {
            Log.e("ReviewRepositoryImpl", "registerFundingReview Error: $e")
            ApiResult.fail()
        }
}