package com.wukiki.givu.views.mall

import android.util.Log
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.wrapContentWidth
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.Button
import androidx.compose.material.ButtonDefaults
import androidx.compose.material.Divider
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.colorResource
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import coil.compose.SubcomposeAsyncImage
import com.wukiki.givu.R
import com.wukiki.givu.ui.pretendard
import com.wukiki.givu.ui.suit
import com.wukiki.givu.util.CommonUtils
import com.wukiki.givu.util.StoreDetailBottomButton
import com.wukiki.givu.util.StoreDetailTopBar
import com.wukiki.givu.views.mall.viewmodel.MallViewModel

@Composable
fun ProductDetailScreen(
    productId: String?,
    mallViewModel: MallViewModel
) {
    val productInfo by mallViewModel.selectedProduct.collectAsState()

    LaunchedEffect(productId) {

        productId?.let {
            mallViewModel.getDetailProductInfo(productId)
            Log.d("Mall Detail Screen", "아이디: ${productId}")
            Log.d("Mall Detail Screen", "상품: ${productInfo}")
        }
    }

    productInfo?.let {
        Box(modifier = Modifier
            .fillMaxSize()
//            .padding(bottom = 68.dp)
        ) {

            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(bottom = 68.dp)
                    .verticalScroll(rememberScrollState())
            ) {
                StoreDetailTopBar()

                SubcomposeAsyncImage(
                    model = it.image,
                    contentDescription = null,
                    contentScale = ContentScale.FillWidth,
                    loading = { CircularProgressIndicator() },
                    modifier = Modifier
                        .fillMaxWidth()
                        .aspectRatio(4f / 3f),
                )

                Spacer(Modifier.height(16.dp))
                Column() {
                    Text(
                        text = it.productName,
                        fontFamily = pretendard,
                        fontWeight = FontWeight.Bold,
                        fontSize = 22.sp,
                        maxLines = 2,
                        overflow = TextOverflow.Ellipsis
                    )

                    Spacer(Modifier.height(12.dp))
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            painter = painterResource(R.drawable.ic_star_best),
                            contentDescription = null,
                            tint = Color(0xFFFEBE14),
//                            modifier = Modifier.size(20.dp)
                        )
                        Spacer(Modifier.width(4.dp))
                        Text(
                            text = it.star,
                            fontFamily = pretendard,
                            fontWeight = FontWeight.Bold,
                            fontSize = 16.sp,
                            color = Color(0xFF666666)
                        )
                    }

                    Spacer(Modifier.height(16.dp))
                    Text(
                        text = "판매가",
                        fontFamily = suit,
                        fontWeight = FontWeight.Medium,
                        fontSize = 16.sp,
//                        color = colorResource(R.color.main_secondary)
                    )
                    Spacer(Modifier.height(4.dp))
                    Text(
                        text = CommonUtils.makeCommaPrice(it.price.toInt()),
                        fontFamily = pretendard,
                        fontWeight = FontWeight.SemiBold,
                        fontSize = 20.sp,
//                        color = colorResource(R.color.main_secondary)
                    )

                    Spacer(Modifier.height(24.dp))
                    Divider(
                        modifier = Modifier.fillMaxWidth(),
                        thickness = 10.dp,
                        color = Color(0xFFF2F2F2)
                    )
                    Spacer(Modifier.height(24.dp))
                    Text(
                        text = "상품 정보",
                        fontFamily = suit,
                        fontWeight = FontWeight.SemiBold,
                        fontSize = 20.sp,
//                        color = colorResource(R.color.main_secondary)
                    )
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(top = 12.dp)
                            .clip(shape = RoundedCornerShape(5.dp))
                            .border(1.dp, Color.Black, RoundedCornerShape(5.dp)),
                    ) {
                        Text(
                            text = it.description,
                            fontFamily = suit,
                            fontWeight = FontWeight.Medium,
                            fontSize = 16.sp,
                            modifier = Modifier.padding(12.dp)
//                        color = colorResource(R.color.main_secondary)
                        )
                    }






                    Spacer(Modifier.height(16.dp))
                }

            }



            // 하단 바
            Row(
                modifier =
                Modifier
                    .fillMaxWidth()
                    .height(68.dp)
                    .align(Alignment.BottomCenter)
//                    .background(Color.LightGray)
                ,
                verticalAlignment = Alignment.CenterVertically
            ) {

                Column(
                    modifier = Modifier
                        .fillMaxWidth(0.15f)
                        .fillMaxHeight(),
                    verticalArrangement = Arrangement.Center,
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    IconButton(
                        onClick = {},
                        modifier = Modifier.size(24.dp)
                    ) {
                        Icon(
                            painter = painterResource(R.drawable.ic_heart_outline), null,
                            modifier = Modifier.fillMaxSize()
                        )
                    }
                    Spacer(Modifier.height(4.dp))
                    Text(
                        text = "123",
                        fontFamily = pretendard,
                        fontWeight = FontWeight.Medium,
                        fontSize = 14.sp

                    )
                }

                Row(modifier = Modifier.fillMaxWidth()) {
                    Button(
                        onClick = {
                            // 펀딩 생성 화면으로 이동

                        },
                        modifier = Modifier
                            .weight(1f)
                            .height(48.dp),
                        enabled = true,
                        shape = RoundedCornerShape(5.dp),
                        border = BorderStroke(1.dp, Color(0xFFECECEC)),
                        colors = ButtonDefaults.buttonColors(colorResource(R.color.main_primary)),
                        elevation = ButtonDefaults.elevation(0.dp)
                    ) {
                        Text(
                            text = "펀딩 생성하기",
                            fontFamily = suit,
                            fontWeight = FontWeight.Bold,
                            fontSize = 18.sp,
                            color = Color.White
                        )
                    }
                    Spacer(Modifier.width(8.dp))
                    Button(
                        onClick = {
                            // 구매로 이동

                        },
                        modifier = Modifier
                            .weight(1f)
                            .height(48.dp),
                        enabled = true,
                        shape = RoundedCornerShape(5.dp),
                        border = BorderStroke(1.dp, colorResource(R.color.main_primary)),
                        colors = ButtonDefaults.buttonColors(Color.White),
                        elevation = ButtonDefaults.elevation(0.dp)
                    ) {
                        Text(
                            text = "구매하기",
                            fontFamily = suit,
                            fontWeight = FontWeight.Bold,
                            fontSize = 18.sp,
                            color = colorResource(R.color.main_primary)
                        )
                    }
                }

            }

        }
    }
}


@Preview(showBackground = true)
@Composable
private fun pdetail() {
//    ProductDetailScreen()
}