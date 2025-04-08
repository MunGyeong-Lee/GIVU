package com.wukiki.givu.views

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import com.wukiki.domain.model.Product
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import javax.inject.Inject

@HiltViewModel
class MainViewModel @Inject constructor(
    application: Application
) : AndroidViewModel(application) {

    private val _bnvState = MutableStateFlow<Boolean>(true)
    val bnvState = _bnvState.asStateFlow()

    private val _selectedProduct = MutableStateFlow<Product?>(null)
    val selectedProduct = _selectedProduct.asStateFlow()

    private val _loadingState = MutableStateFlow<Int>(0)
    val loadingState = _loadingState.asStateFlow()

    fun setBnvState(isVisible: Boolean) {
        _bnvState.value = isVisible
    }

    fun selectProduct(product: Product) {
        _selectedProduct.value = product
    }

    fun initLoadingTask() {
        _loadingState.update { 0 }
    }

    fun addLoadingTask() {
        _loadingState.update { it + 1 }
    }

    fun removeLoadingTask() {
        _loadingState.update { it - 1 }
    }
}