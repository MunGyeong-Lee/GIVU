package com.wukiki.domain.repository

import com.wukiki.domain.model.ApiResult
import com.wukiki.domain.model.Product
import com.wukiki.domain.model.ProductDetail

interface ProductRepository {

    suspend fun getProductDetail(productId: Int): ApiResult<ProductDetail>

    suspend fun putProductImage(productId: Int): ApiResult<String>

    suspend fun postProductLike(productId: Int): ApiResult<Unit>

    suspend fun postProductLikeCancel(productId: Int): ApiResult<Unit>

    suspend fun getProducts(): ApiResult<List<Product>>
}