package com.wukiki.givu.views.detail

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.wukiki.givu.R
import com.wukiki.givu.util.StoreDetailBottomButton
import com.wukiki.givu.views.detail.component.DetailFundingContent
import com.wukiki.givu.views.detail.viewmodel.FundingViewModel
import timber.log.Timber

@Composable
fun DetailFundingScreen(
    fundingViewModel: FundingViewModel,
    navController: NavController
) {
    val user by fundingViewModel.user.collectAsState()
    val funding by fundingViewModel.selectedFunding.collectAsState()
    val letters by fundingViewModel.selectedFundingLetter.collectAsState()

    funding?.let {
        Scaffold(
            bottomBar = {
                Surface(
                    modifier = Modifier.fillMaxWidth(),
                    shadowElevation = 16.dp,
                    color = Color.White
                ) {
                    if (it.writerId == (user?.id ?: "-1").toInt()) {
                        when (it.fundedAmount == it.productPrice.toInt()) {
                            true -> {
                                Timber.d("내가 만든 완료된 펀딩")
                                StoreDetailBottomButton(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .height(68.dp),
                                    text = stringResource(R.string.text_funding_finish),
                                    navController = navController,
                                    actionId = R.id.action_detail_funding_to_finish_funding
                                ) { }
                            }

                            else -> {
                                Timber.d("내가 만든 대기중인 펀딩")
                                Row {
                                    StoreDetailBottomButton(
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .height(68.dp),
                                        text = stringResource(R.string.text_funding_update),
                                        navController = navController,
                                        actionId = R.id.action_detail_funding_to_update_funding
                                    ) { }
                                    StoreDetailBottomButton(
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .height(68.dp),
                                        text = stringResource(R.string.text_funding_cancel),
                                        navController = navController,
                                        actionId = R.id.action_detail_funding_to_cancel_funding
                                    ) { }
                                }
                            }
                        }
                    } else {
                        Timber.d("다른 사람의 펀딩")
                        StoreDetailBottomButton(
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(68.dp),
                            text = stringResource(R.string.title_participate_funding),
                            navController = navController,
                            actionId = R.id.action_detail_funding_to_participate_funding
                        ) { }
                    }
                }
            }
        ) { paddingValues ->
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .background(Color.White)
                    .padding(paddingValues)
            ) {
                DetailFundingContent(fundingViewModel, it, letters)
            }
        }
    }
}