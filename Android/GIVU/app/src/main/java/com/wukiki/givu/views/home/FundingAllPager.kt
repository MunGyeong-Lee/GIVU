package com.wukiki.givu.views.home

import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.wrapContentHeight
import androidx.compose.foundation.pager.HorizontalPager
import androidx.compose.foundation.pager.rememberPagerState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.ScrollableTabRow
import androidx.compose.material3.Tab
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.wukiki.domain.model.Funding
import com.wukiki.givu.R
import com.wukiki.givu.ui.suit
import kotlinx.coroutines.launch

@Composable
fun FundingAllPager() {
    val categories = listOf(
        Pair("ALL", R.drawable.ic_category_all),
        Pair("생일", R.drawable.ic_category_birth),
        Pair("집들이", R.drawable.ic_category_house),
        Pair("결혼", R.drawable.ic_category_marriage),
        Pair("졸업", R.drawable.ic_category_graduate),
        Pair("취업", R.drawable.ic_category_job),
        Pair("출산", R.drawable.ic_category_child)
    )
    val pagerState = rememberPagerState(
        initialPage = 0,
        initialPageOffsetFraction = 0F,
        pageCount = { categories.size }
    )
    val coroutineScope = rememberCoroutineScope()

    Column(
        modifier = Modifier.fillMaxWidth()
            .wrapContentHeight()
    ) {
        ScrollableTabRow(
            selectedTabIndex = pagerState.currentPage,
            edgePadding = 16.dp,
            containerColor = Color.White,
            contentColor = Color.Black,
            indicator = { }
        ) {
            categories.forEachIndexed { index, category ->
                Tab(
                    selected = pagerState.currentPage == index,
                    onClick = {
                        coroutineScope.launch {
                            pagerState.animateScrollToPage(index)
                        }
                    }
                ) {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        modifier = Modifier.padding(8.dp)
                    ) {
                        Image(
                            painter = painterResource(id = category.second),
                            contentDescription = category.first,
                            modifier = Modifier
                                .size(72.dp)
                                .clip(CircleShape)
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = category.first,
                            fontSize = 20.sp,
                            fontWeight = if (pagerState.currentPage == index) FontWeight.Bold else FontWeight.Normal,
                            fontFamily = suit
                        )
                    }
                }
            }
        }

        // ViewPager
        HorizontalPager(
            state = pagerState,
            modifier = Modifier
                .fillMaxWidth()
                .wrapContentHeight()
        ) { _ ->
            val fundings = listOf(
                Funding(
                    id = "1",
                    userId = "user123",
                    productId = "product456",
                    title = "호날두 축구화 구매",
                    body = "펀딩 내용 설명",
                    description = "설명",
                    category = "sports",
                    categoryName = "스포츠",
                    scope = "public",
                    participantsNumber = "100",
                    fundedAmount = "58,000",
                    status = "liked",
                    image = "https://images.unsplash.com/photo-1522383225653-ed111181a951",
                    image2 = "",
                    image3 = "",
                    createdAt = "2024-03-01",
                    updatedAt = "2024-03-10"
                ),
                Funding(
                    id = "2",
                    userId = "user456",
                    productId = "product789",
                    title = "메시 유니폼 구매",
                    body = "펀딩 내용 설명",
                    description = "설명",
                    category = "sports",
                    categoryName = "스포츠",
                    scope = "public",
                    participantsNumber = "50",
                    fundedAmount = "75,000",
                    status = "not_liked",
                    image = "https://images.unsplash.com/photo-1522383225653-ed111181a951",
                    image2 = "",
                    image3 = "",
                    createdAt = "2024-03-02",
                    updatedAt = "2024-03-12"
                )
            )
            FundingListPager(fundings)
        }
    }
}