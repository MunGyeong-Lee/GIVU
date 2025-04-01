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
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.wukiki.givu.R
import com.wukiki.givu.util.CommonTopBar
import com.wukiki.givu.util.StoreItemCategoryComponent
import com.wukiki.givu.views.home.component.SearchBarItem
import com.wukiki.givu.views.mall.GiftListItem
import com.wukiki.givu.views.register.viewmodel.RegisterViewModel

@Composable
fun SelectPresentScreen(
    registerViewModel: RegisterViewModel,
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
    var selectedCategory by remember { mutableStateOf("전체") }

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

            items(categories.toList()) { category ->

                StoreItemCategoryComponent(
                    name = category.first,
                    isSelected = selectedCategory == category.first,
                    onClick = {
                        selectedCategory = category.first
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
                onClick = {
                    registerViewModel.selectProduct(product)
                    navController.navigate("DetailPresent")
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