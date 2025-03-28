package com.wukiki.givu.views.detail.component

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.wrapContentHeight
import androidx.compose.foundation.pager.HorizontalPager
import androidx.compose.foundation.pager.rememberPagerState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import coil.compose.SubcomposeAsyncImage
import com.wukiki.givu.ui.suit

@Composable
fun FundingImageSliderPager(images: List<String>) {
    val pagerState = rememberPagerState(
        initialPage = 0,
        initialPageOffsetFraction = 0F,
        pageCount = { images.size }
    )

    Box(
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
                    .fillMaxWidth()
                    .aspectRatio(4F / 3F)
            )
        }

        Box(
            modifier = Modifier
                .padding(16.dp)
                .align(Alignment.BottomEnd)
                .background(Color.DarkGray, shape = RoundedCornerShape(20.dp))
                .padding(horizontal = 12.dp, vertical = 2.dp)
        ) {
            Text(
                text = "${pagerState.currentPage + 1} / ${images.size}",
                modifier = Modifier
                    .padding(8.dp),
                color = Color.White,
                fontFamily = suit,
                fontWeight = FontWeight.SemiBold
            )
        }
    }
}