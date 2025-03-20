package com.wukiki.givu.views.detail.component

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.wrapContentHeight
import androidx.compose.foundation.pager.HorizontalPager
import androidx.compose.foundation.pager.rememberPagerState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.unit.dp
import coil.compose.SubcomposeAsyncImage

@Composable
fun FundingImageSliderPager(images: List<String>) {
    val pagerState = rememberPagerState(
        initialPage = 0,
        initialPageOffsetFraction = 0F,
        pageCount = { images.size }
    )

    Column(
        modifier = Modifier.fillMaxWidth()
    ) {
        HorizontalPager(
            state = pagerState,
            modifier = Modifier
                .fillMaxWidth()
                .wrapContentHeight()
        ) { index ->
            SubcomposeAsyncImage(
                model = images[index],
                contentDescription = "Funding Image",
                contentScale = ContentScale.Crop,
                loading = { CircularProgressIndicator() },
                modifier = Modifier
                    .width(180.dp) // 이미지 크기
                    .aspectRatio(3F / 2F)
                    .clip(RoundedCornerShape(15.dp))
            )
        }

        Text(
            text = "${pagerState.currentPage + 1} / ${images.size}",
            modifier = Modifier
                .align(Alignment.End)
                .padding(8.dp),
            color = Color.White
        )
    }
}