package com.wukiki.givu.views.participate.component

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.wukiki.givu.ui.suit
import com.wukiki.givu.util.CommonUtils.makeCommaPrice
import com.wukiki.givu.views.detail.viewmodel.FundingViewModel

@Composable
fun PaymentBalancePager(
    fundingViewModel: FundingViewModel
) {
    val user by fundingViewModel.user.collectAsState()

    Column(
        modifier = Modifier.fillMaxWidth()
    ) {
        Spacer(modifier = Modifier.height(8.dp))

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Text(
                modifier = Modifier.weight(1F),
                text = "GIVU Pay 잔액",
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                fontFamily = suit,
                color = Color.Black
            )
            Text(
                text = "충전하기 >",
                fontSize = 14.sp,
                color = Color.Gray,
                fontWeight = FontWeight.Medium,
                fontFamily = suit
            )
        }

        Spacer(modifier = Modifier.height(8.dp))

        Text(
            text = makeCommaPrice((user?.balance ?: "0").toInt()),
            fontSize = 16.sp,
            fontWeight = FontWeight.SemiBold,
            fontFamily = suit,
            color = Color.Black
        )

        Spacer(modifier = Modifier.height(96.dp))

        HorizontalDivider()
    }
}