package com.wukiki.givu.views.mypage

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
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
import androidx.compose.foundation.layout.wrapContentHeight
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.Divider
import androidx.compose.material3.Icon
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.colorResource
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.wukiki.givu.R
import com.wukiki.givu.ui.lusitana
import com.wukiki.givu.ui.pretendard
import com.wukiki.givu.ui.suit
import com.wukiki.givu.util.CommonUtils

@Composable
fun MyPageScreen() {

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF3F4F6))
    ) {
        MyPageTopBar()
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(top = 60.dp)
                .verticalScroll(rememberScrollState())
        ) {

            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 8.dp, vertical = 16.dp)
                    .wrapContentHeight()
                    .background(color = Color.White, shape = RoundedCornerShape(20.dp))
                    .clip(shape = RoundedCornerShape(20.dp))
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(96.dp)
                        .padding(8.dp)
                        .clip(shape = RoundedCornerShape(10.dp))
                        .clickable {

                        },
                    verticalAlignment = Alignment.CenterVertically,

                    ) {
                    Image(
                        painter = painterResource(R.drawable.ic_profile_default),
                        contentDescription = null,
                        modifier = Modifier
                            .padding(start = 16.dp)
                            .size(60.dp)
                    )
                    Spacer(Modifier.width(16.dp))

                    Text(
                        text = "사용자 이름",
                        fontFamily = suit,
                        fontWeight = FontWeight.Bold,
                        fontSize = 20.sp
                    )


                }

                Divider(color = Color(0xFFEFEFEF))

                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(72.dp)
                        .padding(8.dp)
                        .clip(shape = RoundedCornerShape(10.dp))
                        .clickable {

                        },
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    Spacer(Modifier.width(16.dp))

                    Text(
                        text = "GIVU pay",
                        fontFamily = lusitana,
                        fontWeight = FontWeight.Bold,
                        fontSize = 17.sp,
                        color = colorResource(R.color.main_primary)
                    )

                    Spacer(Modifier.width(24.dp))

                    Text(
                        text = CommonUtils.makeCommaPrice(700000),
                        fontFamily = pretendard,
                        fontWeight = FontWeight.Bold,
                        fontSize = 24.sp,
                    )
                    Spacer(Modifier.width(8.dp))
                    Icon(
                        painter = painterResource(R.drawable.ic_arrow_forward),
                        contentDescription = null,
                        tint = Color(0xFF8D8686),
                        modifier = Modifier.size(18.dp)
                    )
                }

                Row(modifier = Modifier.fillMaxWidth()) {
                    Spacer(Modifier.width(24.dp))
                    Box(
                        modifier = Modifier
                            .height(52.dp)
                            .weight(1f)
                            .background(
                                color = Color(0xFFE8ECEF),
                                shape = RoundedCornerShape(10.dp)
                            )
                            .clip(shape = RoundedCornerShape(10.dp)),
                        contentAlignment = Alignment.Center

                    ) {
                        Text(
                            text = "충전",
                            fontFamily = suit,
                            fontWeight = FontWeight.ExtraBold,
                            fontSize = 22.sp
                        )
                    }

                    Spacer(Modifier.width(12.dp))

                    Box(
                        modifier = Modifier
                            .height(52.dp)
                            .weight(1f)
                            .background(
                                color = Color(0xFFE8ECEF),
                                shape = RoundedCornerShape(10.dp)
                            )
                            .clip(shape = RoundedCornerShape(10.dp)),
                        contentAlignment = Alignment.Center

                    ) {
                        Text(
                            text = "송금",
                            fontFamily = suit,
                            fontWeight = FontWeight.ExtraBold,
                            fontSize = 22.sp
                        )
                    }
                    Spacer(Modifier.width(24.dp))
                }

                Spacer(Modifier.height(16.dp))
            }
        }


    }


}

@Composable
private fun MyPageTopBar() {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .height(60.dp)
            .padding(horizontal = 8.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Text(
            text = "My GIVU",
            fontFamily = pretendard,
            fontWeight = FontWeight.Bold,
            fontSize = 22.sp
        )
        Icon(
            painterResource(R.drawable.ic_setting),
            contentDescription = null
        )
    }
}

@Preview(showBackground = true)
@Composable
private fun MypagePreview() {
    MyPageScreen()
}