package com.wukiki.givu.views.mall.component

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.wrapContentHeight
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import coil.compose.AsyncImage
import com.wukiki.domain.model.Product
import com.wukiki.givu.ui.suit
import com.wukiki.givu.util.CommonUtils.makeCommaPrice
import com.wukiki.givu.views.register.viewmodel.RegisterViewModel

@Composable
fun SearchProductResultCardItem(
    product: Product,
    registerViewModel: RegisterViewModel,
    navController: NavController
) {
    val categories = mapOf(
        "ALL" to "전체",
        "ELECTRONICS" to "전자기기",
        "CLOTHING" to "의류",
        "BEAUTY" to "미용",
        "HOMEAPPLIANCES" to "가전제품",
        "SPORTS" to "스포츠",
        "FOOD" to "음식",
        "TOYS" to "장난감",
        "FURNITURE" to "가구",
        "LIVING" to "생활",
        "OTHERS" to "기타"
    )

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .wrapContentHeight()
            .clickable {
                registerViewModel.selectProductInMall(product)
                navController.navigate("ProductDetailScreen/${product.productId}")
            },
        colors = CardDefaults.cardColors(containerColor = Color.White),
        shape = RoundedCornerShape(16.dp),
        elevation = CardDefaults.cardElevation(defaultElevation = 6.dp)
    ) {
        Column(
            modifier = Modifier.fillMaxWidth()
        ) {
            AsyncImage(
                model = product.image,
                contentDescription = null,
                contentScale = ContentScale.Crop,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(150.dp)
            )

            Column(
                modifier = Modifier.padding(16.dp)
            ) {
                Text(
                    text = product.productName,
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    fontFamily = suit,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )

                Spacer(modifier = Modifier.height(8.dp))

                Box(
                    modifier = Modifier
                        .background(Color.LightGray, shape = RoundedCornerShape(10.dp))
                        .padding(horizontal = 12.dp, vertical = 2.dp)
                ) {
                    val category = categories[product.category]
                    Text(
                        text = category ?: "기타",
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Medium,
                        fontFamily = suit,
                        color = Color.Black
                    )
                }

                Spacer(modifier = Modifier.height(24.dp))

                Row(
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = makeCommaPrice(product.price.toInt()),
                        fontSize = 14.sp,
                        fontFamily = suit,
                        fontWeight = FontWeight.SemiBold
                    )
                    Spacer(modifier = Modifier.weight(1F))
                }
            }
        }
    }
}