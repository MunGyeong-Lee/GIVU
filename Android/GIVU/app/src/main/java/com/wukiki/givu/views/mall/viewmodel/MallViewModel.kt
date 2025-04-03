package com.wukiki.givu.views.mall.viewmodel

import android.app.Application
import android.util.Log
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.wukiki.domain.model.ApiStatus
import com.wukiki.domain.model.Product
import com.wukiki.domain.model.ProductReview
import com.wukiki.domain.model.Review
import com.wukiki.domain.usecase.GetProductReviewUseCase
import com.wukiki.domain.usecase.GetProductUseCase
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asSharedFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import timber.log.Timber
import javax.inject.Inject

@HiltViewModel
class MallViewModel @Inject constructor(
    application: Application,
    private val getProductUseCase: GetProductUseCase,
    private val getProductReviewUseCase: GetProductReviewUseCase
) : AndroidViewModel(application) {

    /*** Ui Event ***/
    private val _mallUiEvent = MutableSharedFlow<MallUiEvent>()
    val mallUiEvent = _mallUiEvent.asSharedFlow()

    /*** Datas ***/
    private val _products = MutableStateFlow<List<Product>>(emptyList())
    val products = _products.asStateFlow()

    private val _filteredProducts = MutableStateFlow<List<Product>>(emptyList())
    val filteredProducts = _filteredProducts.asStateFlow()

    private val _selectedProduct = MutableStateFlow<Product?>(null)
    val selectedProduct = _selectedProduct.asStateFlow()

//    private val _productReviewList = MutableStateFlow<List<ProductReview>>(emptyList())
//    val productReviewList = _productReviewList.asStateFlow()

    init {
        initProducts()
    }

    private fun initProducts() {
        viewModelScope.launch {
            val response = getProductUseCase.getProducts()

            when (response.status) {
                ApiStatus.SUCCESS -> {
                    val newProducts = response.data ?: emptyList()
                    _products.value = newProducts
                    _filteredProducts.value = _products.value
                    Timber.d("Products: ${_filteredProducts.value}")
                }

                else -> {
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
            Log.d("Mall ViewModel", "아이디: ${productId.toInt()}")
            val response = getProductUseCase.getProductDetail(productId.toInt())

            when (response.status) {
                ApiStatus.SUCCESS -> {
                    val productInfo = response.data
                    _selectedProduct.value = productInfo

                    Timber.d("Product Info: ${_selectedProduct.value}")
                }

                else -> {
                    _mallUiEvent.emit(MallUiEvent.GoToProductDetail)
                }
            }
        }
    }
}