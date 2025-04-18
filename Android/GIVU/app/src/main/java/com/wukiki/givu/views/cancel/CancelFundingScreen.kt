package com.wukiki.givu.views.cancel

import android.widget.Toast
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.colorResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.wukiki.givu.R
import com.wukiki.givu.ui.suit
import com.wukiki.givu.util.CommonTopBar
import com.wukiki.givu.views.cancel.component.RecommendGiftPager
import com.wukiki.givu.views.detail.viewmodel.FundingUiEvent
import com.wukiki.givu.views.detail.viewmodel.FundingViewModel
import com.wukiki.givu.views.participate.component.FundingInfoPager

@Composable
fun CancelFundingScreen(
    fundingViewModel: FundingViewModel,
    navController: NavController,
    onRequestFingerprint: () -> Unit
) {
    val context = LocalContext.current
    val funding by fundingViewModel.selectedFunding.collectAsState()
    var showDialog by remember { mutableStateOf(false) }
    val fundingUiEvent = fundingViewModel.fundingUiEvent

    LaunchedEffect(Unit) {
        fundingUiEvent.collect { event ->
            when (event) {
                is FundingUiEvent.CancelFundingSuccess -> {
                    navController.navigate(R.id.action_cancel_funding_to_finish_cancel_funding)
                }

                is FundingUiEvent.CancelFundingFail -> {
                    Toast.makeText(
                        context,
                        context.getString(R.string.message_cancel_funding_fail),
                        Toast.LENGTH_SHORT
                    ).show()
                }

                else -> {}
            }
        }
    }

    Scaffold(
        topBar = {
            CommonTopBar(
                stringResource(R.string.title_cancel_funding),
                onBackClick = {},
                onHomeClick = {}
            )
        },
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

                FundingInfoPager(it)

                Spacer(modifier = Modifier.height(16.dp))

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

                Button(
                    onClick = {
                        if (it.fundedAmount * 2 <= it.productPrice.toInt()) {
                            showDialog = true
                        } else {
                            onRequestFingerprint()
                        }
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
                        text = stringResource(if (it.fundedAmount * 2 <= it.productPrice.toInt()) R.string.title_cancel_funding else R.string.title_finish_funding),
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
                onRequestFingerprint = onRequestFingerprint
            )
        }
    }
}