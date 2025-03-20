package com.wukiki.givu.views.detail.component

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.material3.Icon
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.wukiki.domain.model.Funding
import com.wukiki.givu.R

@Composable
fun FundingInfoItem(funding: Funding) {
    Column(modifier = Modifier.padding(16.dp)) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Icon(painterResource(id = R.drawable.ic_category_birthday), contentDescription = "카테고리")
            Spacer(modifier = Modifier.width(4.dp))
            Text(text = funding.category, fontWeight = FontWeight.Bold)
        }

        Spacer(modifier = Modifier.height(8.dp))

        // 제목
        Text(
            text = funding.title,
            fontSize = 20.sp,
            fontWeight = FontWeight.Bold
        )

        // 닉네임
        Text(
            text = funding.userId,
            fontSize = 16.sp,
            color = Color.Gray
        )

        Spacer(modifier = Modifier.height(12.dp))

        // 모금 진행률
        Text(text = "모인 금액")
        Text(text = funding.fundedAmount, fontSize = 18.sp, fontWeight = FontWeight.Bold)
        Text(text = "${funding.fundedAmount}%", color = Color.Red)

        // Progress Bar
        LinearProgressIndicator(
            progress = { funding.fundedAmount.toFloat() / 100F },
            modifier = Modifier.fillMaxWidth(),
        )

        // 참여자 정보
        Text(
            text = "${funding.participantsNumber}명이 참여했습니다.",
            fontSize = 14.sp,
            color = Color.Gray
        )
    }
}