package com.wukiki.givu.views.home.component

import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.navigation.NavController
import com.wukiki.domain.model.Funding

@Composable
fun PopularFundingListPager(fundings: List<Funding>, navController: NavController) {
    LazyRow(
        modifier = Modifier.fillMaxWidth()
    ) {
        items(fundings, key = { it.id }) { funding ->
            PopularFundingCardItem(funding, navController)
        }
    }
}