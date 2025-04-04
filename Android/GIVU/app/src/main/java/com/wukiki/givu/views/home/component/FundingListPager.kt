package com.wukiki.givu.views.home.component

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.wukiki.domain.model.Funding

@Composable
fun FundingListPager(
    fundings: List<Funding>,
    navController: NavController
) {
//    LazyColumn(
//        modifier = Modifier
//            .fillMaxWidth()
//            .height((100 * fundings.size).dp)
//    ) {
//        items(fundings, key = { it.id }) { funding ->
//            FundingItem(funding, navController) { }
//        }
//    }

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .height((100 * fundings.size).dp)
    ) {
        fundings.forEach { funding ->
            FundingItem(funding, navController) { }
        }
    }
}