package com.wukiki.givu.views.detail.viewmodel

import android.app.Application
import android.net.Uri
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.google.gson.GsonBuilder
import com.wukiki.domain.model.ApiStatus
import com.wukiki.domain.model.Funding
import com.wukiki.domain.model.Letter
import com.wukiki.domain.model.Product
import com.wukiki.domain.model.User
import com.wukiki.domain.usecase.GetFundingUseCase
import com.wukiki.domain.usecase.GetProductUseCase
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
class FundingViewModel @Inject constructor(
    private val application: Application,
    private val getFundingUseCase: GetFundingUseCase,
    private val getProductUseCase: GetProductUseCase
) : AndroidViewModel(application) {

    /*** Ui Event ***/
    private val _fundingUiEvent = MutableSharedFlow<FundingUiEvent>()
    val fundingUiEvent = _fundingUiEvent.asSharedFlow()

    /*** Datas ***/
    private val _fundings = MutableStateFlow<List<Funding>>(emptyList())
    val fundings = _fundings.asStateFlow()

    private val _selectedFunding = MutableStateFlow<Funding?>(null)
    val selectedFunding = _selectedFunding.asStateFlow()

    private val _originalImages = MutableStateFlow<HashMap<String, Boolean>>(hashMapOf())
    val originalImages = _originalImages.asStateFlow()

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

    private val _selectedFundingLetter = MutableStateFlow<List<Letter>>(emptyList())
    val selectedFundingLetter = _selectedFundingLetter.asStateFlow()

    private val _writeLetter = MutableStateFlow<String>("")
    val writeLetter = _writeLetter

    private val _paymentPassword = MutableStateFlow<String>("")
    val paymentPassword = _paymentPassword

    private val _fundingReview = MutableStateFlow<String>("")
    val fundingReview = _fundingReview

    private val _fundingParticipants = MutableStateFlow<List<User>>(emptyList())
    val fundingParticipants = _fundingParticipants.asStateFlow()

    private val _fundingReviewUris = MutableStateFlow<List<Uri>>(emptyList())
    val fundingReviewUris = _fundingReviewUris.asStateFlow()

    private val _fundingReviewMultiparts = MutableStateFlow<List<MultipartBody.Part>>(emptyList())
    val fundingReviewMultiparts = _fundingReviewMultiparts.asStateFlow()

    private val _products = MutableStateFlow<List<Product>>(emptyList())
    val products = _products.asStateFlow()

    init {
        initFundings()
        initProducts()

        val newLetter = Letter(
            letterId = "1",
            fundingId = "1",
            userId = "2",
            comment = "굿~",
            image = "",
            private = "전체 공개",
            createdAt = "2025.03.20",
            updatedAt = "2025.03.20"
        )

        _selectedFundingLetter.value = listOf(newLetter)

        val newParticipants = listOf(
            User(
                id = "1",
                kakaoid = "1",
                nickname = "김싸피",
                email = "aa@aa.com",
                birth = "1970.01.01",
                profileImage = "https://img.tumblbug.com/eyJidWNrZXQiOiJ0dW1ibGJ1Zy1pbWctYXNzZXRzIiwia2V5IjoiY292ZXIvNzMyZWNiODgtMDdhYS00Y2FmLThlNTEtNGIwOTkyMDY1MzJmL2U3N2MwYTEzLTE5NzktNDJlNy1hNDFjLTljN2JmMTIxZGMzNC5wbmciLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjQ2NSwiaGVpZ2h0Ijo0NjUsIndpdGhvdXRFbmxhcmdlbWVudCI6dHJ1ZX19fQ==",
                address = "",
                gender = "TODO()",
                ageRange = "TODO()",
                balance = "TODO()",
                createdAt = "TODO()",
                updatedAt = "TODO()"
            )
        )

        _fundingParticipants.value = newParticipants
    }

    private fun setFundingInfo() {
        _selectedFunding.value?.let {
            it.images.forEach { image ->
                _originalImages.update { current ->
                    current.toMutableMap().apply {
                        this[image] = false
                    } as HashMap<String, Boolean>
                }
            }
            _fundingTitle.value = it.title
            _fundingCategory.value = it.category
            _fundingCategoryName.value = it.categoryName
            when (it.scope) {
                "공개" -> _isFundingPublicState.value = true

                else -> _isFundingPublicState.value = false
            }
            _fundingBody.value = it.description
        }
    }

    private fun makeFundingRequestBody(): RequestBody {
        val metadata = mapOf(
            "title" to _fundingTitle.value,
            "description" to _fundingBody.value,
            "category" to _fundingCategory.value,
            "categoryName" to when (_selectedFunding.value?.categoryName == "") {
                true -> null

                else -> _fundingCategoryName.value
            },
            "scope" to when (_isFundingPublicState.value) {
                true -> "공개"

                else -> "비공개"
            },
            "toDelete" to _originalImages.value.filter { it.value }.keys.toList()
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

    fun initFundings() {
        viewModelScope.launch {
            val response = getFundingUseCase.fetchFundings()

            when (response.status) {
                ApiStatus.SUCCESS -> {
                    val newFundings = response.data ?: emptyList()
                    _fundings.value = newFundings
                    _selectedFunding.value = newFundings.last()
                    setFundingInfo()
                }

                else -> {

                }
            }
        }
    }

    fun initProducts() {
        viewModelScope.launch {
            val response = getProductUseCase.getProducts()

            when (response.status) {
                ApiStatus.SUCCESS -> {
                    val newProducts = response.data ?: emptyList()
                    _products.value = newProducts
                }

                else -> {
                    _fundingUiEvent.emit(FundingUiEvent.GetProductsFail)
                }
            }
        }
    }

    fun selectFundingCategory(category: String) {
        _fundingCategory.value = category
    }

    fun setFundingState(isPublic: Boolean) {
        _isFundingPublicState.value = isPublic
    }

    fun setSelectedImages(uris: List<Uri>) {
        Timber.d("Uris: $uris")
        _fundingImageUris.value += uris
        _fundingImageMultiparts.value = _fundingImageUris.value.mapNotNull { uri ->
            uriToMultipart(uri)
        }
    }

    fun removeUri(uri: Uri) {
        _fundingImageUris.value -= uri
        _fundingImageMultiparts.value = _fundingImageUris.value.mapNotNull {
            uriToMultipart(it)
        }
    }

    fun removeUrl(url: String) {
        _originalImages.update { current ->
            current.toMutableMap().apply {
                this[url] = !(this[url] ?: false)
            } as HashMap<String, Boolean>
        }
    }

    fun updateFunding() {
        viewModelScope.launch {
            Timber.d("New Funding: ${_fundingImageMultiparts.value}")
            val response = getFundingUseCase.updateFundingDetail(
                fundingId = _selectedFunding.value?.id ?: -1,
                files = _fundingImageMultiparts.value,
                body = makeFundingRequestBody()
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