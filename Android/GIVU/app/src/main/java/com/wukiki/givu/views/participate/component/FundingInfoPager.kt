package com.wukiki.givu.views.participate.component

import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.material3.VerticalDivider
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.SubcomposeAsyncImage
import com.wukiki.domain.model.FundingDetail
import com.wukiki.givu.R
import com.wukiki.givu.ui.suit
import com.wukiki.givu.util.CommonUtils.makeCommaPrice
import com.wukiki.givu.util.CommonUtils.makePercentage
import com.wukiki.givu.util.shimmerEffect

@Composable
fun FundingInfoPager(
    funding: FundingDetail
) {
    val categories = mapOf(
        "생일" to R.drawable.ic_category_birthday,
        "집들이" to R.drawable.ic_category_house,
        "결혼" to R.drawable.ic_category_marriage,
        "졸업" to R.drawable.ic_category_graduate,
        "취업" to R.drawable.ic_category_buisness,
        "출산" to R.drawable.ic_category_born,
    )

    Row(
        modifier = Modifier.fillMaxWidth(),
        verticalAlignment = Alignment.CenterVertically
    ) {
        if (funding.images.isNotEmpty()) {
            SubcomposeAsyncImage(
                model = funding.images[0],
                contentDescription = "펀딩 이미지",
                contentScale = ContentScale.FillBounds,
                modifier = Modifier.size(100.dp),
                loading = {
                    Box(
                        modifier = Modifier
                            .matchParentSize()
                            .clip(RoundedCornerShape(10.dp))
                            .shimmerEffect()
                    )
                },
                error = {
                    Image(
                        painter = painterResource(id = R.drawable.ic_logo),
                        contentDescription = "Error",
                        modifier = Modifier
                            .clip(RoundedCornerShape(10.dp))
                            .size(24.dp)
                    )
                }
            )
        } else {
            Image(
                painter = painterResource(id = R.drawable.ic_logo),
                contentDescription = "Error",
                modifier = Modifier
                    .clip(RoundedCornerShape(10.dp))
                    .size(100.dp)
            )
        }
        Spacer(modifier = Modifier.width(16.dp))
        Column {
            Row(
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    painterResource(id = categories[funding.category] ?: R.drawable.ic_category_birthday),
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

                VerticalDivider(
                    modifier = Modifier
                        .height(16.dp)
                        .width(1.dp),
                    color = Color.Gray
                )
                Spacer(modifier = Modifier.width(4.dp))
                Text(
                    modifier = Modifier.weight(1F),
                    text = funding.writerNickname,
                    fontWeight = FontWeight.Medium,
                    fontFamily = suit,
                    color = Color.Gray,
                    fontSize = 14.sp
                )
            }
            Spacer(modifier = Modifier.width(4.dp))
            Text(
                text = funding.title,
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                fontFamily = suit,
                color = Color.Black
            )
            Spacer(modifier = Modifier.width(4.dp))
            Row {
                Text(
                    text = makeCommaPrice(funding.productPrice.toInt()),
                    fontSize = 18.sp,
                    color = Color.Red,
                    fontWeight = FontWeight.SemiBold,
                    fontFamily = suit
                )
                Spacer(modifier = Modifier.width(4.dp))
                Text(
                    text = "${makePercentage(funding.fundedAmount, funding.productPrice.toInt())}%",
                    fontSize = 18.sp,
                    color = Color.Red,
                    fontWeight = FontWeight.Bold,
                    fontFamily = suit
                )
            }
        }
    }
}