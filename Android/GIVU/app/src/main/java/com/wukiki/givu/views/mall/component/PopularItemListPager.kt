package com.wukiki.givu.views.mall.component

import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import com.wukiki.domain.model.Product

@Composable
fun PopularItemListPager(popularList: List<Product>) {

    LazyRow(
        modifier = Modifier.fillMaxWidth()
    ) {
        items(popularList) { product ->
            MallItemPopular(product)

        }
//        item() {
//            MallItemPopular()
//        }

    }
}