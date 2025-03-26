package com.wukiki.givu.views.mall

import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import com.wukiki.givu.views.mall.component.MallTopBar

@Composable
fun MallScreen() {
    Scaffold(

    ) { padding ->

        LazyColumn(
            modifier = Modifier
                .fillMaxWidth()
                .padding(padding)
        ) {
            item {
                MallTopBar()
            }

        }

    }
}

@Preview(showBackground = true)
@Composable
private fun PreviewMall() {
    MallScreen()
}