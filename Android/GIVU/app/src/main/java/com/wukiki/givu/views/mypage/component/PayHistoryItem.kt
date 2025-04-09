package com.wukiki.givu.views.mypage.component

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.wukiki.givu.ui.pretendard
import com.wukiki.givu.ui.suit
import com.wukiki.givu.util.CommonUtils

@Composable
fun PayHistoryItem() {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .height(64.dp)
            .clip(shape = RoundedCornerShape(10.dp))
            .clickable {

            }
            .padding(horizontal = 20.dp, vertical = 8.dp),
    ) {
        Text(
            text = "4.13",
            fontFamily = pretendard,
            fontWeight = FontWeight.SemiBold,
            fontSize = 14.sp,

            color = Color(0xFF888888),

        )
        Spacer(Modifier.width(20.dp))
        Column(
            modifier = Modifier.fillMaxHeight(),
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            Text(
                text = "사용 이름",
                fontFamily = suit,
                fontWeight = FontWeight.Bold,
                fontSize = 17.sp,
            )
            Spacer(Modifier.height(8.dp))
            Text(
                text = "21:08",
                fontFamily = pretendard,
                fontWeight = FontWeight.Normal,
                fontSize = 13.sp,
                color = Color(0xFF888888)
            )
        }
        Spacer(Modifier.weight(1f))
        Column(
            modifier = Modifier.fillMaxHeight(),
            horizontalAlignment = Alignment.End,
            verticalArrangement = Arrangement.Center
        ) {
            Text(
                text = CommonUtils.makeCommaPrice(10000),
                fontFamily = pretendard,
                fontWeight = FontWeight.SemiBold,
                fontSize = 16.sp,

            )
        }
    }
}
