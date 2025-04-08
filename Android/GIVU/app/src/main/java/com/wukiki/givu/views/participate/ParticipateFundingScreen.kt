package com.wukiki.givu.views.participate

import android.widget.Toast
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
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
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
import com.wukiki.givu.views.community.viewmodel.CommunityUiEvent
import com.wukiki.givu.views.detail.viewmodel.FundingUiEvent
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
    val context = LocalContext.current
    val user by fundingViewModel.user.collectAsState()
    val funding by fundingViewModel.selectedFunding.collectAsState()
    val charge by fundingViewModel.charge.collectAsState()
    val fundingUiEvent = fundingViewModel.fundingUiEvent

    LaunchedEffect(Unit) {
        fundingUiEvent.collect { event ->
            when (event) {
                is FundingUiEvent.TransferFail -> {
                    Toast.makeText(
                        context,
                        context.getString(R.string.message_transfer_fail),
                        Toast.LENGTH_SHORT
                    ).show()
                }

                else -> {

                }
            }
        }
    }

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
                    FundingAmountSelectionPager(fundingViewModel, it)
                    ParticipantInfoPager(user)
                    // IdentityVerificationPager()
                    PaymentBalancePager(fundingViewModel)
                    Button(
                        onClick = {
                            navController.navigate("WriteLetter")
                        },
                        modifier = Modifier
                            .fillMaxSize()
                            .height(56.dp),
                        enabled = (charge > 0) && (charge <= (it.productPrice.toInt() - it.fundedAmount)),
                        shape = RoundedCornerShape(10.dp),
                        border = BorderStroke(1.dp, Color(0xFFECECEC)),
                        colors = ButtonDefaults.buttonColors(
                            if ((charge == 0) || (charge > (it.productPrice.toInt() - it.fundedAmount))) Color.LightGray else colorResource(
                                R.color.main_primary
                            )
                        ),
                    ) {
                        Text(
                            text = stringResource(R.string.title_participate_funding),
                            fontFamily = suit,
                            fontWeight = FontWeight.Bold,
                            fontSize = 18.sp,
                            color = if ((charge == 0) || (charge > (it.productPrice.toInt() - it.fundedAmount))) Color.DarkGray else Color.White
                        )
                    }
                }
            }
        }
    }
}
