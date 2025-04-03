package com.wukiki.domain.repository

import com.wukiki.domain.model.ApiResult
import com.wukiki.domain.model.ProductReview
import com.wukiki.domain.model.Review

interface ProductReviewRepository {

    suspend fun getProductReviews(productId: Int): ApiResult<List<ProductReview>>
}