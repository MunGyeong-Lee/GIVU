package com.wukiki.givu.views.detail.component

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.wukiki.domain.model.Letter
import com.wukiki.givu.R
import com.wukiki.givu.ui.suit
import com.wukiki.givu.util.DottedDivider
import com.wukiki.givu.util.SortButton
import com.wukiki.givu.views.detail.viewmodel.FundingViewModel

@Composable
fun LetterListPager(
    fundingViewModel: FundingViewModel,
    letters: List<Letter>
) {
    val letterSort by fundingViewModel.letterSort.collectAsState()
    val showSheet = remember { mutableStateOf(false) }

    Column(
        modifier = Modifier.padding(16.dp))
    {
        Row(
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                painter = painterResource(R.drawable.ic_funding_letter),
                contentDescription = "Funding Letter"
            )
            Spacer(modifier = Modifier.width(4.dp))
            Text(
                modifier = Modifier.weight(1F),
                text = "축하 편지",
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                fontFamily = suit
            )
            if (letters.isNotEmpty()) {
                SortButton(
                    modifier = Modifier,
                    category = letterSort
                ) {
                    showSheet.value = true
                }
            }
        }

        Spacer(modifier = Modifier.height(8.dp))

        when (letters.isEmpty()) {
            true -> {
                Spacer(modifier = Modifier.height(32.dp))
                Box(
                    modifier = Modifier
                        .fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "작성된 편지가 없습니다.",
                        fontFamily = suit,
                        fontWeight = FontWeight.Bold,
                        fontSize = 20.sp,
                        color = Color.DarkGray
                    )
                }
            }

            else -> {
                letters.forEach { letter ->
                    LetterItem(letter, fundingViewModel)
                    DottedDivider()
                }
            }
        }
    }

    if (showSheet.value) {
        LetterSortBottomSheet(
            onDismissRequest = { showSheet.value = false },
            fundingViewModel = fundingViewModel
        )
    }
}