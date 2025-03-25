package com.wukiki.givu.views.detail.viewmodel

import android.app.Application
import android.net.Uri
import androidx.lifecycle.AndroidViewModel
import com.wukiki.domain.model.Funding
import com.wukiki.domain.model.Letter
import com.wukiki.domain.model.User
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.MultipartBody
import okhttp3.RequestBody.Companion.toRequestBody
import javax.inject.Inject

@HiltViewModel
class FundingViewModel @Inject constructor(
    private val application: Application
) : AndroidViewModel(application) {

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

    init {
        val newFunding = Funding(
            id = "1",
            userId = "1",
            productId = "1",
            title = "푸딩 먹고싶다",
            body = "??",
            description = "생일이에요 빨리 사주세요",
            category = "생일",
            categoryName = "",
            scope = "전체 공개",
            participantsNumber = "12",
            fundedAmount = "1,200원",
            status = "진행중",
            images = listOf(
                "https://img.tumblbug.com/eyJidWNrZXQiOiJ0dW1ibGJ1Zy1pbWctYXNzZXRzIiwia2V5IjoiY292ZXIvNzMyZWNiODgtMDdhYS00Y2FmLThlNTEtNGIwOTkyMDY1MzJmL2U3N2MwYTEzLTE5NzktNDJlNy1hNDFjLTljN2JmMTIxZGMzNC5wbmciLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjQ2NSwiaGVpZ2h0Ijo0NjUsIndpdGhvdXRFbmxhcmdlbWVudCI6dHJ1ZX19fQ==",
                "https://img.tumblbug.com/eyJidWNrZXQiOiJ0dW1ibGJ1Zy1pbWctYXNzZXRzIiwia2V5IjoiY292ZXIvNzMyZWNiODgtMDdhYS00Y2FmLThlNTEtNGIwOTkyMDY1MzJmLzE4MTUwMmM1LTcxNTMtNDgxYi1iMDgyLTkwNjEzNDAzNTAwYi5qcGciLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjEyNDAsImhlaWdodCI6MTI0MCwid2l0aG91dEVubGFyZ2VtZW50Ijp0cnVlfX19",
                "https://img.tumblbug.com/eyJidWNrZXQiOiJ0dW1ibGJ1Zy1pbWctYXNzZXRzIiwia2V5IjoiY292ZXIvNzMyZWNiODgtMDdhYS00Y2FmLThlNTEtNGIwOTkyMDY1MzJmL2UwN2U0NzRjLWM2OTAtNGRmZS1iYmFiLTU1ZWY1ZTRhMDM4Zi5qcGciLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjEyNDAsImhlaWdodCI6MTI0MCwid2l0aG91dEVubGFyZ2VtZW50Ijp0cnVlfX19"
            ),
            createdAt = "2025.03.20",
            updatedAt = "2025.03.20"
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