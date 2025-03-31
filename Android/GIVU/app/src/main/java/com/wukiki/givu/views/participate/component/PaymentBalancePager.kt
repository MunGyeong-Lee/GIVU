package com.wukiki.givu.views.participate.component

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.width
import androidx.compose.material.Divider
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.wukiki.givu.ui.suit

@Composable
fun PaymentBalancePager() {
    Column(
        modifier = Modifier.fillMaxWidth()
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Text(
                modifier = Modifier.weight(1F),
                text = "기뷰페이 잔액",
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
            text = "1,000원",
            fontSize = 16.sp,
            fontWeight = FontWeight.SemiBold,
            fontFamily = suit,
            color = Color.Black
        )
        Spacer(modifier = Modifier.height(96.dp))
        Divider()
    }
}