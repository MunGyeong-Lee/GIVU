package com.wukiki.givu.views.mall

import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.pager.HorizontalPager
import androidx.compose.material.Divider
import androidx.compose.material.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.wukiki.givu.ui.suit
import com.wukiki.givu.util.StoreItemCategoryComponent
import com.wukiki.givu.views.mall.component.MallTopBar
import com.wukiki.givu.views.mall.component.PopularItemListPager
import com.wukiki.givu.views.register.FilteredProductList
import com.wukiki.givu.views.register.getSampleProducts

@Composable
fun MallScreen() {

    val tabs = listOf("전체", "화장품", "생활 가전", "전자기기", "디저트", "인테리어")
    var selectedCategory by remember { mutableStateOf("전체") }

    val allProducts = remember { getSampleProducts() }

    val filteredProducts = remember(selectedCategory) {
        if (selectedCategory == "전체") allProducts
        else allProducts.filter { it.category == selectedCategory }
    }

    Scaffold(

    ) { padding ->

        LazyColumn(
            modifier = Modifier
                .fillMaxWidth()
                .padding(padding)
                .padding(bottom = 24.dp)
        ) {
            item {
                MallTopBar()
            }

            item {
                Row(modifier = Modifier.fillMaxWidth()) {

                    Text(
                        text = "홈",
                        fontFamily = suit,
                        fontWeight = FontWeight.Bold,
                        fontSize = 20.sp
                    )
                    Spacer(Modifier.width(16.dp))
                    Text(
                        text = "인기",
                        fontFamily = suit,
                        fontWeight = FontWeight.SemiBold,
                        fontSize = 20.sp,
                        color = Color(0xFFBCBCBC)
                    )
                    Spacer(Modifier.width(16.dp))
                    Text(
                        text = "신규",
                        fontFamily = suit,
                        fontWeight = FontWeight.SemiBold,
                        fontSize = 20.sp,
                        color = Color(0xFFBCBCBC)
                    )


                }
                Divider(modifier = Modifier.padding(top = 16.dp), color = Color(0xFFECECEC))

            }

            item {
                AsyncImage(
                    model = "https://images.unsplash.com/photo-1502865787650-3f8318917153",
                    contentScale = ContentScale.Crop,
                    contentDescription = null,
                    modifier = Modifier
                        .fillMaxWidth()
                        .aspectRatio(4f / 3f),  // ⭐ 4:3 비율로 설정

                )
            }

            item {
                Spacer(Modifier.height(16.dp))
                Text(
                    text = "인기 상품",
                    fontFamily = suit,
                    fontWeight = FontWeight.Bold,
                    fontSize = 22.sp
                )
                PopularItemListPager()

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

                    items(tabs) { category ->

                        StoreItemCategoryComponent(
                            name = category,
                            isSelected = selectedCategory == category,
                            onClick = { selectedCategory = category }
                        )
                    }
                }

            }


            items(filteredProducts) { product ->
                GiftListItem(
                    product = product,
                    onClick = {
                        // 클릭 시 상세 페이지 이동 등
                    }
                )
            }

        }

    }
}

@Composable
private fun FilterCategoryItemList(selectedCategory: String) {
    // 실제 상품 데이터를 가져오는 부분 (예시)
    val allProducts = remember { getSampleProducts() }

    // 선택된 카테고리에 따라 상품 필터링
    val filteredProducts = remember(selectedCategory) {
        if (selectedCategory == "전체") {
            allProducts
        } else {
            allProducts.filter { it.category == selectedCategory }
        }
    }

    // 필터링된 상품 목록 표시
    LazyColumn(
        modifier = Modifier.fillMaxWidth(),
        contentPadding = PaddingValues(horizontal = 16.dp),
//        verticalArrangement = Arrangement.spacedBy(4.dp)
    ) {
        items(filteredProducts) { product ->
            GiftListItem(product,
                onClick = {
//                    누르면 해당 아이템 상세 정보 화면으로 이동
                }
            )
        }
    }
}

@Preview(showBackground = true)
@Composable
private fun PreviewMall() {
    MallScreen()
//    FilterCategoryItemList("전체")
}