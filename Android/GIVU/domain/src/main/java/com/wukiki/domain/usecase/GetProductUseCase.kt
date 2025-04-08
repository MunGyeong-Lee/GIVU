package com.wukiki.domain.usecase

import com.wukiki.domain.model.ApiResult
import com.wukiki.domain.model.Product
import com.wukiki.domain.model.ProductDetail
import com.wukiki.domain.repository.ProductRepository
import javax.inject.Inject

class GetProductUseCase @Inject constructor(
    private val productRepository: ProductRepository
) {

    suspend fun getProducts(): ApiResult<List<Product>> =
        productRepository.getProducts()

    suspend fun getProductDetail(productId: Int): ApiResult<ProductDetail> =
        productRepository.getProductDetail(productId)

    suspend fun likeProduct(productId: Int): ApiResult<Unit> =
        productRepository.postProductLike(productId)

    suspend fun cancelLikeProduct(productId: Int): ApiResult<Unit> =
        productRepository.postProductLikeCancel(productId)

    suspend fun updateProductImage(productId: Int): ApiResult<String> =
        productRepository.putProductImage(productId)
}