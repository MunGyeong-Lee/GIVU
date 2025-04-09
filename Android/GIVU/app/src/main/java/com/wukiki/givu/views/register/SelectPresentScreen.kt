package com.wukiki.givu.views.register

import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.wukiki.givu.R
import com.wukiki.givu.ui.suit
import com.wukiki.givu.util.CommonTopBar
import com.wukiki.givu.util.StoreItemCategoryComponent
import com.wukiki.givu.views.mall.GiftListItem
import com.wukiki.givu.views.mall.viewmodel.MallViewModel
import com.wukiki.givu.views.register.viewmodel.RegisterViewModel

@Composable
fun SelectPresentScreen(
    registerViewModel: RegisterViewModel,
    mallViewModel: MallViewModel,
    navController: NavController,
    xmlNavController: NavController
) {
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

    Column(Modifier.fillMaxSize()) {
        CommonTopBar(
            "선물 선택하기",
            onBackClick = { navController.popBackStack() },
            onHomeClick = { xmlNavController.navigate(R.id.fragment_home) }
        )

        Box(
            Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp)
        ) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(40.dp)
                    .clip(RoundedCornerShape(10.dp))
                    .border(1.dp, Color(0xFFFF6F61), RoundedCornerShape(10.dp))
                    .clickable { navController.navigate("SearchPresent") }
                    .padding(horizontal = 12.dp),
                contentAlignment = Alignment.CenterStart
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.fillMaxSize()
                ) {
                    Text(
                        text = stringResource(R.string.text_search_keyword_need),
                        color = Color.Gray,
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Medium,
                        fontFamily = suit
                    )

                    Spacer(modifier = Modifier.weight(1F))

                    Icon(
                        painter = painterResource(id = R.drawable.ic_search),
                        contentDescription = "검색",
                        tint = Color.Gray,
                        modifier = Modifier.size(24.dp)
                    )
                }
            }
        }

        Spacer(Modifier.height(8.dp))

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
                        registerViewModel.filterProducts(category.second)
                    }
                )
            }

        }

        Spacer(Modifier.height(4.dp))

        FilteredProductList(registerViewModel, navController)
    }
}

@Composable
fun FilteredProductList(
    registerViewModel: RegisterViewModel,
    navController: NavController
) {
    val products by registerViewModel.filteredProducts.collectAsState()

    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(horizontal = 16.dp)
    ) {
        items(products) { product ->
            GiftListItem(
                product,
                onProductClick = {
                    registerViewModel.fetchProduct(product)
                    navController.navigate("DetailPresent/${product.productId}")
                }
            )
        }
    }
}

@Preview(showBackground = true)
@Composable
private fun TEST1() {
    // SelectPresentScreen()
}