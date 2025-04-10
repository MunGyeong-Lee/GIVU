package com.wukiki.data.repository.product

import com.wukiki.data.entity.ProductDetailEntity
import com.wukiki.data.entity.ProductEntity
import com.wukiki.data.entity.ProductImageEntity
import com.wukiki.data.entity.ProductSearchEntity
import retrofit2.Response

interface ProductRemoteDataSource {

    suspend fun getProductDetail(productId: Int): Response<ProductEntity>

    suspend fun putProductImage(productId: Int): Response<ProductImageEntity>

    suspend fun postProductLike(productId: Int): Response<Unit>

    suspend fun postProductLikeCancel(productId: Int): Response<Unit>

    suspend fun getProducts(): Response<List<ProductDetailEntity>>

    suspend fun getProductSearch(keyword: String): Response<ProductSearchEntity>

    suspend fun getProductsLike(): Response<ProductSearchEntity>
}