package com.wukiki.givu.views.home

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.wrapContentHeight
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
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
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.SubcomposeAsyncImage
import com.wukiki.domain.model.Funding
import com.wukiki.givu.R
import com.wukiki.givu.ui.suit

@Composable
fun FundingItem(
    funding: Funding,
    onLikeClick: () -> Unit
) {
    Card(
        modifier = Modifier.wrapContentHeight(),
        colors = CardDefaults.cardColors(containerColor = Color.White)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // 이미지 (왼쪽)
            SubcomposeAsyncImage(
                model = funding.image,
                contentDescription = "Funding Image",
                contentScale = ContentScale.Crop,
                loading = { CircularProgressIndicator() },
                modifier = Modifier
                    .width(180.dp) // 이미지 크기
                    .aspectRatio(3F / 2F)
                    .clip(RoundedCornerShape(15.dp))
            )

            Spacer(modifier = Modifier.width(8.dp))

            // 텍스트 & 좋아요 버튼 (오른쪽)
            Column(
                modifier = Modifier.fillMaxWidth(),
                verticalArrangement = Arrangement.SpaceBetween
            ) {
                Text(
                    text = funding.title,
                    fontSize = 18.sp,
                    fontWeight = FontWeight.SemiBold,
                    fontFamily = suit,
                    color = Color.Black,
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis
                )

                Spacer(modifier = Modifier.height(4.dp))

                Text(
                    text = funding.id,
                    fontSize = 16.sp,
                    fontWeight = FontWeight.SemiBold,
                    fontFamily = suit,
                    color = Color.Gray
                )

                Spacer(modifier = Modifier.height(4.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.Start
                ) {
                    Text(
                        text = funding.fundedAmount,
                        fontSize = 16.sp,
                        fontWeight = FontWeight.SemiBold,
                        fontFamily = suit,
                        color = Color.Black
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = "58%",
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Medium,
                        fontFamily = suit,
                        color = Color.Red
                    )
                }

                Spacer(modifier = Modifier.height(4.dp))

                Row {
                    Icon(
                        painter = painterResource(R.drawable.ic_like_on),
                        contentDescription = "Like Button",
                        tint = Color.Red,
                        modifier = Modifier
                            .size(24.dp)
                            .clickable { onLikeClick() }
                    )

                    Spacer(modifier = Modifier.width(4.dp))

                    Text(
                        text = "99+",
                        fontSize = 16.sp,
                        fontWeight = FontWeight.SemiBold,
                        fontFamily = suit,
                        color = Color.Black
                    )
                }
            }
        }
    }
}

@Preview(showBackground = true)
@Composable
fun PreviewFundingItem() {
    FundingItem(
        funding = Funding(
            id = "1",
            userId = "user123",
            productId = "product456",
            title = "호날두 축구화 구매",
            body = "펀딩 내용 설명",
            description = "설명",
            category = "sports",
            categoryName = "스포츠",
            scope = "public",
            participantsNumber = "100",
            fundedAmount = "58,000",
            status = "liked",
            image = "https://images.unsplash.com/photo-1522383225653-ed111181a951",
            image2 = "",
            image3 = "",
            createdAt = "2024-03-01",
            updatedAt = "2024-03-10"
        ),
        onLikeClick = {}
    )
}