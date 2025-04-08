package com.wukiki.givu.views.mypage

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.wukiki.givu.ui.suit
import com.wukiki.givu.views.home.viewmodel.HomeViewModel
import com.wukiki.givu.views.mypage.component.MyFundingReviewCardItem

@Composable
fun MyFundingReviewScreen(
    homeViewModel: HomeViewModel,
    xmlNavController: NavController
) {
    val reviews by homeViewModel.myFundingReviews.collectAsState()

    Scaffold(
        containerColor = Color(0xFFF3F4F6)
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .padding(paddingValues)
                .fillMaxSize()
                .padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Row {
                Text(
                    text = "내가 찜한 상품",
                    fontFamily = suit,
                    fontWeight = FontWeight.Bold,
                    fontSize = 22.sp
                )
                Spacer(modifier = Modifier.weight(1F))
            }

            Spacer(modifier = Modifier.height(16.dp))

            when (reviews.isEmpty()) {
                true -> {
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(paddingValues),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = "작성한 후기가 없습니다.",
                            fontFamily = suit,
                            fontWeight = FontWeight.Bold,
                            fontSize = 20.sp,
                            color = Color.DarkGray
                        )
                    }
                }

                else -> {
                    LazyColumn (
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        items(reviews, key = { it.reviewId }) { review ->
                            MyFundingReviewCardItem(review, xmlNavController)
                        }

                        item {
                            Spacer(modifier = Modifier.height(16.dp))
                        }
                    }
                }
            }
        }
    }
}