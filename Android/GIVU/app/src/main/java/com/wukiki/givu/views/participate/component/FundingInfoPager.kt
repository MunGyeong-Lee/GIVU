package com.wukiki.givu.views.participate.component

import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.material3.VerticalDivider
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.rememberAsyncImagePainter
import com.wukiki.domain.model.Funding
import com.wukiki.givu.R
import com.wukiki.givu.ui.suit

@Composable
fun FundingInfoPager(funding: Funding) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Image(
            painter = rememberAsyncImagePainter(funding.images[0]),
            contentDescription = "펀딩 이미지",
            modifier = Modifier.size(100.dp)
        )
        Spacer(modifier = Modifier.width(16.dp))
        Column {
            Row(
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    painterResource(id = R.drawable.ic_category_birthday),
                    contentDescription = "카테고리",
                    tint = Color.Gray,
                    modifier = Modifier.size(20.dp)
                )
                Spacer(modifier = Modifier.width(4.dp))
                Text(
                    text = funding.category,
                    fontWeight = FontWeight.Medium,
                    fontFamily = suit,
                    color = Color.Gray,
                    fontSize = 14.sp
                )
                Spacer(modifier = Modifier.width(4.dp))
                // 구분선 작동이 안 됨
                VerticalDivider(
                    modifier = Modifier.fillMaxHeight(),
                    color = Color.Gray,
                    thickness = 2.dp
                )
                Spacer(modifier = Modifier.width(4.dp))
                Text(
                    modifier = Modifier.weight(1F),
                    text = funding.userId,
                    fontWeight = FontWeight.Medium,
                    fontFamily = suit,
                    color = Color.Gray,
                    fontSize = 14.sp
                )
            }
            Text(
                text = "푸딩 먹고싶다",
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                fontFamily = suit,
                color = Color.Black
            )
            Row {
                Text(
                    text = "10,000원",
                    fontSize = 18.sp,
                    color = Color.Red,
                    fontWeight = FontWeight.SemiBold,
                    fontFamily = suit
                )
                Spacer(modifier = Modifier.width(4.dp))
                Text(
                    text = "12%",
                    fontSize = 18.sp,
                    color = Color.Red,
                    fontWeight = FontWeight.Bold,
                    fontFamily = suit
                )
            }
        }
    }
}