package com.wukiki.givu.views.register

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.colorResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import coil.compose.AsyncImage
import com.wukiki.givu.R
import com.wukiki.givu.ui.pretendard
import com.wukiki.givu.util.StoreDetailBottomButton
import com.wukiki.givu.util.StoreDetailTopBar
import com.wukiki.givu.views.register.viewmodel.RegisterViewModel

@Composable
fun DetailPresentScreen(
    registerViewModel: RegisterViewModel,
    navController: NavController,
    xmlNavController: NavController
) {
    val selectedProduct by registerViewModel.selectedProduct.collectAsState()

    Box(
        modifier = Modifier.fillMaxSize()
            .padding(vertical = 16.dp)
    ) {
        selectedProduct?.let {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(bottom = 68.dp)
            ) {
                StoreDetailTopBar()

                AsyncImage(
                    model = it.image,
                    contentDescription = null,
                    modifier = Modifier
                        .fillMaxWidth()
                        .aspectRatio(4F / 3F),
                    contentScale = ContentScale.FillWidth
                )

                Spacer(Modifier.height(16.dp))

                Column(
                    Modifier.padding(horizontal = 24.dp)
                ) {
                    Text(
                        text = it.productName,
                        fontFamily = pretendard,
                        fontWeight = FontWeight.SemiBold,
                        fontSize = 22.sp,
                        maxLines = 2,
                        overflow = TextOverflow.Ellipsis
                    )

                    Spacer(Modifier.height(12.dp))

                    Text(
                        text = it.price,
                        fontFamily = pretendard,
                        fontWeight = FontWeight.Medium,
                        fontSize = 19.sp,
                        color = colorResource(R.color.main_secondary)
                    )
                }
            }
        }
        StoreDetailBottomButton(
            modifier = Modifier
                .fillMaxWidth()
                .height(68.dp)
                .align(Alignment.BottomCenter),
            text = "이 상품 선택하기",
            navController = xmlNavController,
            actionId = -1
        ) {
            navController.navigate("RegisterStep1") {
                popUpTo("RegisterStep1") { inclusive = false }
                launchSingleTop = true
            }
        }
    }
}