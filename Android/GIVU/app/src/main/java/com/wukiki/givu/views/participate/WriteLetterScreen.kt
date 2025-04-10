package com.wukiki.givu.views.participate

import android.widget.Toast
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TextField
import androidx.compose.material3.TextFieldDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
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
import com.wukiki.givu.util.InfoRow
import com.wukiki.givu.views.detail.viewmodel.FundingUiEvent
import com.wukiki.givu.views.detail.viewmodel.FundingViewModel
import com.wukiki.givu.views.participate.component.FundingInfoPager

@Composable
fun WriteLetterScreen(
    fundingViewModel: FundingViewModel,
    navController: NavController,
    xmlNavController: NavController,
    onRequestFingerprint: () -> Unit
) {
    val context = LocalContext.current
    val user by fundingViewModel.user.collectAsState()
    val funding by fundingViewModel.selectedFunding.collectAsState()
    val charge by fundingViewModel.charge.collectAsState()
    val writeLetter by fundingViewModel.writeLetter.collectAsState()
    val fundingUiEvent = fundingViewModel.fundingUiEvent

    LaunchedEffect(Unit) {
        fundingUiEvent.collect { event ->
            when (event) {
                is FundingUiEvent.ParticipateFundingSuccess -> {
                    Toast.makeText(
                        context,
                        context.getString(R.string.message_participate_funding_success),
                        Toast.LENGTH_SHORT
                    ).show()
                    navController.navigate("CompleteParticipate")
                }

                is FundingUiEvent.ParticipateFundingFail -> {
                    Toast.makeText(
                        context,
                        context.getString(R.string.message_participate_funding_fail),
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
                stringResource(R.string.title_write_letter),
                onBackClick = {},
                onHomeClick = {})
        },
        containerColor = Color.White
    ) { innerPadding ->
        funding?.let {
            Column(
                modifier = Modifier
                    .padding(innerPadding)
                    .padding(start = 16.dp, end = 16.dp, bottom = 16.dp)
                    .verticalScroll(rememberScrollState())
            ) {
                Spacer(modifier = Modifier.height(8.dp))

                TextField(
                    value = writeLetter,
                    onValueChange = { fundingViewModel.writeLetter.value = it },
                    placeholder = { Text(stringResource(R.string.text_hint_write_letter)) },
                    modifier = Modifier
                        .fillMaxWidth()
                        .heightIn(min = 196.dp, max = 196.dp),
                    textStyle = TextStyle(
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Normal,
                        fontFamily = suit,
                        lineHeight = 20.sp
                    ),
                    colors = TextFieldDefaults.colors(
                        focusedIndicatorColor = Color.Transparent,
                        unfocusedIndicatorColor = Color.Transparent,
                        disabledIndicatorColor = Color.Transparent,
                        errorIndicatorColor = Color.Transparent,
                        focusedContainerColor = Color.Transparent,
                        unfocusedContainerColor = Color.Transparent,
                        disabledContainerColor = Color.Transparent
                    )
                )

                Spacer(modifier = Modifier.height(16.dp))

                HorizontalDivider()

                Spacer(modifier = Modifier.height(16.dp))

                Text(
                    "펀딩 참여 정보",
                    fontWeight = FontWeight.Bold,
                    fontSize = 20.sp,
                    fontFamily = suit,
                    color = Color.Black
                )

                Spacer(modifier = Modifier.height(16.dp))

                FundingInfoPager(it)

                Spacer(modifier = Modifier.height(16.dp))

                Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                    InfoRow("이름", user?.nickname ?: "김싸피")
                    InfoRow("이메일", user?.email ?: "kimssafy@ssafy.com")
                    InfoRow("상품", it.productName)
                    InfoRow("금액", makeCommaPrice(charge))
                }

                Spacer(modifier = Modifier.height(16.dp))

                Button(
                    onClick = {
                        onRequestFingerprint()
                        // fundingViewModel.participateFunding()
                    },
                    modifier = Modifier
                        .fillMaxSize()
                        .height(56.dp),
                    enabled = writeLetter != "",
                    shape = RoundedCornerShape(10.dp),
                    border = BorderStroke(1.dp, Color(0xFFECECEC)),
                    colors = ButtonDefaults.buttonColors(if (writeLetter == "") Color.LightGray else colorResource(R.color.main_primary)),
                ) {
                    Text(
                        text = stringResource(R.string.text_write_letter),
                        fontFamily = suit,
                        fontWeight = FontWeight.Bold,
                        fontSize = 18.sp,
                        color = if (writeLetter == "") Color.DarkGray else Color.White
                    )
                }
            }
        }
    }
}