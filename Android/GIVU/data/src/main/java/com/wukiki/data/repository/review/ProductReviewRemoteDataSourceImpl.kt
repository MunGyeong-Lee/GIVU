package com.wukiki.data.repository.review

import com.wukiki.data.api.ProductReviewApi
import com.wukiki.data.entity.ProductReviewEntity
import retrofit2.Response
import javax.inject.Inject

class ProductReviewRemoteDataSourceImpl @Inject constructor(
    private val productReviewApi: ProductReviewApi
) : ProductReviewRemoteDataSource {

    override suspend fun getProductReviews(productId: Int): Response<List<ProductReviewEntity>> =
        productReviewApi.getProductReviews(productId)
}