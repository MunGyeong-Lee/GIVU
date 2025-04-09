package com.wukiki.data.api

import com.wukiki.data.entity.ProductDetailEntity
import com.wukiki.data.entity.ProductEntity
import com.wukiki.data.entity.ProductImageEntity
import com.wukiki.data.entity.ProductSearchEntity
import retrofit2.Response
import retrofit2.http.GET
import retrofit2.http.PATCH
import retrofit2.http.PUT
import retrofit2.http.Path
import retrofit2.http.Query

interface ProductApi {

    @GET("products/{productId}")
    suspend fun getProductDetail(
        @Path("productId") productId: Int
    ): Response<ProductEntity>

    @PUT("products/{productId}/image")
    suspend fun putProductImage(
        @Path("productId") productId: Int
    ): Response<ProductImageEntity>

    @PATCH("products/{productId}/like")
    suspend fun postProductLike(
        @Path("productId") productId: Int
    ): Response<Unit>

    @PATCH("products/{productId}/like/cancel")
    suspend fun postProductLikeCancel(
        @Path("productId") productId: Int
    ): Response<Unit>

    @GET("products/list")
    suspend fun getProducts(): Response<List<ProductDetailEntity>>

    @GET("products/search")
    suspend fun getProductSearch(
        @Query("keyword") keyword: String
    ): Response<ProductSearchEntity>

    @GET("products/search/likeProduct")
    suspend fun getProductsLike(): Response<ProductSearchEntity>
}