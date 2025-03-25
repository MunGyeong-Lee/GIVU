package com.wukiki.givu.views.cancel.component

import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier

@Composable
fun RecommendGiftPager() {
    LazyRow(
        modifier = Modifier.fillMaxWidth()
    ) {
        items(count = 3) { _ ->
            RecommendGiftCardItem()
        }
    }
}