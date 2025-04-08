package com.wukiki.domain.repository

import com.wukiki.domain.model.ApiResult
import com.wukiki.domain.model.ProductReview
import com.wukiki.domain.model.Review
import kotlinx.coroutines.flow.Flow

interface ProductReviewRepository {

    suspend fun getProductReviews(productId: Int): Flow<ApiResult<List<ProductReview>>>
}