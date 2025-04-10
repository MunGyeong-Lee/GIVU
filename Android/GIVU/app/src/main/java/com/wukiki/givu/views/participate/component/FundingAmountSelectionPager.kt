package com.wukiki.givu.views.participate.component

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
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
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.Card
import androidx.compose.material3.RadioButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.wukiki.domain.model.FundingDetail
import com.wukiki.givu.ui.suit
import com.wukiki.givu.util.CommonUtils.makeCommaPrice
import com.wukiki.givu.views.detail.viewmodel.FundingViewModel

@Composable
fun FundingAmountSelectionPager(
    fundingViewModel: FundingViewModel,
    fundingDetail: FundingDetail
) {
    val user by fundingViewModel.user.collectAsState()

    Column(
        modifier = Modifier.fillMaxWidth()
    ) {
        Text(text = "펀딩 참여 금액", fontSize = 18.sp, fontWeight = FontWeight.Bold)
        Spacer(modifier = Modifier.height(8.dp))

        val amounts = listOf(5000, 10000, 20000, 30000, 50000)
        val amountsDescription =
            listOf("커피 한 잔 선물", "디저트 한 개 선물", "식사 한 끼 선물", "소품 한 개 선물", "프리미엄 선물")
        val selectedAmount by fundingViewModel.selectedAmount.collectAsState()
        val text by fundingViewModel.amountText.collectAsState()
        val shadowBrush = Brush.verticalGradient(
            colors = listOf(Color.Gray.copy(alpha = 0.3f), Color.Transparent)
        )

        amounts.forEachIndexed { index, amount ->
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
                            if (amount <= (fundingDetail.productPrice.toInt() - fundingDetail.fundedAmount)) {
                                fundingViewModel.setSelectedAmount(makeCommaPrice(amount))
                                fundingViewModel.setCharge(amount)
                            }
                        },
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    RadioButton(
                        enabled = amount <= (fundingDetail.productPrice.toInt() - fundingDetail.fundedAmount),
                        selected = selectedAmount == makeCommaPrice(amount),
                        onClick = {
                            fundingViewModel.setSelectedAmount(makeCommaPrice(amount))
                            fundingViewModel.setCharge(amount)
                        }
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Column {
                        Text(
                            text = makeCommaPrice(amount),
                            fontSize = 20.sp,
                            fontFamily = suit,
                            fontWeight = FontWeight.Bold,
                            color = Color.Black
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = amountsDescription[index],
                            fontSize = 18.sp,
                            fontFamily = suit,
                            fontWeight = FontWeight.Medium,
                            color = Color.Black
                        )
                    }
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
                    .clickable { fundingViewModel.setSelectedAmount("직접 입력") },
                verticalAlignment = Alignment.CenterVertically
            ) {
                RadioButton(
                    selected = selectedAmount == "직접 입력",
                    onClick =  {
                        fundingViewModel.setSelectedAmount("직접 입력")
                        fundingViewModel.setCharge(0)
                    }
                )
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
                                        fundingViewModel.setAmountText(it)
                                        fundingViewModel.setCharge(if (it == "") 0 else it.toInt())
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
                                        .padding(horizontal = 2.dp, vertical = 1.dp),
                                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                                )
                            }
                        }
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "원",
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
}