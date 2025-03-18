package com.wukiki.givu.views.register

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.draw.drawWithContent
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.graphics.Canvas
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.PathEffect
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.colorResource
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.wukiki.givu.R
import com.wukiki.givu.ui.suit
import com.wukiki.givu.util.CommonBottomButton
import com.wukiki.givu.util.CommonTopBar

@Composable
fun RegisterFundingScreen() {

    val stroke = Stroke(
        width = 1f,
        pathEffect = PathEffect.dashPathEffect(floatArrayOf(10f, 10f), 0f)
    )

    Box(modifier = Modifier.fillMaxSize()) {
        Column(Modifier.fillMaxSize()) {
            CommonTopBar()

            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(horizontal = 24.dp)
            ) {
                Spacer(Modifier.height(20.dp))
                Text(
                    text = "1단계",
                    fontFamily = suit,
                    fontWeight = FontWeight.SemiBold,
                    fontSize = 20.sp,
                    color = colorResource(R.color.main_secondary)
                )
                Spacer(Modifier.height(12.dp))
                Text(
                    text = "선물 고르기",
                    fontFamily = suit,
                    fontWeight = FontWeight.Bold,
                    fontSize = 24.sp
                )
                Spacer(Modifier.height(8.dp))
                Text(
                    text = "친구들에게 받고 싶은 선물을 골라보세요.",
                    fontFamily = suit,
                    fontWeight = FontWeight.Medium,
                    fontSize = 16.sp
                )

                Spacer(Modifier.height(24.dp))

                Box(
                    modifier = Modifier
                        .height(240.dp)
                        .fillMaxWidth()
                ) {
                    Column(
                        modifier = Modifier.fillMaxSize(),
                        verticalArrangement = Arrangement.Center,
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Image(
                            painter = painterResource(R.drawable.img_present_emoji),
                            contentDescription = null,
                            modifier = Modifier.size(48.dp)
                        )
                        Spacer(Modifier.height(14.dp))
                        Text(
                            text = "선물 고르기",
                            fontFamily = suit,
                            fontWeight = FontWeight.SemiBold,
                            fontSize = 20.sp,
                            color = colorResource(R.color.main_secondary)
                        )
                    }

                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .drawWithContent {
                                drawRoundRect(
                                    color = Color(0xFFFF6F61),
                                    style = Stroke(
                                        width = 1.dp.toPx(),
                                        pathEffect = PathEffect.dashPathEffect(
                                            floatArrayOf(20f, 10f),
                                            0f
                                        )
                                    ),
                                    cornerRadius = CornerRadius(10.dp.toPx())
                                )
                            }
                    )
                }
            }

        }

        CommonBottomButton(
            Modifier
                .fillMaxWidth()
                .height(68.dp)
                .align(Alignment.BottomCenter)
        )
    }
}


@Preview(showBackground = true)
@Composable
private fun Register() {
    RegisterFundingScreen()
}