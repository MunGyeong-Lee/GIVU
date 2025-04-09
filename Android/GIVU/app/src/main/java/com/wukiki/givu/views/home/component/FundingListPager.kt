package com.wukiki.givu.views.home.component

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.wukiki.domain.model.Funding
import com.wukiki.givu.ui.suit

@Composable
fun FundingListPager(
    fundings: List<Funding>,
    navController: NavController
) {
    when (fundings.isEmpty()) {
        true -> {
            Spacer(modifier = Modifier.height(32.dp))
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(56.dp),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = "펀딩이 없습니다.",
                    fontFamily = suit,
                    fontWeight = FontWeight.Bold,
                    fontSize = 20.sp,
                    color = Color.DarkGray
                )
            }
        }

        else -> {
            Column(
                modifier = Modifier.fillMaxWidth()
            ) {
                fundings.forEach { funding ->
                    FundingItem(funding, navController) { }
                }
            }
        }
    }
}