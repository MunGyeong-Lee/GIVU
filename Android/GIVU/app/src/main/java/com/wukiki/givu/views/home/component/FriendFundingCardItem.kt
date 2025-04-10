package com.wukiki.givu.views.home.component

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
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
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.colorResource
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.wukiki.givu.R
import com.wukiki.givu.ui.pretendard
import com.wukiki.givu.ui.suit
import com.wukiki.givu.util.CommonUtils

@Composable
fun FriendFundingCard(
    name: String,
    category: String,
    title: String,
    price: Int,
    percent: Int,
    imageUrl: String
) {
    Card(
        modifier = Modifier
            .width(250.dp)
            .padding(horizontal = 8.dp, vertical = 16.dp)
            .shadow(
                elevation = 4.dp,
                shape = RoundedCornerShape(10.dp),
                clip = true
            ),
        shape = RoundedCornerShape(10.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
    ) {
        Column(modifier = Modifier.fillMaxWidth()) {

            Box(
                modifier = Modifier
                    .height(190.dp)
                    .background(Color.White)
                    .fillMaxWidth(),
            ) {
                if (imageUrl != "") {
                    AsyncImage(
                        model = imageUrl,
                        contentDescription = null,
                        contentScale = ContentScale.FillWidth,
                    )
                } else {
                    Image(
                        painter = painterResource(R.drawable.ic_logo),
                        contentDescription = null,
                        contentScale = ContentScale.FillWidth
                    )
                }

                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(12.dp),
                    contentAlignment = Alignment.TopEnd
                ) {
                    Image(
                        // 클릭하면 on으로 변경
                        painter = painterResource(R.drawable.ic_like_off),
                        null,
                        modifier = Modifier.size(28.dp)
                    )
                }
            }

            Spacer(Modifier.height(12.dp))

            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp)
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = name,
                        fontFamily = suit,
                        fontWeight = FontWeight.SemiBold,
                        fontSize = 16.sp,
                        color = Color(0xFF888888)

                    )
                    Spacer(Modifier.weight(1f))

                    CategoryTag(category)
                }
                Spacer(Modifier.height(8.dp))

                Text(
                    text = title,
                    fontFamily = suit,
                    fontWeight = FontWeight.Bold,
                    fontSize = 20.sp,
                )
                Spacer(Modifier.height(8.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = CommonUtils.makeCommaPrice(price),
                        fontFamily = pretendard,
                        fontWeight = FontWeight.ExtraBold,
                        fontSize = 16.sp,
                    )
                    Spacer(Modifier.width(8.dp))
                    Text(
                        text = "${percent}% 달성",
                        fontFamily = pretendard,
                        fontWeight = FontWeight.Bold,
                        fontSize = 16.sp,
                        color = colorResource(R.color.main_secondary)
                    )

                }
            }

            Spacer(Modifier.height(16.dp))
        }
    }

}

@Composable
fun CategoryTag(category: String) {
    Box(
        modifier = Modifier
            .height(28.dp)
            .width(52.dp)
            .background(color = Color.LightGray, shape = RoundedCornerShape(8.dp)),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = category,
            fontFamily = suit,
            fontWeight = FontWeight.SemiBold,
            fontSize = 14.sp,
        )

    }
}

@Preview(showBackground = false)
@Composable
private fun PreviewTest() {
//    FriendFundingCard()
}