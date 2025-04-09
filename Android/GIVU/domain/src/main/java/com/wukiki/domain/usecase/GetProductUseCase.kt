package com.wukiki.domain.usecase

import com.wukiki.domain.model.ApiResult
import com.wukiki.domain.model.Product
import com.wukiki.domain.model.ProductDetail
import com.wukiki.domain.repository.ProductRepository
import kotlinx.coroutines.flow.Flow
import javax.inject.Inject

class GetProductUseCase @Inject constructor(
    private val productRepository: ProductRepository
) {

    suspend fun getProducts(): Flow<ApiResult<List<Product>>> =
        productRepository.getProducts()

    suspend fun getProductDetail(productId: Int): Flow<ApiResult<ProductDetail>> =
        productRepository.getProductDetail(productId)

    suspend fun likeProduct(productId: Int): Flow<ApiResult<Unit>> =
        productRepository.postProductLike(productId)

    suspend fun cancelLikeProduct(productId: Int): Flow<ApiResult<Unit>> =
        productRepository.postProductLikeCancel(productId)

    suspend fun updateProductImage(productId: Int): Flow<ApiResult<String>> =
        productRepository.putProductImage(productId)

    suspend fun searchProducts(keyword: String): Flow<ApiResult<List<Product>>> =
        productRepository.searchProducts(keyword)

    suspend fun fetchProductsLike(): Flow<ApiResult<List<Product>>> =
        productRepository.fetchProductsLike()
}