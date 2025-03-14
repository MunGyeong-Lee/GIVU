package com.wukiki.givu.views.home

import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.wukiki.domain.model.Funding
import com.wukiki.givu.R
import com.wukiki.givu.ui.suit

@Composable
fun HomeScreen() {
    val sampleFundings = listOf(
        Funding(
            id = "1",
            userId = "user123",
            productId = "product456",
            title = "마이화장품한테 화장품 사주세요~",
            body = "펀딩 내용 설명",
            description = "설명",
            category = "beauty",
            categoryName = "뷰티",
            scope = "public",
            participantsNumber = "100",
            fundedAmount = "10,000",
            status = "active",
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
            title = "(제목) 마이화장품한테 화장품 사주세요~",
            body = "펀딩 내용 설명",
            description = "설명",
            category = "wedding",
            categoryName = "결혼",
            scope = "public",
            participantsNumber = "50",
            fundedAmount = "100,000",
            status = "active",
            image = "https://images.unsplash.com/photo-1522383225653-ed111181a951",
            image2 = "",
            image3 = "",
            createdAt = "2024-03-02",
            updatedAt = "2024-03-12"
        )
    )

    LazyColumn(
        modifier = Modifier.fillMaxWidth()
    ) {
        item {
            HomeAppBarPager()
            Spacer(modifier = Modifier.height(4.dp))
            SearchBarItem("웅") { }
        }
        item {
            Spacer(modifier = Modifier.height(16.dp))
            Text(
                text = stringResource(id = R.string.text_popular_funding),
                fontSize = 24.sp,
                fontWeight = FontWeight.Bold,
                fontFamily = suit
            )
            PopularFundingListPager(sampleFundings)
        }
        item {
            Spacer(modifier = Modifier.height(16.dp))
            Text(
                text = stringResource(id = R.string.text_my_friends_funding),
                fontSize = 24.sp,
                fontWeight = FontWeight.Bold,
                fontFamily = suit
            )
            FriendFundingListPager(sampleFundings)
        }
        item {
            Spacer(modifier = Modifier.height(16.dp))
            Text(
                text = stringResource(id = R.string.text_funding_list),
                fontSize = 24.sp,
                fontWeight = FontWeight.Bold,
                fontFamily = suit
            )
            FundingAllPager()
        }
    }
}