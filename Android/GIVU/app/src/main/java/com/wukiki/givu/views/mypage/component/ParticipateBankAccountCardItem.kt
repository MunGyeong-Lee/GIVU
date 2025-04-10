package com.wukiki.givu.views.mypage.component

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowDropDown
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.colorResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.wukiki.givu.R
import com.wukiki.givu.ui.suit
import com.wukiki.givu.util.CommonUtils.makeCommaPrice
import com.wukiki.givu.views.detail.viewmodel.FundingViewModel

@Composable
fun ParticipateBankAccountCardItem(
    fundingViewModel: FundingViewModel
) {
    val account by fundingViewModel.account.collectAsState()
    val amounts = listOf(10000, 20000, 30000)
    var selectedAmount by remember { mutableStateOf("") }
    var customAmount by remember { mutableStateOf("0") }
    val isManualInput = remember { mutableStateOf(false) }

    Column {
        Text(
            text = "출금 계좌 선택",
            fontWeight = FontWeight.Bold,
            fontFamily = suit
        )
        Spacer(Modifier.height(8.dp))

        OutlinedTextField(
            value = account?.accountNo ?: "",
            onValueChange = {},
            readOnly = true,
            trailingIcon = { Icon(Icons.Default.ArrowDropDown, contentDescription = null) },
            modifier = Modifier.fillMaxWidth()
        )

        Spacer(Modifier.height(24.dp))

        Row {
            Text(
                text = "남은 잔액",
                fontWeight = FontWeight.Bold,
                fontFamily = suit,
                fontSize = 16.sp
            )
            Spacer(modifier = Modifier.weight(1F))
            Text(
                text = makeCommaPrice(account?.balance ?: 0),
                fontWeight = FontWeight.Bold,
                fontFamily = suit,
                fontSize = 14.sp
            )
        }
        Spacer(Modifier.height(24.dp))

        Text(
            text = "아래 금액을 GIVU 페이로 충전합니다.",
            fontWeight = FontWeight.Bold,
            fontFamily = suit,
            fontSize = 18.sp
        )
        Spacer(Modifier.height(8.dp))

        Row(
            modifier = Modifier
                .fillMaxWidth()
                .horizontalScroll(rememberScrollState()),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            amounts.forEach { amount ->
                OutlinedButton(
                    onClick = {
                        isManualInput.value = false
                        selectedAmount = makeCommaPrice(amount)
                        fundingViewModel.setPayCharge(amount)
                    },
                    shape = RoundedCornerShape(12.dp),
                    border = BorderStroke(1.dp, Color.Gray),
                    colors = ButtonDefaults.outlinedButtonColors(
                        containerColor = if (selectedAmount == makeCommaPrice(amount) && !isManualInput.value) colorResource(
                            R.color.main_primary
                        ) else Color.Transparent
                    )
                ) {
                    Text(
                        text = "+${makeCommaPrice(amount)}",
                        fontSize = 14.sp,
                        fontFamily = suit,
                        fontWeight = FontWeight.Bold,
                        color = if (selectedAmount == makeCommaPrice(amount) && !isManualInput.value) Color.White else colorResource(
                            R.color.main_primary
                        )
                    )
                }
            }
            OutlinedButton(
                onClick = {
                    isManualInput.value = true
                    selectedAmount = ""
                    fundingViewModel.setPayCharge(customAmount.toInt())
                },
                shape = RoundedCornerShape(12.dp),
                colors = ButtonDefaults.outlinedButtonColors(
                    containerColor = if (isManualInput.value) colorResource(R.color.main_primary) else Color.Transparent
                ),
            ) {
                Text(
                    "직접입력",
                    fontSize = 14.sp,
                    fontFamily = suit,
                    fontWeight = FontWeight.Bold,
                    color = if (isManualInput.value) Color.White else colorResource(R.color.main_primary)
                )
            }
        }

        if (isManualInput.value) {
            Spacer(Modifier.height(16.dp))
            OutlinedTextField(
                value = customAmount,
                onValueChange = {
                    customAmount = it
                    fundingViewModel.setPayCharge(if (it == "") 0 else it.toInt())
                },
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = colorResource(R.color.main_primary)
                ),
                placeholder = { Text("충전 금액을 입력하세요") },
                modifier = Modifier.fillMaxWidth(),
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
            )
        }
    }
}