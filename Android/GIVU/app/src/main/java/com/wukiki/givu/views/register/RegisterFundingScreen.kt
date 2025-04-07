package com.wukiki.givu.views.register

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.Image
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
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
import androidx.compose.material.Button
import androidx.compose.material.ButtonDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.drawWithContent
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.PathEffect
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.colorResource
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import coil.compose.AsyncImage
import com.wukiki.givu.R
import com.wukiki.givu.ui.pretendard
import com.wukiki.givu.ui.suit
import com.wukiki.givu.util.CommonTopBar
import com.wukiki.givu.util.CommonUtils
import com.wukiki.givu.views.register.viewmodel.RegisterViewModel

@Composable
fun RegisterFundingScreen(
    registerViewModel: RegisterViewModel,
    navController: NavController,
    xmlNavController: NavController
) {
    val registerUiState by registerViewModel.registerUiState.collectAsState()
    val selectedProduct by registerViewModel.selectedProduct.collectAsState()

    Box(modifier = Modifier
        .fillMaxSize()
        .padding(bottom = 16.dp)
    ) {
        Column(Modifier.fillMaxSize()) {
            CommonTopBar(
                "펀딩 생성하기",
                onBackClick = { xmlNavController.popBackStack() },
                onHomeClick = { xmlNavController.navigate(R.id.fragment_home) }
            )

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

                if (selectedProduct == null) {
                    Box(
                        modifier = Modifier
                            .height(240.dp)
                            .fillMaxWidth()
                    ) {
                        Column(
                            modifier = Modifier
                                .fillMaxSize()
                                .clickable(
                                    interactionSource = remember { MutableInteractionSource() },
                                    indication = null,
                                    onClick = {
                                        navController.navigate("SelectPresent")
                                    }
                                ),
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

                        // 점선 박스
                        Box(
                            modifier = Modifier
                                .fillMaxSize()
                                .padding(1.dp)
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

                Spacer(Modifier.height(16.dp))

                selectedProduct?.let {
                    Column {
                        AsyncImage(
                            model = it.image,
                            contentDescription = null,
                            contentScale = ContentScale.FillWidth,
                            modifier = Modifier.clip(shape = RoundedCornerShape(10.dp))
                                .height(240.dp)
                                .fillMaxWidth()
                                .clickable(
                                    interactionSource = remember { MutableInteractionSource() },
                                    indication = null,
                                    onClick = {
                                        navController.navigate("SelectPresent")
                                    }
                                ),
                        )
                        Spacer(Modifier.height(16.dp))
                        Text(
                            text = it.productName,
                            fontFamily = pretendard,
                            fontWeight = FontWeight.SemiBold,
                            fontSize = 22.sp,
                            maxLines = 2,
                            overflow = TextOverflow.Ellipsis
                        )
                        Spacer(Modifier.height(6.dp))
                        Text(
                            text = CommonUtils.makeCommaPrice(it.price.toInt()),
                            fontFamily = pretendard,
                            fontWeight = FontWeight.Medium,
                            fontSize = 19.sp,
                            color = colorResource(R.color.main_secondary)
                        )
                    }
                }
            }
        }

        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(68.dp)
                .align(Alignment.BottomCenter),
        ) {
            Button(
                onClick = {
                    if (registerUiState.isSecondStepButton) navController.navigate("RegisterInputStep2")
                },
                modifier = Modifier
                    .fillMaxSize()
                    .padding(8.dp),
                enabled = registerUiState.isSecondStepButton,
                shape = RoundedCornerShape(5.dp),
                border = BorderStroke(1.dp, Color(0xFFECECEC)),
                colors = ButtonDefaults.buttonColors(if (registerUiState.isSecondStepButton) colorResource(R.color.main_primary) else Color.LightGray),
                elevation = ButtonDefaults.elevation(0.dp)
            ) {
                Text(
                    text = "선물 선택하기",
                    fontFamily = suit,
                    fontWeight = FontWeight.Bold,
                    fontSize = 18.sp,
                    color = if (registerUiState.isSecondStepButton) Color.White else Color.DarkGray
                )
            }
        }
    }
}

@Composable
private fun SelectInfoText() {
    Text(
        text = "상품 이름 표시",
        fontFamily = pretendard,
        fontWeight = FontWeight.SemiBold,
        fontSize = 22.sp,
        maxLines = 2,
        overflow = TextOverflow.Ellipsis
    )
    Spacer(Modifier.height(6.dp))
    Text(
        text = "15,800원",
        fontFamily = pretendard,
        fontWeight = FontWeight.Medium,
        fontSize = 19.sp,
        color = colorResource(R.color.main_secondary)
    )
}
