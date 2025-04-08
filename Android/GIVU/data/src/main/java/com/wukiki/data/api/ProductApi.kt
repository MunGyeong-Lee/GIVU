package com.wukiki.data.api

import com.wukiki.data.entity.ProductDetailEntity
import com.wukiki.data.entity.ProductEntity
import com.wukiki.data.entity.ProductImageEntity
import com.wukiki.data.entity.ProductSearchEntity
import retrofit2.Response
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.PUT
import retrofit2.http.Path

interface ProductApi {

    @GET("products/{productId}")
    suspend fun getProductDetail(
        @Path("productId") productId: Int
    ): Response<ProductEntity>

    @PUT("products/{productId}/image")
    suspend fun putProductImage(
        @Path("productId") productId: Int
    ): Response<ProductImageEntity>

    @POST("products/{productId}/like")
    suspend fun postProductLike(
        @Path("productId") productId: Int
    ): Response<Unit>

    @GET("products/list")
    suspend fun getProducts(): Response<List<ProductDetailEntity>>

    @GET("products/search")
    suspend fun getProductSearch(
        @Path("keyword") keyword: String
    ): Response<ProductSearchEntity>
}