package com.wukiki.domain.usecase

import com.wukiki.domain.model.ApiResult
import com.wukiki.domain.model.ProductReview
import com.wukiki.domain.repository.ProductReviewRepository
import kotlinx.coroutines.flow.Flow
import javax.inject.Inject

class GetProductReviewUseCase @Inject constructor(
    private val productReviewRepository: ProductReviewRepository
) {

    suspend fun getProductReviews(productId: Int): Flow<ApiResult<List<ProductReview>>> =
        productReviewRepository.getProductReviews(productId)
}