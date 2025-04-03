package com.wukiki.givu.views.mypage

import android.widget.Toast
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.material.Card
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.RadioButton
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.colorResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.wukiki.givu.R
import com.wukiki.givu.ui.suit
import com.wukiki.givu.util.CommonTopBar
import com.wukiki.givu.util.CommonUtils.makeCommaPrice
import com.wukiki.givu.views.detail.viewmodel.FundingUiEvent
import com.wukiki.givu.views.home.viewmodel.HomeUiEvent
import com.wukiki.givu.views.home.viewmodel.HomeViewModel

@Composable
fun ChargeAccountScreen(
    homeViewModel: HomeViewModel,
    navController: NavController,
    xmlNavController: NavController
) {
    val context = LocalContext.current
    val balance by homeViewModel.balance.collectAsState()
    val homeUiEvent = homeViewModel.homeUiEvent

    LaunchedEffect(Unit) {
        homeUiEvent.collect { event ->
            when (event) {
                is HomeUiEvent.WithdrawalSuccess -> {
                    Toast.makeText(
                        context,
                        context.getString(R.string.message_charge_account_success),
                        Toast.LENGTH_SHORT
                    ).show()
                    navController.popBackStack()
                }

                is HomeUiEvent.WithdrawalFail -> {
                    Toast.makeText(
                        context,
                        context.getString(R.string.message_charge_account_fail),
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
                stringResource(R.string.title_charge_account),
                onBackClick = {},
                onHomeClick = {}
            )
        },
        containerColor = Color.White
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            Column(
                modifier = Modifier.fillMaxWidth()
            ) {
                Text(
                    text = "충전 금액",
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    fontFamily = suit
                )
                Spacer(modifier = Modifier.height(8.dp))

                val amounts = listOf(5000, 10000, 20000, 30000, 50000)
                var selectedAmount by remember { mutableStateOf("") }
                var text by remember { mutableStateOf("") }
                val shadowBrush = Brush.verticalGradient(
                    colors = listOf(Color.Gray.copy(alpha = 0.3f), Color.Transparent)
                )

                amounts.forEach { amount ->
                    Card(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(bottom = 16.dp),
                        shape = RoundedCornerShape(8.dp),
                        elevation = 4.dp
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(16.dp)
                                .clickable {
                                    homeViewModel.setCharge(amount)
                                    selectedAmount = makeCommaPrice(amount)
                                },
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            RadioButton(
                                enabled = (amount >= balance),
                                selected = selectedAmount == makeCommaPrice(amount),
                                onClick = {
                                    homeViewModel.setCharge(amount)
                                    selectedAmount = makeCommaPrice(amount)
                                }
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = makeCommaPrice(amount),
                                fontSize = 20.sp,
                                fontFamily = suit,
                                fontWeight = FontWeight.Bold,
                                color = Color.Black
                            )
                        }
                    }
                }

                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(bottom = 16.dp),
                    shape = RoundedCornerShape(8.dp),
                    elevation = 4.dp
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(16.dp)
                            .clickable { selectedAmount = "직접 입력" },
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        RadioButton(
                            selected = selectedAmount == "직접 입력",
                            onClick = { selectedAmount = "직접 입력" })
                        Spacer(modifier = Modifier.width(8.dp))
                        Column {
                            Text(
                                text = "직접 입력",
                                fontSize = 20.sp,
                                fontFamily = suit,
                                fontWeight = FontWeight.Bold,
                                color = Color.Black
                            )
                            Spacer(modifier = Modifier.height(4.dp))

                            Row {
                                Box(
                                    modifier = Modifier
                                        .weight(1F)
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
                                            value = text,
                                            onValueChange = {
                                                text = it
                                                homeViewModel.setCharge(if (it == "") 0 else it.toInt())
                                            },
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
                                Spacer(modifier = Modifier.width(8.dp))
                                Text(
                                    text = "원" ,
                                    color = Color.Black,
                                    fontSize = 18.sp,
                                    fontFamily = suit,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                        }
                    }
                }
            }

            Button(
                onClick = { homeViewModel.withdrawAccount() },
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