package com.wukiki.givu.views.participate.component

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.wukiki.givu.ui.suit

@Composable
fun ParticipantInfoPager() {
    Column {
        Text(
            text = "참여자 정보",
            fontSize = 20.sp,
            fontWeight = FontWeight.Bold,
            fontFamily = suit,
            color = Color.Black
        )
        Spacer(modifier = Modifier.height(8.dp))

        Row {
            Text(
                text = "이름",
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                fontFamily = suit,
                color = Color.Black
            )
            Spacer(modifier = Modifier.width(16.dp))
            Text(
                text = "김싸피",
                fontSize = 18.sp,
                fontWeight = FontWeight.Medium,
                fontFamily = suit,
                color = Color.Gray
            )
        }
        Spacer(modifier = Modifier.height(4.dp))
        Row {
            Text(
                text = "이메일",
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                fontFamily = suit,
                color = Color.Black
            )
            Spacer(modifier = Modifier.width(8.dp))
            Text(
                text = "kimssafy@ssafy.com",
                fontSize = 18.sp,
                fontWeight = FontWeight.Medium,
                fontFamily = suit,
                color = Color.Gray
            )
        }
        Spacer(modifier = Modifier.height(4.dp))
        Row {
            Text(
                text = "연락처",
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                fontFamily = suit,
                color = Color.Black
            )
            Spacer(modifier = Modifier.width(8.dp))
            Text(
                text = "010-0000-0000",
                fontSize = 18.sp,
                fontWeight = FontWeight.Medium,
                fontFamily = suit,
                color = Color.Gray
            )
        }
    }
}