package com.wukiki.givu.views.cancel

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.colorResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.NavController
import com.wukiki.givu.R
import com.wukiki.givu.ui.suit
import com.wukiki.givu.util.CommonTopBar
import com.wukiki.givu.views.cancel.component.RecommendGiftPager
import com.wukiki.givu.views.detail.viewmodel.FundingViewModel

@Composable
fun CancelFundingScreen(
    fundingViewModel: FundingViewModel = hiltViewModel(),
    navController: NavController
) {
    val funding by fundingViewModel.selectedFunding.collectAsState()
    val paymentPassword by fundingViewModel.paymentPassword.collectAsState()
    val shadowBrush = Brush.verticalGradient(
        colors = listOf(Color.Gray.copy(alpha = 0.3f), Color.Transparent)
    )
    var showDialog by remember { mutableStateOf(false) }

    Scaffold(
        topBar = { CommonTopBar(stringResource(R.string.title_cancel_funding)) },
        containerColor = Color.White
    ) { innerPadding ->
        funding?.let {
            Column(
                modifier = Modifier
                    .padding(innerPadding)
                    .padding(start = 16.dp, end = 16.dp, bottom = 16.dp)
                    .fillMaxSize()
                    .verticalScroll(rememberScrollState())
            ) {
                Spacer(modifier = Modifier.height(8.dp))

                Text(
                    text = stringResource(R.string.title_recommend_other_funding),
                    fontSize = 24.sp,
                    fontWeight = FontWeight.Bold,
                    fontFamily = suit
                )

                Spacer(modifier = Modifier.height(8.dp))

                Text(
                    text = stringResource(R.string.text_recommend_other_funding),
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Medium,
                    fontFamily = suit
                )

                Spacer(modifier = Modifier.height(12.dp))

                RecommendGiftPager()

                Spacer(modifier = Modifier.height(24.dp))

                Text(
                    stringResource(R.string.title_confirm_cancel_funding),
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Bold,
                    fontFamily = suit
                )

                Spacer(modifier = Modifier.height(4.dp))

                Text(
                    text = stringResource(R.string.text_confirm_cancel_funding),
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Medium,
                    fontFamily = suit
                )

                Spacer(modifier = Modifier.height(24.dp))

                Text(
                    text = stringResource(R.string.text_givu_pay_password),
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Medium,
                    fontFamily = suit
                )

                Spacer(modifier = Modifier.height(16.dp))

                Box(
                    modifier = Modifier
                        .height(32.dp)
                        .background(shadowBrush, RoundedCornerShape(10.dp))
                        .padding(2.dp)
                ) {
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .background(Color.White, RoundedCornerShape(10.dp))
                            .padding(horizontal = 8.dp)
                    ) {
                        BasicTextField(
                            value = paymentPassword,
                            onValueChange = { fundingViewModel.paymentPassword.value = it },
                            singleLine = true,
                            textStyle = TextStyle(
                                color = Color.Black,
                                fontSize = 14.sp,
                                fontFamily = suit,
                                fontWeight = FontWeight.Medium
                            ),
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(horizontal = 2.dp, vertical = 1.dp)
                        )
                    }
                }

                Spacer(modifier = Modifier.height(24.dp))

                Button(
                    onClick = { showDialog = true },
                    modifier = Modifier
                        .fillMaxSize()
                        .height(56.dp),
                    enabled = true,
                    shape = RoundedCornerShape(10.dp),
                    border = BorderStroke(1.dp, Color(0xFFECECEC)),
                    colors = ButtonDefaults.buttonColors(colorResource(R.color.main_primary)),
                ) {
                    Text(
                        text = stringResource(R.string.title_cancel_funding),
                        fontFamily = suit,
                        fontWeight = FontWeight.Bold,
                        fontSize = 18.sp,
                        color = Color.White
                    )
                }
            }
        }

        if (showDialog) {
            CancelFundingDialogScreen(
                onDismiss = { showDialog = false },
                onConfirm = { navController.navigate(R.id.action_cancel_funding_to_finish_cancel_funding) }
            )
        }
    }
}