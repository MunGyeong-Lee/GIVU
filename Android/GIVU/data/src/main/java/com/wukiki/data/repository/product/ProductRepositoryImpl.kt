package com.wukiki.data.repository.product

import android.util.Log
import com.wukiki.data.mapper.ProductMapper
import com.wukiki.data.mapper.ProductsMapper
import com.wukiki.domain.model.ApiResult
import com.wukiki.domain.model.Product
import com.wukiki.domain.repository.ProductRepository
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import javax.inject.Inject

class ProductRepositoryImpl @Inject constructor(
    private val productRemoteDataSource: ProductRemoteDataSource
) : ProductRepository {

    override suspend fun getProductDetail(productId: Int): ApiResult<Product> =
        try {
            val response = withContext(CoroutineScope(Dispatchers.IO).coroutineContext) {
                productRemoteDataSource.getProductDetail(productId)
            }

            val responseBody = response.body()
            Log.d("ProductRepositoryImpl", "Response: $responseBody")
            if (response.isSuccessful && (responseBody != null)) {
                Log.d("ProductRepositoryImpl", "getProductDetail Success")
                ApiResult.success(ProductMapper(responseBody))
            } else {
                Log.d("ProductRepositoryImpl", "getProductDetail Fail: ${response.code()}")
                ApiResult.error(response.errorBody().toString(), null)
            }
        } catch (e: Exception) {
            Log.e("ProductRepositoryImpl", "getProductDetail Error: $e")
            ApiResult.fail()
        }

    override suspend fun putProductImage(productId: Int): ApiResult<String> =
        try {
            val response = withContext(CoroutineScope(Dispatchers.IO).coroutineContext) {
                productRemoteDataSource.putProductImage(productId)
            }

            val responseBody = response.body()
            Log.d("ProductRepositoryImpl", "Response: $responseBody")
            if (response.isSuccessful && (responseBody != null)) {
                Log.d("ProductRepositoryImpl", "putProductImage Success")
                ApiResult.success(responseBody.imageUrl)
            } else {
                Log.d("ProductRepositoryImpl", "putProductImage Fail: ${response.code()}")
                ApiResult.error(response.errorBody().toString(), null)
            }
        } catch (e: Exception) {
            Log.e("ProductRepositoryImpl", "putProductImage Error: $e")
            ApiResult.fail()
        }

    override suspend fun getProducts(): ApiResult<List<Product>> =
        try {
            val response = withContext(CoroutineScope(Dispatchers.IO).coroutineContext) {
                productRemoteDataSource.getProducts()
            }

            val responseBody = response.body()
            Log.d("ProductRepositoryImpl", "Response: $responseBody")
            if (response.isSuccessful && (responseBody != null)) {
                Log.d("ProductRepositoryImpl", "getProducts Success")
                ApiResult.success(ProductsMapper(responseBody))
            } else {
                Log.d("ProductRepositoryImpl", "getProducts Fail: ${response.code()}")
                ApiResult.error(response.errorBody().toString(), null)
            }
        } catch (e: Exception) {
            Log.e("ProductRepositoryImpl", "getProducts Error: $e")
            ApiResult.fail()
        }
}