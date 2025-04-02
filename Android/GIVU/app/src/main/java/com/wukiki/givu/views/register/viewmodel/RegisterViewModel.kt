package com.wukiki.givu.views.register.viewmodel

import android.app.Application
import android.net.Uri
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.google.gson.GsonBuilder
import com.wukiki.domain.model.ApiStatus
import com.wukiki.domain.model.Product
import com.wukiki.domain.usecase.GetFundingUseCase
import com.wukiki.domain.usecase.GetProductUseCase
import com.wukiki.givu.util.InputValidState
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asSharedFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.MultipartBody
import okhttp3.RequestBody
import okhttp3.RequestBody.Companion.toRequestBody
import timber.log.Timber
import javax.inject.Inject

@HiltViewModel
class RegisterViewModel @Inject constructor(
    private val application: Application,
    private val getProductUseCase: GetProductUseCase,
    private val getFundingUseCase: GetFundingUseCase
) : AndroidViewModel(application) {

    /*** Ui State, Event ***/
    private val _registerUiState = MutableStateFlow<RegisterUiState>(RegisterUiState())
    val registerUiState = _registerUiState.asStateFlow()

    private val _registerUiEvent = MutableSharedFlow<RegisterUiEvent>()
    val registerUiEvent = _registerUiEvent.asSharedFlow()

    /*** Datas ***/
    private val _products = MutableStateFlow<List<Product>>(emptyList())
    val products = _products.asStateFlow()

    private val _filteredProducts = MutableStateFlow<List<Product>>(emptyList())
    val filteredProducts = _filteredProducts.asStateFlow()

    private val _selectedProduct = MutableStateFlow<Product?>(null)
    val selectedProduct = _selectedProduct.asStateFlow()

    private val _fundingTitle = MutableStateFlow<String>("")
    val fundingTitle = _fundingTitle

    private val _fundingCategory = MutableStateFlow<String>("카테고리 선택")
    val fundingCategory = _fundingCategory.asStateFlow()

    private val _fundingCategoryName = MutableStateFlow<String>("")
    val fundingCategoryName = _fundingCategoryName

    private val _isFundingPublicState = MutableStateFlow<Boolean>(true)
    val isFundingPublicState = _isFundingPublicState.asStateFlow()

    private val _fundingBody = MutableStateFlow<String>("")
    val fundingBody = _fundingBody

    private val _fundingImageUris = MutableStateFlow<List<Uri>>(emptyList())
    val fundingImageUris = _fundingImageUris.asStateFlow()

    private val _fundingImageMultiparts = MutableStateFlow<List<MultipartBody.Part>>(emptyList())
    val fundingImageMultiparts = _fundingImageMultiparts.asStateFlow()

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
                }

                else -> {
                    _registerUiEvent.emit(RegisterUiEvent.GetProductsFail)
                }
            }
        }
    }

    private fun makeNewFundingRequestBody(): RequestBody {
        val metadata = mapOf(
            "title" to _fundingTitle.value,
            "productId" to _selectedProduct.value?.productId,
            "description" to _fundingBody.value,
            "category" to _fundingCategory.value,
            "categoryName" to when (_fundingCategoryName.value == "") {
                true -> null

                else -> _fundingCategoryName.value
            },
            "scope" to when (_isFundingPublicState.value) {
                true -> "공개"

                else -> "비공개"
            }
        )
        val gson = GsonBuilder().serializeNulls().create()
        val json = gson.toJson(metadata)
        return json.toRequestBody("application/json".toMediaTypeOrNull())
    }

    private fun uriToMultipart(uri: Uri): MultipartBody.Part? {
        val contentResolver = application.contentResolver
        val fileName = "image_${System.currentTimeMillis()}.jpg"

        return contentResolver.openInputStream(uri)?.use { inputStream ->
            val requestBody = inputStream.readBytes()
                .toRequestBody("image/*".toMediaTypeOrNull())
            MultipartBody.Part.createFormData("image", fileName, requestBody)
        }
    }

    fun initFundingInfo() {
        _selectedProduct.value = null
        _fundingTitle.value = ""
        _fundingCategory.value = "카테고리 선택"
        _fundingCategoryName.value = ""
        _isFundingPublicState.value = true
        _fundingBody.value = ""
        _fundingImageUris.value = emptyList()
        _fundingImageMultiparts.value = emptyList()
        _registerUiState.update {
            it.copy(
                productSelectState = InputValidState.NONE,
                fundingTitleState = InputValidState.NONE,
                fundingCategoryState = InputValidState.NONE,
                fundingDescriptionState = InputValidState.NONE
            )
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

    fun selectProduct(product: Product) {
        _selectedProduct.value = product
        _registerUiState.update { it.copy(productSelectState = InputValidState.VALID) }
    }

    fun validateFundingTitle(title: String) {
        when (title.isBlank()) {
            true -> _registerUiState.update { it.copy(fundingTitleState = InputValidState.NONE) }

            else -> _registerUiState.update { it.copy(fundingTitleState = InputValidState.VALID) }
        }
    }

    fun selectFundingCategory(category: String) {
        _fundingCategory.value = category
        when (category == "카테고리 선택") {
            true -> _registerUiState.update { it.copy(fundingCategoryState = InputValidState.INIT) }

            else -> _registerUiState.update { it.copy(fundingCategoryState = InputValidState.VALID) }
        }
    }

    fun setFundingState(isPublic: Boolean) {
        _isFundingPublicState.value = isPublic
    }

    fun validFundingDescription(description: String) {
        when (description.isBlank()) {
            true -> _registerUiState.update { it.copy(fundingDescriptionState = InputValidState.NONE) }

            else -> _registerUiState.update { it.copy(fundingDescriptionState = InputValidState.VALID) }
        }
    }

    fun setSelectedImages(uris: List<Uri>) {
        _fundingImageUris.value += uris
        _fundingImageMultiparts.value = _fundingImageUris.value.mapNotNull { uri ->
            uriToMultipart(uri)
        }
    }

    fun removeUri(uri: Uri) {
        _fundingImageUris.value -= uri
        _fundingImageMultiparts.value = _fundingImageUris.value.mapNotNull { uri ->
            uriToMultipart(uri)
        }
    }

    fun registerFunding() {
        viewModelScope.launch {
            val response = getFundingUseCase.registerFunding(
                files = _fundingImageMultiparts.value,
                body = makeNewFundingRequestBody()
            )

            when (response.status) {
                ApiStatus.SUCCESS -> {
                    _registerUiEvent.emit(RegisterUiEvent.RegisterFundingSuccess)
                }

                else -> {
                    _registerUiEvent.emit(RegisterUiEvent.RegisterFundingFail)
                }
            }
        }
    }
}