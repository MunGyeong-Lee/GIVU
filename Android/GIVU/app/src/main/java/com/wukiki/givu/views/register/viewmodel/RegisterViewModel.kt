package com.wukiki.givu.views.register.viewmodel

import android.app.Application
import android.net.Uri
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.google.gson.Gson
import com.google.gson.GsonBuilder
import com.wukiki.domain.model.ApiStatus
import com.wukiki.domain.model.Product
import com.wukiki.domain.usecase.GetFundingUseCase
import com.wukiki.domain.usecase.GetProductUseCase
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
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
                    // _fundingUiEvent.emit(FundingUiEvent.GetProductsFail)
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
        Timber.d("Selected Product: ${_selectedProduct.value}")
    }

    fun selectFundingCategory(category: String) {
        _fundingCategory.value = category
    }

    fun setFundingState(isPublic: Boolean) {
        _isFundingPublicState.value = isPublic
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
            Timber.d("New Funding: ${_fundingImageMultiparts.value}")
            val response = getFundingUseCase.registerFunding(
                files = _fundingImageMultiparts.value,
                body = makeNewFundingRequestBody()
            )

            when (response.status) {
                ApiStatus.SUCCESS -> {

                }

                else -> {

                }
            }
        }
    }
}