package com.wukiki.data.api

import com.wukiki.data.entity.ProductReviewEntity
import okhttp3.RequestBody
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.PATCH
import retrofit2.http.POST
import retrofit2.http.Path

interface ProductReviewApi {

    @GET("products-review/{productId}/reviews")
    suspend fun getProductReviews(
        @Path("productId") productId: Int
    ): Response<List<ProductReviewEntity>>

    @POST("products-review/{productId}")
    suspend fun postProductReview(
        @Path("productId") productId: Int,
        @Body body: RequestBody
    ): Response<ProductReviewEntity>

    @PATCH("products-review/{reviewId}")
    suspend fun patchProductReview(
        @Path("reviewId") reviewId: Int,
        @Body body: RequestBody
    ): Response<ProductReviewEntity>

    @DELETE("products-review/{reviewId}")
    suspend fun deleteProductReview(
        @Path("reviewId") reviewId: Int
    ): Response<Void>
}