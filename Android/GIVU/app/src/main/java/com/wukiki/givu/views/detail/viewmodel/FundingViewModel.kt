package com.wukiki.givu.views.detail.viewmodel

import android.app.Application
import android.net.Uri
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.google.gson.GsonBuilder
import com.wukiki.domain.model.Account
import com.wukiki.domain.model.ApiResult
import com.wukiki.domain.model.ApiStatus
import com.wukiki.domain.model.Funding
import com.wukiki.domain.model.FundingDetail
import com.wukiki.domain.model.Letter
import com.wukiki.domain.model.Product
import com.wukiki.domain.model.Review
import com.wukiki.domain.model.Transfer
import com.wukiki.domain.model.User
import com.wukiki.domain.usecase.GetAuthUseCase
import com.wukiki.domain.usecase.GetFundingUseCase
import com.wukiki.domain.usecase.GetLetterUseCase
import com.wukiki.domain.usecase.GetMyPageUseCase
import com.wukiki.domain.usecase.GetProductUseCase
import com.wukiki.domain.usecase.GetReviewUseCase
import com.wukiki.domain.usecase.GetTransferUseCase
import com.wukiki.givu.util.CheckState
import com.wukiki.givu.util.InputValidState
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asSharedFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.collectLatest
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
    private val getMyPageUseCase: GetMyPageUseCase,
    private val getTransferUseCase: GetTransferUseCase
) : AndroidViewModel(application) {

    /*** Ui State, Event ***/
    private val _fundingUiState = MutableStateFlow<FundingUiState>(FundingUiState())
    val fundingUiState = _fundingUiState.asStateFlow()

    private val _fundingUiEvent = MutableSharedFlow<FundingUiEvent>()
    val fundingUiEvent = _fundingUiEvent.asSharedFlow()

    private val _userState = MutableStateFlow<ApiResult<User?>>(ApiResult.init())
    val userState = _userState.asStateFlow()

    private val _fundingState = MutableStateFlow<ApiResult<Funding?>>(ApiResult.init())
    val fundingState = _fundingState.asStateFlow()

    private val _fundingDetailState =
        MutableStateFlow<ApiResult<FundingDetail?>>(ApiResult.init())
    val fundingDetailState = _fundingDetailState.asStateFlow()

    private val _transferState = MutableStateFlow<ApiResult<Transfer?>>(ApiResult.init())
    val transferState = _transferState.asStateFlow()

    private val _letterState = MutableStateFlow<ApiResult<Letter?>>(ApiResult.init())
    val letterState = _letterState.asStateFlow()

    private val _accountState = MutableStateFlow<ApiResult<Account?>>(ApiResult.init())
    val accountState = _accountState.asStateFlow()

    private val _productsState =
        MutableStateFlow<ApiResult<List<Product>>>(ApiResult.init())
    val productsState = _productsState.asStateFlow()

    private val _reviewState = MutableStateFlow<ApiResult<Review?>>(ApiResult.init())
    val reviewState = _reviewState.asStateFlow()

    /*** Datas ***/
    private val _user = MutableStateFlow<User?>(null)
    val user = _user.asStateFlow()

    private val _account = MutableStateFlow<Account?>(null)
    val account = _account.asStateFlow()

    private val _fundingId = MutableStateFlow<Int>(-1)
    val fundingId = _fundingId.asStateFlow()

    private val _fundings = MutableStateFlow<List<Funding>>(emptyList())
    val fundings = _fundings.asStateFlow()

    private val _selectedFunding = MutableStateFlow<FundingDetail?>(null)
    val selectedFunding = _selectedFunding.asStateFlow()

    private val _letterSort = MutableStateFlow<String>("최신순")
    val letterSort = _letterSort.asStateFlow()

    private val _originalImages = MutableStateFlow<HashMap<String, Boolean>>(hashMapOf())
    val originalImages = _originalImages.asStateFlow()

    private val _charge = MutableStateFlow<Int>(0)
    val charge = _charge.asStateFlow()

    private val _transfer = MutableStateFlow<Transfer?>(null)
    val transfer = _transfer.asStateFlow()

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

                else -> "비밀"
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

    private fun getPaymentOfFunding(paymentId: Int) {
        viewModelScope.launch {
            val response = getFundingUseCase.fetchPaymentOfFunding(paymentId)

            response.collectLatest { result ->
                _transferState.value = result
                if (result.status == ApiStatus.SUCCESS) {
                    _transfer.value = result.data
                    participateFunding()
                } else if ((result.status == ApiStatus.FAIL) || (result.status == ApiStatus.ERROR)) {
                    _fundingUiEvent.emit(FundingUiEvent.ParticipateFundingFail)
                }
            }
        }
    }

    private fun participateFunding() {
        viewModelScope.launch {
            val response = getLetterUseCase.submitFundingLetter(
                fundingId = _selectedFunding.value?.id.toString(),
                image = null,
                body = makeLetterRequestBody()
            )

            response.collectLatest { result ->
                _letterState.value = result
                if (result.status == ApiStatus.SUCCESS) {
                    initFunding((result.data?.fundingId ?: "-1").toInt())
                    _fundingUiEvent.emit(FundingUiEvent.ParticipateFundingSuccess)
                } else if ((result.status == ApiStatus.FAIL) || (result.status == ApiStatus.ERROR)) {
                    _fundingUiEvent.emit(FundingUiEvent.ParticipateFundingFail)
                }
            }
        }
    }

    fun initUserInfo() {
        viewModelScope.launch {
            val response = getAuthUseCase.fetchUserInfo()

            response.collectLatest { result ->
                _userState.value = result
                if (result.status == ApiStatus.SUCCESS) {
                    _user.value = result.data
                }
            }
        }
    }

    fun initFunding(fundingId: Int) {
        viewModelScope.launch {
            _fundingId.value = fundingId
            val response = getFundingUseCase.fetchFundingDetail(fundingId)

            response.collectLatest { result ->
                _fundingDetailState.value = result
                if (result.status == ApiStatus.SUCCESS) {
                    _selectedFunding.value = result.data
                    setFundingInfo()
                }
            }
        }
    }

    fun initProducts() {
        viewModelScope.launch {
            val response = getProductUseCase.getProducts()

            response.collectLatest { result ->
                _productsState.value = result
                if (result.status == ApiStatus.SUCCESS) {
                    val newProducts = result.data ?: emptyList()
                    _products.value = newProducts
                } else if ((result.status == ApiStatus.FAIL) || (result.status == ApiStatus.ERROR)) {
                    _fundingUiEvent.emit(FundingUiEvent.GetProductsFail)
                }
            }
        }
    }

    fun initBalance() {
        viewModelScope.launch {
            val response = getMyPageUseCase.fetchAccount()

            response.collectLatest { result ->
                _accountState.value = result
                if (result.status == ApiStatus.SUCCESS) {
                    _account.value = result.data
                }
            }
        }
    }

    fun initTransfer() {
        _transfer.value = null
    }

    fun setCharge(money: Int) {
        _charge.value = money
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

    fun deleteLetter(letterId: String) {
        viewModelScope.launch {
            val response = getLetterUseCase.deleteFundingLetter(letterId)

            response.collectLatest { result ->
                if (result.status == ApiStatus.SUCCESS) {
                    _fundingUiEvent.emit(FundingUiEvent.DeleteLetterSuccess)
                } else if ((result.status == ApiStatus.FAIL) || (result.status == ApiStatus.ERROR)) {
                    _fundingUiEvent.emit(FundingUiEvent.DeleteLetterFail)
                }
            }
        }
    }

    fun transferFunding() {
        viewModelScope.launch {
            val response = getTransferUseCase.transferFunding(
                fundingId = _selectedFunding.value?.id ?: -1,
                amount = _charge.value
            )

            response.collectLatest { result ->
                _transferState.value = result
                if (result.status == ApiStatus.SUCCESS) {
                    _charge.value = 0
                    getPaymentOfFunding(result.data?.paymentId ?: -1)
                } else if ((result.status == ApiStatus.FAIL) || (result.status == ApiStatus.ERROR)) {
                    _fundingUiEvent.emit(FundingUiEvent.TransferFail)
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

            response.collectLatest { result ->
                _fundingState.value = result
                if (result.status == ApiStatus.SUCCESS) {
                    _fundingUiEvent.emit(FundingUiEvent.UpdateFundingSuccess)
                } else if ((result.status == ApiStatus.FAIL) || (result.status == ApiStatus.ERROR)) {
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

            response.collectLatest { result ->
                if (result.status == ApiStatus.SUCCESS) {
                    _fundingUiEvent.emit(FundingUiEvent.CancelFundingSuccess)
                } else if ((result.status == ApiStatus.FAIL) || (result.status == ApiStatus.ERROR)) {
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

            response.collectLatest { result ->
                _reviewState.value = result
                if (result.status == ApiStatus.SUCCESS) {
                    _fundingUiEvent.emit(FundingUiEvent.FinishFundingSuccess)
                } else if ((result.status == ApiStatus.FAIL) || (result.status == ApiStatus.ERROR)) {
                    _fundingUiEvent.emit(FundingUiEvent.FinishFundingFail)
                }
            }
        }
    }
}