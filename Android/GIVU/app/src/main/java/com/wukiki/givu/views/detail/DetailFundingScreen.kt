package com.wukiki.givu.views.detail

import android.widget.Toast
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.Button
import androidx.compose.material.ButtonDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
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
import com.wukiki.givu.util.StoreDetailBottomButton
import com.wukiki.givu.views.detail.component.DetailFundingContent
import com.wukiki.givu.views.detail.viewmodel.FundingUiEvent
import com.wukiki.givu.views.detail.viewmodel.FundingViewModel

@Composable
fun DetailFundingScreen(
    fundingViewModel: FundingViewModel,
    navController: NavController,
) {
    val context = LocalContext.current
    val user by fundingViewModel.user.collectAsState()
    val funding by fundingViewModel.selectedFunding.collectAsState()
    val letters by fundingViewModel.selectedFundingLetter.collectAsState()
    val fundingUiEvent = fundingViewModel.fundingUiEvent

    LaunchedEffect(Unit) {
        fundingUiEvent.collect { event ->
            when (event) {
                is FundingUiEvent.DeleteLetterSuccess -> {
                    Toast.makeText(
                        context,
                        context.getString(R.string.message_delete_letter_success),
                        Toast.LENGTH_SHORT
                    ).show()
                }

                is FundingUiEvent.DeleteLetterFail -> {
                    Toast.makeText(
                        context,
                        context.getString(R.string.message_delete_letter_fail),
                        Toast.LENGTH_SHORT
                    ).show()
                }

                else -> {

                }
            }
        }
    }

    funding?.let {
        Scaffold(
            bottomBar = {
                Surface(
                    modifier = Modifier.fillMaxWidth(),
                    shadowElevation = 16.dp,
                    color = Color.White
                ) {
                    if (user != null) {


                        if (it.isCreator) {
                            when (it.fundedAmount == it.productPrice.toInt()) {
                                true -> {
                                    StoreDetailBottomButton(
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .height(68.dp),
                                        text = stringResource(R.string.text_funding_finish),
                                        navController = navController,
                                        actionId = R.id.action_detail_funding_to_finish_funding,
                                        false
                                    ) { }
                                }

                                else -> {
                                    StoreDetailBottomButton(
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .height(68.dp),
                                        text = stringResource(R.string.text_funding_update),
                                        navController = navController,
                                        actionId = R.id.action_detail_funding_to_update_funding,
                                        false
                                    ) { }
                                }
                            }
                        } else {
                            StoreDetailBottomButton(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(68.dp),
                                text = stringResource(R.string.title_participate_funding),
                                navController = navController,
                                actionId = R.id.action_detail_funding_to_participate_funding,
                                it.productPrice.toInt() == it.fundedAmount
                            ) { }
                        }
                    } else {

                        Box(modifier = Modifier.fillMaxWidth().height(68.dp)) {
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(68.dp)
                                    .align(Alignment.BottomCenter),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Button(
                                    onClick = {
                                        navController.navigate(R.id.action_fragment_detail_funding_to_fragment_login)
                                    },
                                    modifier = Modifier
                                        .weight(1f)
                                        .height(48.dp)
                                        .padding(horizontal = 8.dp),
                                    enabled = true,
                                    shape = RoundedCornerShape(5.dp),
                                    border = BorderStroke(1.dp, Color(0xFFECECEC)),
                                    colors = ButtonDefaults.buttonColors(colorResource(R.color.main_primary)),
                                    elevation = ButtonDefaults.elevation(0.dp)
                                ) {
                                    Text(
                                        text = "로그인 하기",
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