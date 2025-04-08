package com.wukiki.givu.views.participate

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.colorResource
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.wukiki.givu.R
import com.wukiki.givu.ui.suit
import com.wukiki.givu.util.CommonTopBar
import com.wukiki.givu.util.CommonUtils.makeCommaPrice
import com.wukiki.givu.util.InfoRow
import com.wukiki.givu.views.detail.viewmodel.FundingViewModel
import com.wukiki.givu.views.participate.component.FundingInfoPager

@Composable
fun CompleteFundingScreen(
    fundingViewModel: FundingViewModel,
    navController: NavController,
    xmlNavController: NavController
) {
    val user by fundingViewModel.user.collectAsState()
    val funding by fundingViewModel.selectedFunding.collectAsState()
    val transfer by fundingViewModel.transfer.collectAsState()

    Scaffold(
        topBar = {
            CommonTopBar(
                stringResource(R.string.title_complete_funding),
                onBackClick = {},
                onHomeClick = { xmlNavController.popBackStack() }
            )
        },
        containerColor = Color.White
    ) { innerPadding ->
        funding?.let {

            Column(
                modifier = Modifier
                    .padding(innerPadding)
                    .padding(start = 16.dp, end = 16.dp, bottom = 16.dp)
                    .verticalScroll(rememberScrollState())
            ) {
                Spacer(modifier = Modifier.height(24.dp))

                Column(
                    modifier = Modifier
                        .fillMaxSize(),
                    verticalArrangement = Arrangement.Center,
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Image(
                        painter = painterResource(id = R.drawable.ic_complete),
                        contentDescription = "불꽃",
                        modifier = Modifier.size(96.dp)
                    )

                    Spacer(modifier = Modifier.height(24.dp))

                    Text(
                        text = stringResource(R.string.text_complete_funding),
                        fontSize = 24.sp,
                        fontWeight = FontWeight.Bold,
                        fontFamily = suit
                    )
                }

                Spacer(modifier = Modifier.height(36.dp))

                FundingInfoPager(it)

                Spacer(modifier = Modifier.height(24.dp))

                Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                    InfoRow("이름", user?.nickname ?: "김싸피")
                    InfoRow("이메일", user?.email ?: "kimssafy@ssafy.com")
                    InfoRow("상품", it.productName)
                    InfoRow("금액", makeCommaPrice(transfer?.amount ?: 0))
                }

                Spacer(modifier = Modifier.height(16.dp))

                Button(
                    onClick = {
                        fundingViewModel.initTransfer()
                        xmlNavController.popBackStack()
                    },
                    modifier = Modifier
                        .fillMaxSize()
                        .height(56.dp),
                    enabled = true,
                    shape = RoundedCornerShape(10.dp),
                    border = BorderStroke(1.dp, Color(0xFFECECEC)),
                    colors = ButtonDefaults.buttonColors(colorResource(R.color.main_primary)),
                ) {
                    Text(
                        text = stringResource(R.string.text_return),
                        fontFamily = suit,
                        fontWeight = FontWeight.Bold,
                        fontSize = 18.sp,
                        color = Color.White
                    )
                }
            }
        }
    }
}