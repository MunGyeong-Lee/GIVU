package com.wukiki.givu.views.mall.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.wukiki.domain.model.ApiResult
import com.wukiki.domain.model.ApiStatus
import com.wukiki.domain.model.Product
import com.wukiki.domain.model.ProductDetail
import com.wukiki.domain.usecase.GetProductUseCase
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asSharedFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class MallViewModel @Inject constructor(
    application: Application,
    private val getProductUseCase: GetProductUseCase
) : AndroidViewModel(application) {

    /*** Ui Event ***/
    private val _mallUiEvent = MutableSharedFlow<MallUiEvent>()
    val mallUiEvent = _mallUiEvent.asSharedFlow()

    private val _productsState =
        MutableStateFlow<ApiResult<List<Product>>>(ApiResult.init())
    val productsState = _productsState.asStateFlow()

    private val _productDetailState =
        MutableStateFlow<ApiResult<ProductDetail?>>(ApiResult.init())
    val productDetailState = _productDetailState.asStateFlow()

    /*** Datas ***/
    private val _products = MutableStateFlow<List<Product>>(emptyList())
    val products = _products.asStateFlow()

    private val _filteredProducts = MutableStateFlow<List<Product>>(emptyList())
    val filteredProducts = _filteredProducts.asStateFlow()

    private val _selectedProduct = MutableStateFlow<ProductDetail?>(null)
    val selectedProduct = _selectedProduct.asStateFlow()

//    private val _productReviewList = MutableStateFlow<List<ProductReview>>(emptyList())
//    val productReviewList = _productReviewList.asStateFlow()

    init {
        initProducts()
    }

    private fun initProducts() {
        viewModelScope.launch {
            val response = getProductUseCase.getProducts()

            response.collectLatest { result ->
                _productsState.value = result
                if (result.status == ApiStatus.SUCCESS) {
                    val newProducts = result.data ?: emptyList()
                    _products.value = newProducts
                    _filteredProducts.value = _products.value
                } else if ((result.status == ApiStatus.FAIL) || (result.status == ApiStatus.ERROR)) {
                    _mallUiEvent.emit(MallUiEvent.GetProductsFail)
                }
            }
        }
    }

    fun filterProducts(category: String) {
        when (category == "ALL") {
            true -> {
                _filteredProducts.value = _products.value
            }

            else -> {
                _filteredProducts.value = _products.value.filter { it.category == category }
            }
        }
    }

    fun getDetailProductInfo(productId: String) {
        viewModelScope.launch {
            val response = getProductUseCase.getProductDetail(productId.toInt())

            response.collectLatest { result ->
                _productDetailState.value = result
                if (result.status == ApiStatus.SUCCESS) {
                    val productInfo = result.data
                    _selectedProduct.value = productInfo
                } else if ((result.status == ApiStatus.FAIL) || (result.status == ApiStatus.ERROR)) {
                    _mallUiEvent.emit(MallUiEvent.GoToProductDetail)
                }
            }
        }
    }

    fun likeProduct() {
        viewModelScope.launch {
            val response = getProductUseCase.likeProduct(
                productId = (_selectedProduct.value?.product?.productId ?: "-1").toInt()
            )

            response.collectLatest { result ->
                if (result.status == ApiStatus.SUCCESS) {
                    getDetailProductInfo(_selectedProduct.value?.product?.productId ?: "-1")
                    _mallUiEvent.emit(MallUiEvent.LikeProductSuccess)
                } else if ((result.status == ApiStatus.FAIL) || (result.status == ApiStatus.ERROR)) {
                    _mallUiEvent.emit(MallUiEvent.LikeProductFail)
                }
            }
        }
    }

    fun cancelLikeProduct() {
        viewModelScope.launch {
            val response = getProductUseCase.cancelLikeProduct(
                productId = (_selectedProduct.value?.product?.productId ?: "-1").toInt()
            )

            response.collectLatest { result ->
                if (result.status == ApiStatus.SUCCESS) {
                    getDetailProductInfo(_selectedProduct.value?.product?.productId ?: "-1")
                    _mallUiEvent.emit(MallUiEvent.CancelLikeProductSuccess)
                } else if ((result.status == ApiStatus.FAIL) || (result.status == ApiStatus.ERROR)) {
                    _mallUiEvent.emit(MallUiEvent.CancelLikeProductFail)
                }
            }
        }
    }
}