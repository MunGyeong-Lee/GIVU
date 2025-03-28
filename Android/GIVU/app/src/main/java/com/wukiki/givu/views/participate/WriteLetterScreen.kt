package com.wukiki.givu.views.participate

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
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.colorResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.NavController
import com.wukiki.givu.R
import com.wukiki.givu.ui.suit
import com.wukiki.givu.util.CommonTopBar
import com.wukiki.givu.util.InfoRow
import com.wukiki.givu.views.detail.viewmodel.FundingViewModel
import com.wukiki.givu.views.participate.component.FundingInfoPager

@Composable
fun WriteLetterScreen(
    fundingViewModel: FundingViewModel = hiltViewModel(),
    navController: NavController
) {
    val funding by fundingViewModel.selectedFunding.collectAsState()
    val writeLetter by fundingViewModel.writeLetter.collectAsState()

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
                    InfoRow("이름", "김싸피")
                    InfoRow("이메일", "kimssafy@ssafy.com")
                    InfoRow("연락처", "010-0000-0000")
                    InfoRow("금액", "1,000원")
                }

                Spacer(modifier = Modifier.height(16.dp))

                Button(
                    onClick = { navController.navigate(R.id.action_write_letter_to_complete_funding) },
                    modifier = Modifier
                        .fillMaxSize()
                        .height(56.dp),
                    enabled = true,
                    shape = RoundedCornerShape(10.dp),
                    border = BorderStroke(1.dp, Color(0xFFECECEC)),
                    colors = ButtonDefaults.buttonColors(colorResource(R.color.main_primary)),
                ) {
                    Text(
                        text = stringResource(R.string.text_write_letter),
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