package com.wukiki.givu.views.mall

import android.util.Log
import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.wukiki.givu.ui.suit
import com.wukiki.givu.util.StoreItemCategoryComponent
import com.wukiki.givu.views.mall.component.MallTopBar
import com.wukiki.givu.views.mall.component.PopularItemListPager
import com.wukiki.givu.views.mall.viewmodel.MallUiEvent
import com.wukiki.givu.views.mall.viewmodel.MallViewModel

@Composable
fun MallScreen(
    mallViewModel: MallViewModel,
    navController: NavController
) {
    val context = LocalContext.current
    val categories = mapOf(
        "전체" to "ALL",
        "전자기기" to "ELECTRONICS",
        "의류" to "CLOTHING",
        "미용" to "BEAUTY",
        "가전제품" to "HOMEAPPLIANCES",
        "스포츠" to "SPORTS",
        "음식" to "FOOD",
        "장난감" to "TOYS",
        "가구" to "FURNITURE",
        "생활" to "LIVING",
        "기타" to "OTHERS"
    )
    val selectedCategory by mallViewModel.selectedCategory.collectAsState()
    val products by mallViewModel.filteredProducts.collectAsState()
//    val popularProducts = products.take(5)
    val allProductList by mallViewModel.products.collectAsState()
    val popularProducts = allProductList.take(5)

    LaunchedEffect(Unit) {
        mallViewModel.mallUiEvent.collect { event ->
            when (event) {
                MallUiEvent.GetProductsFail -> {
                    Toast.makeText(context, "상품 불러오기 실패", Toast.LENGTH_SHORT).show()
                }

                MallUiEvent.GoToProductDetail -> {

                }

                else -> {

                }
            }
        }
    }

    Scaffold(
        containerColor = Color.White
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp)
        ) {
            item {
                MallTopBar(navController)
            }

//            item {
//                Row(
//                    modifier = Modifier.fillMaxWidth()
//                ) {
//                    Text(
//                        text = "홈",
//                        fontFamily = suit,
//                        fontWeight = FontWeight.Bold,
//                        fontSize = 20.sp
//                    )
//                    Spacer(Modifier.width(16.dp))
//                    Text(
//                        text = "인기",
//                        fontFamily = suit,
//                        fontWeight = FontWeight.SemiBold,
//                        fontSize = 20.sp,
//                        color = Color(0xFFBCBCBC)
//                    )
//                    Spacer(Modifier.width(16.dp))
//                    Text(
//                        text = "신규",
//                        fontFamily = suit,
//                        fontWeight = FontWeight.SemiBold,
//                        fontSize = 20.sp,
//                        color = Color(0xFFBCBCBC)
//                    )
//                }
//                Divider(modifier = Modifier.padding(top = 16.dp), color = Color(0xFFECECEC))
//            }

            item {
//                AsyncImage(
//                    model = "https://images.unsplash.com/photo-1502865787650-3f8318917153",
//                    contentScale = ContentScale.Crop,
//                    contentDescription = null,
//
//                )

                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .aspectRatio(5F / 3F)
                        .background(Color.White),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "배너 광고 받습니다\n" +
                                "문의: MM 구미1반 D107 이문경",
                        fontFamily = suit,
                        fontWeight = FontWeight.Bold,
                        fontSize = 24.sp,
                        textAlign = TextAlign.Center
                    )
                }
            }

            item {
                Text(
                    text = "인기 상품",
                    fontFamily = suit,
                    fontWeight = FontWeight.Bold,
                    fontSize = 22.sp
                )
                PopularItemListPager(popularProducts, navController)
            }

            item {
                Spacer(Modifier.height(16.dp))
                Text(
                    text = "카테고리 랭킹",
                    fontFamily = suit,
                    fontWeight = FontWeight.Bold,
                    fontSize = 22.sp
                )
                LazyRow(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 8.dp),
                    horizontalArrangement = Arrangement.spacedBy(12.dp),
                    contentPadding = PaddingValues(horizontal = 16.dp)
                ) {
                    items(categories.toList()) { category ->
                        StoreItemCategoryComponent(
                            name = category.first,
                            isSelected = selectedCategory == category.first,
                            onClick = {
                                mallViewModel.selectCategory(category.first)
                                mallViewModel.filterProducts(category.second)
                            }
                        )
                    }
                }
            }

            items(products) { product ->
                GiftListItem(
                    product = product,
                    onProductClick = {
                        /*** 상품 상세 페이지 이동 ***/
                        Log.d("Mall Screen", "아이디: ${product.productId}")
                        navController.navigate("ProductDetailScreen/${product.productId}")
                    }
                )
            }
        }
    }
}


@Preview(showBackground = true)
@Composable
private fun PreviewMall() {
    // MallScreen()
//    FilterCategoryItemList("전체")
}