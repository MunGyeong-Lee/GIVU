package com.wukiki.givu.views.mall.component

import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier

@Composable
fun PopularItemListPager() {

    LazyRow(
        modifier = Modifier.fillMaxWidth()
    ) {
        item() {
            MallItemPopular()
        }
        item() {
            MallItemPopular()
        }
        item() {
            MallItemPopular()
        }
        item() {
            MallItemPopular()
        }
        item() {
            MallItemPopular()
        }
    }
}