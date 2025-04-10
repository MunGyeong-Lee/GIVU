package com.wukiki.givu.views.finish

import android.widget.Toast
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.wukiki.givu.R
import com.wukiki.givu.util.CommonTopBar
import com.wukiki.givu.views.detail.viewmodel.FundingUiEvent
import com.wukiki.givu.views.finish.component.FinishFundingImagePager
import com.wukiki.givu.views.finish.component.FinishFundingParticipantPager
import com.wukiki.givu.views.finish.component.FinishFundingReviewPager
import com.wukiki.givu.views.detail.viewmodel.FundingViewModel
import com.wukiki.givu.views.participate.component.FundingInfoPager
import com.wukiki.givu.views.participate.component.IdentityVerificationPager
import com.wukiki.givu.views.participate.component.PaymentBalancePager
import com.wukiki.givu.views.participate.component.TermsAndConditionsPager

@Composable
fun FinishFundingScreen(
    fundingViewModel: FundingViewModel,
    navController: NavController
) {
    val context = LocalContext.current
    val funding by fundingViewModel.selectedFunding.collectAsState()
    val participants by fundingViewModel.fundingParticipants.collectAsState()
    val fundingUiEvent = fundingViewModel.fundingUiEvent

    LaunchedEffect(Unit) {
        fundingUiEvent.collect { event ->
            when (event) {
                is FundingUiEvent.FinishFundingSuccess -> {
                    navController.navigate("FundingFinished")
                }

                is FundingUiEvent.FinishFundingFail -> {
                    Toast.makeText(
                        context,
                        context.getString(R.string.message_auto_login_fail),
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
                stringResource(R.string.title_finish_funding),
                onBackClick = {},
                onHomeClick = {}
            )
        },
        containerColor = Color.White
    ) { innerPadding ->
        funding?.let {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(innerPadding)
                    .padding(16.dp)
                    .verticalScroll(rememberScrollState())
            ) {
                FundingInfoPager(it)
                Spacer(Modifier.height(32.dp))

                FinishFundingReviewPager(fundingViewModel)
                Spacer(Modifier.height(32.dp))

                FinishFundingImagePager(fundingViewModel)
                Spacer(Modifier.height(32.dp))

                FinishFundingParticipantPager(participants)
                Spacer(Modifier.height(32.dp))

                IdentityVerificationPager()
                Spacer(Modifier.height(16.dp))

                PaymentBalancePager(fundingViewModel, navController)
                Spacer(Modifier.height(16.dp))

                TermsAndConditionsPager(
                    fundingViewModel,
                    stringResource(R.string.title_finish_funding)
                )
            }
        }
    }
}