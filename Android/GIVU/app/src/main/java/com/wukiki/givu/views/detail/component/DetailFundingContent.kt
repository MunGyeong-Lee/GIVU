package com.wukiki.givu.views.detail.component

import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.navigation.NavController
import com.wukiki.domain.model.Funding
import com.wukiki.domain.model.Letter

@Composable
fun DetailFundingContent(funding: Funding, letters: List<Letter>, navController: NavController) {
    LazyColumn(
        modifier = Modifier.fillMaxWidth()
    ) {
        item {
            FundingImageSliderPager(funding.images)
        }

        item {
            FundingInfoItem(funding)
        }

        item {
            FundingDescriptionItem(funding.description)
        }

        item {
            LetterListPager(letters)
        }
    }
}