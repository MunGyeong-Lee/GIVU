package com.wukiki.givu.views.detail.viewmodel

import android.app.Application
import android.net.Uri
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.google.gson.GsonBuilder
import com.wukiki.domain.model.ApiStatus
import com.wukiki.domain.model.Funding
import com.wukiki.domain.model.FundingDetail
import com.wukiki.domain.model.Letter
import com.wukiki.domain.model.Product
import com.wukiki.domain.model.Review
import com.wukiki.domain.model.User
import com.wukiki.domain.usecase.GetAuthUseCase
import com.wukiki.domain.usecase.GetFundingUseCase
import com.wukiki.domain.usecase.GetLetterUseCase
import com.wukiki.domain.usecase.GetMyPageUseCase
import com.wukiki.domain.usecase.GetProductUseCase
import com.wukiki.domain.usecase.GetReviewUseCase
import com.wukiki.givu.util.CheckState
import com.wukiki.givu.util.InputValidState
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asSharedFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.MultipartBody
import okhttp3.RequestBody
import okhttp3.RequestBody.Companion.toRequestBody
import javax.inject.Inject

@HiltViewModel
class FundingViewModel @Inject constructor(
    private val application: Application,
    private val getAuthUseCase: GetAuthUseCase,
    private val getFundingUseCase: GetFundingUseCase,
    private val getProductUseCase: GetProductUseCase,
    private val getReviewUseCase: GetReviewUseCase,
    private val getLetterUseCase: GetLetterUseCase,
    private val getMyPageUseCase: GetMyPageUseCase
) : AndroidViewModel(application) {

    /*** Ui State, Event ***/
    private val _fundingUiState = MutableStateFlow<FundingUiState>(FundingUiState())
    val fundingUiState = _fundingUiState.asStateFlow()

    private val _fundingUiEvent = MutableSharedFlow<FundingUiEvent>()
    val fundingUiEvent = _fundingUiEvent.asSharedFlow()

    /*** Datas ***/
    private val _user = MutableStateFlow<User?>(null)
    val user = _user.asStateFlow()

    private val _balance = MutableStateFlow<Int>(0)
    val balance = _balance.asStateFlow()

    private val _fundings = MutableStateFlow<List<Funding>>(emptyList())
    val fundings = _fundings.asStateFlow()

    private val _selectedFunding = MutableStateFlow<FundingDetail?>(null)
    val selectedFunding = _selectedFunding.asStateFlow()

    private val _letterSort = MutableStateFlow<String>("최신순")
    val letterSort = _letterSort.asStateFlow()

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

    private val _fundingParticipants = MutableStateFlow<List<Review>>(emptyList())
    val fundingParticipants = _fundingParticipants.asStateFlow()

    private val _fundingReviewUri = MutableStateFlow<Uri?>(null)
    val fundingReviewUri = _fundingReviewUri.asStateFlow()

    private val _fundingReviewMultipart = MutableStateFlow<MultipartBody.Part?>(null)
    val fundingReviewMultipart = _fundingReviewMultipart.asStateFlow()

    private val _isFundingReviewPersonalCheck = MutableStateFlow<Boolean>(false)
    val isFundingReviewPersonalCheck = _isFundingReviewPersonalCheck.asStateFlow()

    private val _isFundingReviewNoteCheck = MutableStateFlow<Boolean>(false)
    val isFundingReviewNoteCheck = _isFundingReviewNoteCheck.asStateFlow()

    private val _products = MutableStateFlow<List<Product>>(emptyList())
    val products = _products.asStateFlow()

    private fun setFundingInfo() {
        _originalImages.value = hashMapOf()
        _fundingImageUris.value = listOf()
        _fundingImageMultiparts.value = listOf()
        _selectedFunding.value?.let {
            _selectedFundingLetter.value = it.letters.sortedByDescending { it.createdAt }
            _fundingParticipants.value = it.reviews
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
            _fundingUiState.update { uiState ->
                uiState.copy(
                    fundingTitleState = InputValidState.VALID,
                    fundingCategoryState = InputValidState.VALID,
                    fundingDescriptionState = InputValidState.VALID
                )
            }
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

    private fun makeReviewRequestBody(): RequestBody {
        val metadata = mapOf(
            "comment" to _fundingReview.value
        )
        val gson = GsonBuilder().serializeNulls().create()
        val json = gson.toJson(metadata)
        return json.toRequestBody("application/json".toMediaTypeOrNull())
    }

    private fun makeLetterRequestBody(): RequestBody {
        val metadata = mapOf(
            "comment" to _writeLetter.value,
            "access" to "공개"
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

    private fun fetchUserInfo(): Flow<User?> = flow {
        val user = getAuthUseCase.getUserInfo().first()
        emit(user)
    }

    fun initUserInfo() {
        viewModelScope.launch {
            val response = getAuthUseCase.fetchUserInfo()

            when (response.status) {
                ApiStatus.SUCCESS -> {
                    _user.value = response.data
                }

                else -> {

                }
            }
        }
    }

    fun initFunding(fundingId: Int) {
        viewModelScope.launch {
            val response = getFundingUseCase.fetchFundingDetail(fundingId)

            when (response.status) {
                ApiStatus.SUCCESS -> {
                    _selectedFunding.value = response.data
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

    fun initBalance() {
        viewModelScope.launch {
            val response = getMyPageUseCase.fetchAccount()

            when (response.status) {
                ApiStatus.SUCCESS -> {
                    _balance.value = response.data ?: 0
                }

                else -> {

                }
            }
        }
    }

    fun sortLetters(sortOption: String) {
        _letterSort.value = sortOption
        val newLetters = _selectedFundingLetter.value
        when (_letterSort.value) {
            "최신순" -> {
                _selectedFundingLetter.value = newLetters.sortedByDescending { it.createdAt }
            }

            "오래된순" -> {
                _selectedFundingLetter.value = newLetters.sortedBy { it.createdAt }
            }

            "이름순" -> {
                _selectedFundingLetter.value = newLetters.sortedBy { it.userNickname }
            }
        }
    }

    fun validateFundingTitle(title: String) {
        when (title.isBlank()) {
            true -> _fundingUiState.update { it.copy(fundingTitleState = InputValidState.NONE) }

            else -> _fundingUiState.update { it.copy(fundingTitleState = InputValidState.VALID) }
        }
    }

    fun selectFundingCategory(category: String) {
        _fundingCategory.value = category
        when (category == "카테고리 선택") {
            true -> _fundingUiState.update { it.copy(fundingCategoryState = InputValidState.INIT) }

            else -> _fundingUiState.update { it.copy(fundingCategoryState = InputValidState.VALID) }
        }
    }

    fun setFundingState(isPublic: Boolean) {
        _isFundingPublicState.value = isPublic
    }

    fun validFundingDescription(description: String) {
        when (description.isBlank()) {
            true -> _fundingUiState.update { it.copy(fundingDescriptionState = InputValidState.NONE) }

            else -> _fundingUiState.update { it.copy(fundingDescriptionState = InputValidState.VALID) }
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

    fun validateReviewComment(comment: String) {
        when (comment.isBlank()) {
            true -> _fundingUiState.update { it.copy(reviewCommentState = InputValidState.NONE) }

            else -> _fundingUiState.update { it.copy(reviewCommentState = InputValidState.VALID) }
        }
    }

    fun setSelectedReviewImages(uri: Uri) {
        _fundingReviewUri.value = uri
        _fundingReviewMultipart.value = uriToMultipart(uri)
    }

    fun removeReviewUri() {
        _fundingReviewUri.value = null
        _fundingReviewMultipart.value = null
    }

    fun setPersonalCheck() {
        _isFundingReviewPersonalCheck.value = !_isFundingReviewPersonalCheck.value
        when (_isFundingReviewPersonalCheck.value) {
            true -> _fundingUiState.update { it.copy(reviewPersonalCheck = CheckState.TRUE) }

            else -> _fundingUiState.update { it.copy(reviewPersonalCheck = CheckState.FALSE) }
        }
    }

    fun setNoteCheck() {
        _isFundingReviewNoteCheck.value = !_isFundingReviewNoteCheck.value
        when (_isFundingReviewNoteCheck.value) {
            true -> _fundingUiState.update { it.copy(reviewNoteCheck = CheckState.TRUE) }

            else -> _fundingUiState.update { it.copy(reviewNoteCheck = CheckState.FALSE) }
        }
    }

    fun participateFunding() {
        viewModelScope.launch {
            val response = getLetterUseCase.submitFundingLetter(
                fundingId = _selectedFunding.value?.id.toString(),
                image = null,
                body = makeLetterRequestBody()
            )

            when (response.status) {
                ApiStatus.SUCCESS -> {
                    _fundingUiEvent.emit(FundingUiEvent.ParticipateFundingSuccess)
                }

                else -> {
                    _fundingUiEvent.emit(FundingUiEvent.ParticipateFundingFail)
                }
            }
        }
    }

    fun updateFunding() {
        viewModelScope.launch {
            val response = getFundingUseCase.updateFundingDetail(
                fundingId = _selectedFunding.value?.id ?: -1,
                files = _fundingImageMultiparts.value,
                body = makeFundingRequestBody()
            )

            when (response.status) {
                ApiStatus.SUCCESS -> {
                    _fundingUiEvent.emit(FundingUiEvent.UpdateFundingSuccess)
                }

                else -> {
                    _fundingUiEvent.emit(FundingUiEvent.UpdateFundingFail)
                }
            }
        }
    }

    fun cancelFunding() {
        viewModelScope.launch {
            val response = getFundingUseCase.cancelFunding(
                fundingId = _selectedFunding.value?.id ?: -1
            )

            when (response.status) {
                ApiStatus.SUCCESS -> {
                    _fundingUiEvent.emit(FundingUiEvent.CancelFundingSuccess)
                }

                else -> {
                    _fundingUiEvent.emit(FundingUiEvent.CancelFundingFail)
                }
            }
        }
    }

    fun finishFunding() {
        viewModelScope.launch {
            val response = getReviewUseCase.finishReview(
                fundingId = _selectedFunding.value?.id ?: -1,
                file = _fundingReviewMultipart.value,
                body = makeReviewRequestBody()
            )

            when (response.status) {
                ApiStatus.SUCCESS -> {
                    _fundingUiEvent.emit(FundingUiEvent.FinishFundingSuccess)
                }

                else -> {
                    _fundingUiEvent.emit(FundingUiEvent.FinishFundingFail)
                }
            }
        }
    }
}