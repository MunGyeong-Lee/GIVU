package com.wukiki.data.repository.productreview

import com.wukiki.data.entity.ProductReviewEntity
import retrofit2.Response

interface ProductReviewRemoteDataSource {

    suspend fun getProductReviews(productId: Int): Response<List<ProductReviewEntity>>
}