package com.wukiki.givu.views.register

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.wukiki.givu.util.CommonTopBar
import com.wukiki.givu.util.StoreItemCategoryComponent
import com.wukiki.givu.views.home.component.SearchBarItem
import com.wukiki.givu.views.mall.GiftListItem


@Composable
fun SelectPresentScreen(navController: NavController) {
    val tabs = listOf("전체", "화장품", "생활 가전", "전자기기", "디저트", "인테리어")
    var selectedCategory by remember { mutableStateOf("전체") }


    Column(Modifier.fillMaxSize()) {
        CommonTopBar("선물 선택하기")

        Box(
            Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp)
        ) {
            SearchBarItem(navController)
        }

        Spacer(Modifier.height(8.dp))


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

        FilteredProductList(selectedCategory)


    }
}

@Composable
fun FilteredProductList(selectedCategory: String) {
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
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(8.dp)
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

// 샘플 데이터 클래스 및 함수
data class Product(
    val id: Int,
    val name: String,
    val category: String,
    val price: Int
)

// 샘플 상품 데이터 생성 (실제로는 Repository나 ViewModel에서 가져올 것)
fun getSampleProducts(): List<Product> {
    return listOf(
        Product(1, "립스틱", "화장품", 12000),
        Product(2, "공기청정기", "생활 가전", 250000),
        Product(3, "노트북", "전자기기", 1200000),
        Product(4, "마카롱", "디저트", 2500),
        Product(5, "쿠션", "인테리어", 15000),
        Product(6, "파운데이션", "화장품", 28000),
        Product(7, "에어프라이어", "생활 가전", 89000),
        Product(8, "스마트폰", "전자기기", 980000),
        Product(9, "케이크", "디저트", 32000),
        Product(10, "식물", "인테리어", 25000)
    )
}

@Preview(showBackground = true)
@Composable
private fun TEST1() {
    // SelectPresentScreen()
}