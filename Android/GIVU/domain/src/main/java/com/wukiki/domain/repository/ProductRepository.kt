package com.wukiki.domain.repository

import com.wukiki.domain.model.ApiResult
import com.wukiki.domain.model.Product

interface ProductRepository {

    suspend fun getProductDetail(productId: Int): ApiResult<Product>

    suspend fun putProductImage(productId: Int): ApiResult<String>

    suspend fun getProducts(): ApiResult<List<Product>>
}