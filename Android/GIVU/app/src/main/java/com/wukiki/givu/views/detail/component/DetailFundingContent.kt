package com.wukiki.givu.views.detail.component

import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.navigation.NavController
import com.wukiki.domain.model.Funding

@Composable
fun DetailFundingContent(funding: Funding, navController: NavController) {
    LazyColumn(
        modifier = Modifier.fillMaxWidth()
    ) {
        // 펀딩 대표 이미지
        item {
            FundingImageSliderPager(funding.images)
        }

        // 펀딩 정보
        item {
            FundingInfoItem(funding)
        }

        // 메시지 박스
        item {
            FundingDescriptionItem(funding.description)
        }

        // 축하 편지 목록
        item {
            LetterListPager(emptyList())
        }
    }
}