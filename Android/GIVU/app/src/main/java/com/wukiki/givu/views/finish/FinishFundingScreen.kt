package com.wukiki.givu.views.finish

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.NavController
import com.wukiki.givu.R
import com.wukiki.givu.util.CommonTopBar
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
    fundingViewModel: FundingViewModel = hiltViewModel(),
    navController: NavController
) {
    val funding by fundingViewModel.selectedFunding.collectAsState()
    val participants by fundingViewModel.fundingParticipants.collectAsState()

    Scaffold(
        topBar = { CommonTopBar(stringResource(R.string.title_finish_funding)) },
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

                FinishFundingReviewPager()
                Spacer(Modifier.height(32.dp))

                FinishFundingImagePager()
                Spacer(Modifier.height(32.dp))

                FinishFundingParticipantPager(participants)
                Spacer(Modifier.height(32.dp))

                IdentityVerificationPager()
                Spacer(Modifier.height(16.dp))

                PaymentBalancePager()
                Spacer(Modifier.height(16.dp))

                TermsAndConditionsPager(
                    stringResource(R.string.title_finish_funding),
                    navController,
                    R.id.action_finish_funding_to_funding_finished
                )
            }
        }
    }
}