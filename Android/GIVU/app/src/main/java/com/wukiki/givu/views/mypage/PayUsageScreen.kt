package com.wukiki.givu.views.mypage

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material.Divider
import androidx.compose.material.Scaffold
import androidx.compose.material.TopAppBar
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.colorResource
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.wukiki.givu.R
import com.wukiki.givu.ui.lusitana
import com.wukiki.givu.ui.pretendard
import com.wukiki.givu.util.CommonTopBar
import com.wukiki.givu.util.CommonUtils
import com.wukiki.givu.views.mypage.component.PayHistoryItem

@Composable
fun PayUsageScreen(
    navController: NavController
) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.White)
    ) {

        LazyColumn(
            modifier = Modifier
                .fillMaxWidth()
                .background(Color.White)
                .padding(top = 60.dp)
                .padding(horizontal = 4.dp)
        ) {
            item {

            }

            item {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 16.dp)
                        .padding(horizontal = 16.dp)
                ) {

                    Text(
                        text = "GIVU pay",
                        fontFamily = lusitana,
                        fontWeight = FontWeight.Bold,
                        fontSize = 16.sp,
                        color = colorResource(R.color.main_primary)
                    )
                    Spacer(Modifier.height(8.dp))
                    Text(
                        text = CommonUtils.makeCommaPrice(30000),
                        fontFamily = pretendard,
                        fontWeight = FontWeight.Bold,
                        fontSize = 28.sp
                    )
                }
                Divider()
                Spacer(Modifier.height(16.dp))
            }

            item {
                PayHistoryItem()

            }
        }

        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(color = Color.White)
                .height(60.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(
                onClick = {
                    navController.popBackStack()
                }
            ) {
                Icon(
                    painter = painterResource(R.drawable.ic_arrow_back),
                    contentDescription = null,
                    modifier = Modifier.size(24.dp)
                )
            }
        }
    }


}

@Preview(showBackground = true)
@Composable
private fun paytest() {
//    PayUsageScreen()
}