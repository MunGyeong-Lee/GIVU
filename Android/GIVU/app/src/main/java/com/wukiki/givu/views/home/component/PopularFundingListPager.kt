package com.wukiki.givu.views.home.component

import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.navigation.NavController
import com.wukiki.domain.model.Funding
import com.wukiki.givu.views.home.viewmodel.HomeViewModel

@Composable
fun PopularFundingListPager(
    homeViewModel: HomeViewModel,
    navController: NavController
) {
    val popularFundings by homeViewModel.popularFundings.collectAsState()

    LazyRow(
        modifier = Modifier.fillMaxWidth()
    ) {
        items(popularFundings, key = { it.id }) { funding ->
            PopularFundingCardItem(funding, navController)
        }
    }
}