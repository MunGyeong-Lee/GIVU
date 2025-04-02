package com.wukiki.givu.views.mall.component

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.wukiki.givu.R
import com.wukiki.givu.ui.pretendard
import com.wukiki.givu.ui.suit

@Composable
fun ReviewComponent() {

    Column(modifier = Modifier.fillMaxWidth()) {

        Row(
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .size(44.dp)
                    .background(
                        color = Color.Gray, shape = CircleShape
                    ),
                contentAlignment = Alignment.Center
            ) {
                AsyncImage(
                    model = "data:image/png;base64,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",
                    contentDescription = null,
                    contentScale = ContentScale.Crop,
                    modifier = Modifier
                        .clip(CircleShape)
                        .fillMaxSize(),
//                    placeholder = painterResource(R.drawable.img_default_profile), // 로딩 중 이미지
                    error = painterResource(R.drawable.ic_classification_house), // 실패 이미지

                )
            }

            Spacer(Modifier.width(8.dp))

            Text(
                text = "닉네임",
                fontFamily = suit,
                fontWeight = FontWeight.Bold,
                fontSize = 15.sp,
            )
            Spacer(Modifier.width(12.dp))
            Text(
                text = "2022.09.27",
                fontFamily = pretendard,
                fontWeight = FontWeight.Medium,
                fontSize = 14.sp,
                color = Color(0xFFBCBCBC)
            )
            Row(
                modifier = Modifier.padding(start = 44.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    painter = painterResource(R.drawable.ic_star_best),
                    contentDescription = null,
                    tint = Color(0xFFFEBE14),
                    modifier = Modifier.size(22.dp)
                )
                Text(
                    text = "4.0",
                    fontFamily = pretendard,
                    fontWeight = FontWeight.Bold,
                    fontSize = 14.sp,
                    color = Color(0xFF666666)
                )
            }
        }



        Spacer(Modifier.height(16.dp))
        Text(
            text = "리뷰 제목입니다.",
            fontFamily = pretendard,
            fontWeight = FontWeight.SemiBold,
            fontSize = 16.sp,
        )

        Spacer(Modifier.height(12.dp))
        Text(
            text = " 리뷰 내용.  리뷰 내용.  리뷰 내용.  리뷰 내용.  리뷰 내용.  리뷰 내용. ",
            fontFamily = pretendard,
            fontWeight = FontWeight.Medium,
            fontSize = 14.sp,
            maxLines = 5,
            modifier = Modifier.fillMaxWidth()
        )
        Spacer(Modifier.height(12.dp))
        AsyncImage(
            model = "",
            contentDescription = null,
            contentScale = ContentScale.Crop,
            modifier = Modifier.size(100.dp),
            //                    placeholder = painterResource(R.drawable.img_default_profile), // 로딩 중 이미지
            error = painterResource(R.drawable.ic_classification_house), // 실패 이미지

        )
        Spacer(Modifier.height(12.dp))

    }
}


@Preview(showBackground = true)
@Composable
private fun review() {
    ReviewComponent()
}