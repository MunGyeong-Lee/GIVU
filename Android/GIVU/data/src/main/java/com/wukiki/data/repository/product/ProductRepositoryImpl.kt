package com.wukiki.data.repository.product

import android.util.Log
import com.wukiki.data.mapper.ProductMapper
import com.wukiki.data.mapper.ProductsMapper
import com.wukiki.domain.model.ApiResult
import com.wukiki.domain.model.Product
import com.wukiki.domain.model.ProductDetail
import com.wukiki.domain.repository.ProductRepository
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.withContext
import javax.inject.Inject

class ProductRepositoryImpl @Inject constructor(
    private val productRemoteDataSource: ProductRemoteDataSource
) : ProductRepository {

    override suspend fun getProductDetail(productId: Int): Flow<ApiResult<ProductDetail>> =
        flow {
            emit(ApiResult.loading(null))
            try {
                val response = withContext(CoroutineScope(Dispatchers.IO).coroutineContext) {
                    productRemoteDataSource.getProductDetail(productId)
                }

                val responseBody = response.body()
                Log.d("ProductRepositoryImpl", "Response: $responseBody")
                if (response.isSuccessful && (responseBody != null)) {
                    Log.d("ProductRepositoryImpl", "getProductDetail Success")
                    emit(ApiResult.success(ProductMapper(responseBody)))
                } else {
                    Log.d("ProductRepositoryImpl", "getProductDetail Fail: ${response.code()}")
                    emit(ApiResult.error(response.errorBody().toString(), null))
                }
            } catch (e: Exception) {
                Log.e("ProductRepositoryImpl", "getProductDetail Error: $e")
                emit(ApiResult.fail())
            }
        }

    override suspend fun putProductImage(productId: Int): Flow<ApiResult<String>> =
        flow {
            emit(ApiResult.loading(null))
            try {
                val response = withContext(CoroutineScope(Dispatchers.IO).coroutineContext) {
                    productRemoteDataSource.putProductImage(productId)
                }

                val responseBody = response.body()
                Log.d("ProductRepositoryImpl", "Response: $responseBody")
                if (response.isSuccessful && (responseBody != null)) {
                    Log.d("ProductRepositoryImpl", "putProductImage Success")
                    emit(ApiResult.success(responseBody.imageUrl))
                } else {
                    Log.d("ProductRepositoryImpl", "putProductImage Fail: ${response.code()}")
                    emit(ApiResult.error(response.errorBody().toString(), null))
                }
            } catch (e: Exception) {
                Log.e("ProductRepositoryImpl", "putProductImage Error: $e")
                emit(ApiResult.fail())
            }
        }

    override suspend fun postProductLike(productId: Int): Flow<ApiResult<Unit>> =
        flow {
            emit(ApiResult.loading(null))
            try {
                val response = withContext(CoroutineScope(Dispatchers.IO).coroutineContext) {
                    productRemoteDataSource.postProductLike(productId)
                }

                val responseBody = response.body()
                Log.d("ProductRepositoryImpl", "Response: $responseBody")
                if (response.isSuccessful) {
                    Log.d("ProductRepositoryImpl", "postProductLike Success")
                    emit(ApiResult.success(responseBody))
                } else {
                    Log.d("ProductRepositoryImpl", "postProductLike Fail: ${response.code()}")
                    emit(ApiResult.error(response.errorBody().toString(), null))
                }
            } catch (e: Exception) {
                Log.e("ProductRepositoryImpl", "postProductLike Error: $e")
                emit(ApiResult.fail())
            }
        }

    override suspend fun postProductLikeCancel(productId: Int): Flow<ApiResult<Unit>> =
        flow {
            emit(ApiResult.loading(null))
            try {
                val response = withContext(CoroutineScope(Dispatchers.IO).coroutineContext) {
                    productRemoteDataSource.postProductLikeCancel(productId)
                }

                val responseBody = response.body()
                Log.d("ProductRepositoryImpl", "Response: $responseBody")
                if (response.isSuccessful) {
                    Log.d("ProductRepositoryImpl", "postProductLikeCancel Success")
                    emit(ApiResult.success(responseBody))
                } else {
                    Log.d("ProductRepositoryImpl", "postProductLikeCancel Fail: ${response.code()}")
                    emit(ApiResult.error(response.errorBody().toString(), null))
                }
            } catch (e: Exception) {
                Log.e("ProductRepositoryImpl", "postProductLikeCancel Error: $e")
                emit(ApiResult.fail())
            }
        }

    override suspend fun getProducts(): Flow<ApiResult<List<Product>>> =
        flow {
            emit(ApiResult.loading(null))
            try {
                val response = withContext(CoroutineScope(Dispatchers.IO).coroutineContext) {
                    productRemoteDataSource.getProducts()
                }

                val responseBody = response.body()
                Log.d("ProductRepositoryImpl", "Response: $responseBody")
                if (response.isSuccessful && (responseBody != null)) {
                    Log.d("ProductRepositoryImpl", "getProducts Success")
                    emit(ApiResult.success(ProductsMapper(responseBody)))
                } else {
                    Log.d("ProductRepositoryImpl", "getProducts Fail: ${response.code()}")
                    emit(ApiResult.error(response.errorBody().toString(), null))
                }
            } catch (e: Exception) {
                Log.e("ProductRepositoryImpl", "getProducts Error: $e")
                emit(ApiResult.fail())
            }
        }

    override suspend fun fetchProductsLike(): Flow<ApiResult<List<Product>>> =
        flow {
            emit(ApiResult.loading(null))
            try {
                val response = withContext(CoroutineScope(Dispatchers.IO).coroutineContext) {
                    productRemoteDataSource.getProductsLike()
                }

                val responseBody = response.body()
                Log.d("ProductRepositoryImpl", "Response: $responseBody")
                if (response.isSuccessful && (responseBody != null)) {
                    Log.d("ProductRepositoryImpl", "fetchProductsLike Success")
                    emit(ApiResult.success(ProductsMapper(responseBody.data)))
                } else {
                    Log.d("ProductRepositoryImpl", "fetchProductsLike Fail: ${response.code()}")
                    emit(ApiResult.error(response.errorBody().toString(), null))
                }
            } catch (e: Exception) {
                Log.e("ProductRepositoryImpl", "fetchProductsLike Error: $e")
                emit(ApiResult.fail())
            }
        }
}