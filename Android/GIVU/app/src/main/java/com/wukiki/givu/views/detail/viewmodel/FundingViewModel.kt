package com.wukiki.givu.views.detail.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import com.wukiki.domain.model.Funding
import com.wukiki.domain.model.Letter
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import javax.inject.Inject

@HiltViewModel
class FundingViewModel @Inject constructor(
    private val application: Application
) : AndroidViewModel(application) {

    private val _selectedFunding = MutableStateFlow<Funding?>(null)
    val selectedFunding = _selectedFunding.asStateFlow()

    private val _selectedFundingLetter = MutableStateFlow<List<Letter>>(emptyList())
    val selectedFundingLetter = _selectedFundingLetter.asStateFlow()

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
    }
}