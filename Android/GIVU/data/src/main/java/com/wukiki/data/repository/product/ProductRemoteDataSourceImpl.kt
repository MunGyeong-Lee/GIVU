package com.wukiki.data.repository.product

import com.wukiki.data.api.ProductApi
import com.wukiki.data.entity.ProductDetailEntity
import com.wukiki.data.entity.ProductEntity
import com.wukiki.data.entity.ProductImageEntity
import com.wukiki.data.entity.ProductSearchEntity
import retrofit2.Response
import javax.inject.Inject

class ProductRemoteDataSourceImpl @Inject constructor(
    private val productApi: ProductApi
) : ProductRemoteDataSource {

    override suspend fun getProductDetail(productId: Int): Response<ProductEntity> =
        productApi.getProductDetail(productId)

    override suspend fun putProductImage(productId: Int): Response<ProductImageEntity> =
        productApi.putProductImage(productId)

    override suspend fun postProductLike(productId: Int): Response<Unit> =
        productApi.postProductLike(productId)

    override suspend fun postProductLikeCancel(productId: Int): Response<Unit> =
        productApi.postProductLikeCancel(productId)

    override suspend fun getProducts(): Response<List<ProductDetailEntity>> =
        productApi.getProducts()

    override suspend fun getProductsLike(): Response<ProductSearchEntity> =
        productApi.getProductsLike()
}