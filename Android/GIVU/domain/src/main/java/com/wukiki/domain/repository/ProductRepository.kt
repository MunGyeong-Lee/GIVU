package com.wukiki.domain.repository

import com.wukiki.domain.model.ApiResult
import com.wukiki.domain.model.Product
import com.wukiki.domain.model.ProductDetail
import kotlinx.coroutines.flow.Flow

interface ProductRepository {

    suspend fun getProductDetail(productId: Int): Flow<ApiResult<ProductDetail>>

    suspend fun putProductImage(productId: Int): Flow<ApiResult<String>>

    suspend fun postProductLike(productId: Int): Flow<ApiResult<Unit>>

    suspend fun postProductLikeCancel(productId: Int): Flow<ApiResult<Unit>>

    suspend fun getProducts(): Flow<ApiResult<List<Product>>>

    suspend fun fetchProductsLike(): Flow<ApiResult<List<Product>>>
}