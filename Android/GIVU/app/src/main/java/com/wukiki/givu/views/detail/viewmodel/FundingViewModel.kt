package com.wukiki.givu.views.detail.viewmodel

import android.app.Application
import android.net.Uri
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.wukiki.domain.model.ApiStatus
import com.wukiki.domain.model.Funding
import com.wukiki.domain.model.Letter
import com.wukiki.domain.model.Product
import com.wukiki.domain.model.User
import com.wukiki.domain.usecase.GetProductUseCase
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asSharedFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.MultipartBody
import okhttp3.RequestBody.Companion.toRequestBody
import javax.inject.Inject

@HiltViewModel
class FundingViewModel @Inject constructor(
    private val application: Application,
    private val getProductUseCase: GetProductUseCase
) : AndroidViewModel(application) {

    /*** Ui Event ***/
    private val _fundingUiEvent = MutableSharedFlow<FundingUiEvent>()
    val fundingUiEvent = _fundingUiEvent.asSharedFlow()

    /*** Datas ***/
    private val _selectedFunding = MutableStateFlow<Funding?>(null)
    val selectedFunding = _selectedFunding.asStateFlow()

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
        val newFunding = Funding(
            id = 1,
            userId = 1,
            userNickname = "",
            userProfile = "",
            productId = 1,
            productName = "",
            productPrice = "",
            productImage = "",
            title = "마이화장품한테 화장품 사주세요~",
            body = "펀딩 내용 설명",
            description = "설명",
            category = "beauty",
            categoryName = "뷰티",
            scope = "public",
            participantsNumber = "100",
            fundedAmount = 10000,
            status = "active",
            images = listOf("https://images.unsplash.com/photo-1522383225653-ed111181a951"),
            createdAt = "2024-03-01",
            updatedAt = "2024-03-10"
        )

        _selectedFunding.value = newFunding

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

        initProducts()
    }

    private fun initProducts() {
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

    private fun uriToMultipart(uri: Uri): MultipartBody.Part? {
        val contentResolver = application.contentResolver
        val inputStream = contentResolver.openInputStream(uri) ?: return null

        val fileName = "image_${System.currentTimeMillis()}.jpg"
        val requestBody = inputStream.readBytes().toRequestBody("image/*".toMediaTypeOrNull())
        return MultipartBody.Part.createFormData("images", fileName, requestBody)
    }

    fun setSelectedImages(uris: List<Uri>) {
        _fundingReviewUris.value += uris
        _fundingReviewMultiparts.value = _fundingReviewUris.value.mapNotNull { uri ->
            uriToMultipart(uri)
        }
    }

    fun removeUri(uri: Uri) {
        _fundingReviewUris.value -= uri
    }
}