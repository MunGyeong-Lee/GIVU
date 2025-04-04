package com.wukiki.givu.views.mypage.component

import android.os.Bundle
import androidx.compose.foundation.Image
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
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
import com.wukiki.givu.views.home.component.CategoryTagItem
import com.wukiki.givu.views.home.component.LetterCountItem

@Composable
fun MyRegisterFundingCardItem(
    funding: Funding,
    navController: NavController
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 8.dp, vertical = 16.dp)
            .shadow(6.dp, RoundedCornerShape(10.dp), clip = true)
            .clickable {
                val bundle = Bundle().apply {
                    putInt("fundingId", funding.id)
                }
                navController.navigate(R.id.action_my_page_to_detail_funding, bundle)
            },
        colors = CardDefaults.cardColors(containerColor = Color.White)
    ) {
        Column {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(180.dp)
            ) {
                SubcomposeAsyncImage(
                    model = if (funding.images.isNotEmpty()) funding.images[0] else "",
                    contentDescription = "Funding Image",
                    contentScale = ContentScale.Crop,
                    modifier = Modifier.fillMaxSize(),
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

                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(12.dp),
                    contentAlignment = Alignment.TopEnd
                ) {
                    Image(
                        painter = painterResource(R.drawable.ic_like_off),
                        null,
                        modifier = Modifier.size(28.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            Row(
                modifier = Modifier.padding(horizontal = 12.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                SubcomposeAsyncImage(
                    model = funding.userProfile,
                    contentDescription = "Profile Image",
                    contentScale = ContentScale.Crop,
                    modifier = Modifier
                        .size(36.dp)
                        .clip(CircleShape)
                )

                Spacer(modifier = Modifier.width(8.dp))

                Text(
                    text = funding.userNickname,
                    fontSize = 16.sp,
                    fontWeight = FontWeight.SemiBold,
                    fontFamily = suit,
                    modifier = Modifier.weight(1F)
                )

                CategoryTagItem(funding.category)
            }

            Spacer(modifier = Modifier.height(6.dp))

            Column(modifier = Modifier.padding(horizontal = 12.dp)) {
                Text(
                    text = funding.title,
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    fontFamily = suit,
                    maxLines = 2,
                    minLines = 2
                )

                Spacer(modifier = Modifier.height(4.dp))

                Row(
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = CommonUtils.makeCommaPrice(funding.productPrice.toInt()),
                        fontSize = 16.sp,
                        fontWeight = FontWeight.ExtraBold,
                        color = Color.Black,
                        fontFamily = suit
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "${makePercentage(funding.fundedAmount, funding.productPrice.toInt())}% 달성",
                        fontSize = 16.sp,
                        color = Color.Red,
                        fontWeight = FontWeight.Bold,
                        fontFamily = suit
                    )

                    LetterCountItem(funding.participantsNumber)
                }
            }

            Spacer(modifier = Modifier.height(8.dp))
        }
    }
}