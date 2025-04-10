package com.wukiki.data.repository.productreview

import android.util.Log
import com.wukiki.data.mapper.ProductReviewsMapper
import com.wukiki.domain.model.ApiResult
import com.wukiki.domain.model.ProductReview
import com.wukiki.domain.repository.ProductReviewRepository
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.withContext
import javax.inject.Inject

class ProductReviewRepositoryImpl @Inject constructor(
    private val productReviewRemoteDataSource: ProductReviewRemoteDataSource
) : ProductReviewRepository {

    override suspend fun getProductReviews(productId: Int): Flow<ApiResult<List<ProductReview>>> =
        flow {
            emit(ApiResult.loading(null))
            try {
                val response = withContext(CoroutineScope(Dispatchers.IO).coroutineContext) {
                    productReviewRemoteDataSource.getProductReviews(productId)
                }

                val responseBody = response.body()
                Log.d("ProductReviewRepositoryImpl", "Response: $responseBody")
                if (response.isSuccessful && (responseBody != null)) {
                    Log.d("ProductReviewRepositoryImpl", "getProductReviews Success")
                    emit(ApiResult.success(ProductReviewsMapper(responseBody)))
                } else {
                    Log.d("ProductReviewRepositoryImpl", "getProductReviews Fail: ${response.code()}")
                    emit(ApiResult.error(response.errorBody().toString(), null))
                }
            } catch (e: Exception) {
                Log.e("ProductReviewRepositoryImpl", "getProductReviews Error: $e")
                emit(ApiResult.fail())
            }
        }
}