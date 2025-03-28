package com.wukiki.givu.views.finish.component

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Text
import androidx.compose.material3.TextField
import androidx.compose.material3.TextFieldDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import com.wukiki.givu.R
import com.wukiki.givu.ui.suit
import com.wukiki.givu.views.detail.viewmodel.FundingViewModel

@Composable
fun FinishFundingReviewPager(
    fundingViewModel: FundingViewModel = hiltViewModel()
) {
    val fundingReview by fundingViewModel.fundingReview.collectAsState()

    Column(
        modifier = Modifier.fillMaxWidth()
    ) {
        Text(
            text = stringResource(R.string.title_finish_funding_review),
            fontSize = 18.sp,
            fontWeight = FontWeight.Bold,
            fontFamily = suit
        )

        Spacer(modifier = Modifier.height(8.dp))

        TextField(
            value = fundingReview,
            onValueChange = { fundingViewModel.fundingReview.value = it },
            placeholder = { Text(stringResource(R.string.text_hint_finish_funding_review)) },
            modifier = Modifier.fillMaxWidth()
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
    }
}