package com.wukiki.givu.views.participate

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
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
import com.wukiki.givu.views.detail.viewmodel.FundingViewModel
import com.wukiki.givu.views.participate.component.FundingAmountSelectionPager
import com.wukiki.givu.views.participate.component.FundingInfoPager
import com.wukiki.givu.views.participate.component.IdentityVerificationPager
import com.wukiki.givu.views.participate.component.ParticipantInfoPager
import com.wukiki.givu.views.participate.component.PaymentBalancePager
import com.wukiki.givu.views.participate.component.TermsAndConditionsPager

@Composable
fun ParticipateFundingScreen(
    fundingViewModel: FundingViewModel = hiltViewModel(),
    navController: NavController
) {
    val funding by fundingViewModel.selectedFunding.collectAsState()

    Scaffold(
        topBar = { CommonTopBar(stringResource(R.string.title_participate_funding)) },
        containerColor = Color.White
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(start = 16.dp, end = 16.dp, bottom = 16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            Column(
                modifier = Modifier
                    .weight(1f)
                    .verticalScroll(rememberScrollState()),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                funding?.let {
                    FundingInfoPager(it)
                    FundingAmountSelectionPager()
                    ParticipantInfoPager()
                    IdentityVerificationPager()
                    PaymentBalancePager()
                    TermsAndConditionsPager(
                        stringResource(R.string.title_participate_funding),
                        navController,
                        R.id.action_participate_funding_to_write_letter
                    )
                }
            }
        }
    }
}
