package com.wukiki.givu.views.participate

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
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
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.colorResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.wukiki.givu.R
import com.wukiki.givu.ui.suit
import com.wukiki.givu.util.CommonTopBar
import com.wukiki.givu.views.detail.viewmodel.FundingViewModel
import com.wukiki.givu.views.participate.component.FundingAmountSelectionPager
import com.wukiki.givu.views.participate.component.FundingInfoPager
import com.wukiki.givu.views.participate.component.IdentityVerificationPager
import com.wukiki.givu.views.participate.component.ParticipantInfoPager
import com.wukiki.givu.views.participate.component.PaymentBalancePager

@Composable
fun ParticipateFundingScreen(
    fundingViewModel: FundingViewModel,
    navController: NavController,
    xmlNavController: NavController
) {
    val funding by fundingViewModel.selectedFunding.collectAsState()

    Scaffold(
        topBar = {
            CommonTopBar(
                stringResource(R.string.title_participate_funding),
                onBackClick = {},
                onHomeClick = {}
            )
        },
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
                    Button(
                        onClick = { navController.navigate("WriteLetter") },
                        modifier = Modifier
                            .fillMaxSize()
                            .height(56.dp),
                        enabled = true,
                        shape = RoundedCornerShape(10.dp),
                        border = BorderStroke(1.dp, Color(0xFFECECEC)),
                        colors = ButtonDefaults.buttonColors(colorResource(R.color.main_primary)),
                    ) {
                        Text(
                            text = stringResource(R.string.title_participate_funding),
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
}
