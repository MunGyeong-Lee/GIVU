package com.wukiki.givu.views.detail.component

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Icon
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
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
import com.wukiki.givu.util.ReportButton

@Composable
fun FundingInfoItem(funding: Funding) {
    Column(
        modifier = Modifier.padding(16.dp)
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                painterResource(id = R.drawable.ic_category_birthday),
                contentDescription = "카테고리",
                tint = Color.Gray
            )
            Spacer(modifier = Modifier.width(4.dp))
            Text(
                modifier = Modifier.weight(1F),
                text = funding.category,
                fontWeight = FontWeight.Bold,
                fontFamily = suit,
                color = Color.Gray,
                fontSize = 16.sp
            )
            ReportButton {  }
        }

        Spacer(modifier = Modifier.height(8.dp))

        Text(
            text = funding.title,
            fontSize = 24.sp,
            fontWeight = FontWeight.Bold,
            fontFamily = suit
        )

        Text(
            text = funding.userId,
            fontSize = 16.sp,
            color = Color.Gray,
            fontFamily = suit,
            fontWeight = FontWeight.Medium
        )

        Spacer(modifier = Modifier.height(12.dp))

        // 모금 진행률
        Text(
            text = "모인 금액",
            fontSize = 14.sp,
            fontFamily = suit,
            fontWeight = FontWeight.SemiBold
        )
        Spacer(modifier = Modifier.height(4.dp))
        Text(
            text = funding.fundedAmount,
            fontSize = 20.sp,
            fontFamily = suit,
            fontWeight = FontWeight.SemiBold
        )

        Spacer(modifier = Modifier.height(4.dp))
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(24.dp) // ✅ 원이 커지지 않도록 높이 조정
                .clip(RoundedCornerShape(15.dp)) // ✅ 둥근 테두리 적용
                .background(Color.LightGray) // ✅ 배경색 적용
        ) {
            Box(
                modifier = Modifier
                    .fillMaxWidth(12F / 100F) // ✅ 현재 진행도 만큼 길이 설정
                    .height(24.dp) // ✅ 동일한 높이 유지
                    .clip(RoundedCornerShape(15.dp)) // ✅ 모서리 둥글게
                    .background(Color.Red) // ✅ 진행 색상 적용
            )
        }

        Spacer(modifier = Modifier.height(4.dp))
        Text(
            text = "${funding.participantsNumber}명이 참여했습니다.",
            fontSize = 15.sp,
            fontFamily = suit,
            fontWeight = FontWeight.SemiBold
        )
    }
}