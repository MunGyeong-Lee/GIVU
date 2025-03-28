package com.wukiki.givu.views.mall.component

import androidx.compose.foundation.Image
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
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
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
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.wukiki.givu.R
import com.wukiki.givu.ui.pretendard
import com.wukiki.givu.ui.suit

@Composable
fun MallItemPopular() {
    Card(
        modifier = Modifier
            .width(200.dp)
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

            Image(
                painter = painterResource(R.drawable.test_img_doll),
                contentDescription = null,
                modifier = Modifier
                    .fillMaxWidth()
                    .aspectRatio(5f / 4f),
                contentScale = ContentScale.Crop
            )


            Spacer(Modifier.height(8.dp))

            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 8.dp)
            ) {

                Text(
                    text = "[카이스트특허기술] 그래비티 헤어리프팅 샴푸 엑스트라 버진",
                    fontFamily = suit,
                    fontWeight = FontWeight.SemiBold,
                    fontSize = 16.sp,
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis
                )

                Spacer(Modifier.height(8.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    BestItemTag()
                    NewItemTag()
                }

                Spacer(Modifier.height(8.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "10,000원",
                        fontFamily = pretendard,
                        fontWeight = FontWeight.ExtraBold,
                        fontSize = 17.sp,
                    )

                    Spacer(Modifier.weight(1f))
                    Icon(
                        painter = painterResource(R.drawable.ic_star_best),
                        contentDescription = null,
                        modifier = Modifier
//                            .padding( end = 2.dp)
                            .size(28.dp),
                        tint = colorResource(R.color.main_secondary)
                    )
                    Text(
                        text = "4.9",
                        fontFamily = pretendard,
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Normal
                    )
                }

                Spacer(Modifier.height(8.dp))

                Row(verticalAlignment = Alignment.CenterVertically) {
//                    Icon(
//                        painter = painterResource(R.drawable.ic_star_best),
//                        contentDescription = null,
//                        modifier = Modifier
////                            .padding( end = 2.dp)
//                            .size(28.dp),
//                        tint = colorResource(R.color.main_secondary)
//                    )
//                    Text(
//                        text = "4.9",
//                        fontFamily = pretendard,
//                        fontSize = 14.sp,
//                        fontWeight = FontWeight.Normal
//                    )

                }
            }

        }
    }

}

@Composable
private fun BestItemTag() {
    Row(
        modifier = Modifier
            .height(28.dp)
//            .width(88.dp)
            .background(
                color = Color(0xFFFFE100),
                shape = RoundedCornerShape(8.dp)
            ),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.Center
    ) {
        Image(
            painter = painterResource(R.drawable.ic_star_best),
            contentDescription = null,
            modifier = Modifier.padding(start = 8.dp, end = 2.dp)
        )
        Text(
            text = "BEST",
            fontFamily = suit,
            fontWeight = FontWeight.Bold,
            fontSize = 14.sp,
            color = Color.White
        )
        Spacer(Modifier.width(12.dp))

    }
}

@Composable
private fun NewItemTag() {
    Row(
        modifier = Modifier
            .height(28.dp)
//            .width(88.dp)
            .background(
                color = Color(0xFF00B2FF),
                shape = RoundedCornerShape(8.dp)
            ),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.Center
    ) {
        Image(
            painter = painterResource(R.drawable.ic_new_item),
            contentDescription = null,
            modifier = Modifier.padding(start = 8.dp, end = 2.dp)
        )
        Text(
            text = "NEW",
            fontFamily = suit,
            fontWeight = FontWeight.Bold,
            fontSize = 14.sp,
            color = Color.White
        )
        Spacer(Modifier.width(12.dp))

    }
}


@Preview(showBackground = true)
@Composable
private fun PreviewMallItem() {
    MallItemPopular()

//    NewItemTag()
}