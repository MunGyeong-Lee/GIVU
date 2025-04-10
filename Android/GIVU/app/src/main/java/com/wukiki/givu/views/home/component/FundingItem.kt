package com.wukiki.givu.views.home.component

import android.os.Bundle
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
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
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import coil.compose.SubcomposeAsyncImage
import com.wukiki.domain.model.Funding
import com.wukiki.givu.R
import com.wukiki.givu.ui.suit
import com.wukiki.givu.util.CommonUtils
import com.wukiki.givu.util.CommonUtils.makePercentage
import com.wukiki.givu.util.shimmerEffect

@Composable
fun FundingItem(
    funding: Funding,
    navController: NavController,
    onLikeClick: () -> Unit
) {
    Box(
        modifier = Modifier
            .wrapContentHeight()
            .padding(vertical = 4.dp, horizontal = 8.dp)
    ) {
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .clickable {
                    if (!funding.hidden) {
                        val bundle = Bundle().apply {
                            putInt("fundingId", funding.id)
                        }
                        navController.navigate(R.id.action_home_to_detail_funding, bundle)
                    }
                },
            colors = CardDefaults.cardColors(containerColor = Color.White),
            shape = RoundedCornerShape(12.dp),
            elevation = CardDefaults.cardElevation(4.dp)
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                // 이미지
                SubcomposeAsyncImage(
                    model = if (funding.images.isNotEmpty()) funding.images[0] else "",
                    contentDescription = "Funding Image",
                    contentScale = ContentScale.Crop,
                    modifier = Modifier
                        .width(180.dp)
                        .aspectRatio(3f / 2f)
                        .clip(RoundedCornerShape(15.dp)),
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

                Spacer(modifier = Modifier.width(8.dp))

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
                        text = funding.userNickname,
                        fontSize = 16.sp,
                        fontWeight = FontWeight.SemiBold,
                        fontFamily = suit,
                        color = Color.Gray
                    )

                    Spacer(modifier = Modifier.height(4.dp))

                    Row {
                        Text(
                            text = CommonUtils.makeCommaPrice(funding.productPrice.toInt()),
                            fontSize = 16.sp,
                            fontWeight = FontWeight.SemiBold,
                            fontFamily = suit,
                            color = Color.Black
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = "${makePercentage(funding.fundedAmount, funding.productPrice.toInt())}%",
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
                            text = funding.participantsNumber,
                            fontSize = 16.sp,
                            fontWeight = FontWeight.SemiBold,
                            fontFamily = suit,
                            color = Color.Black
                        )
                    }
                }
            }
        }

        if (funding.hidden) {
            Box(
                modifier = Modifier
                    .matchParentSize()
                    .clip(RoundedCornerShape(12.dp))
                    .background(Color.Black.copy(alpha = 0.6f)),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = "조회 불가능한 펀딩입니다.",
                    color = Color.White,
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold,
                    fontFamily = suit
                )
            }
        }
    }
}