package com.wukiki.givu.views.detail.component

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.wukiki.givu.R
import com.wukiki.givu.views.detail.viewmodel.FundingViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun LetterSortBottomSheet(
    onDismissRequest: () -> Unit,
    fundingViewModel: FundingViewModel
) {
    val sortOptions = listOf("최신순", "오래된순", "이름순")

    ModalBottomSheet(
        onDismissRequest = onDismissRequest,
        dragHandle = null,
        shape = RoundedCornerShape(topStart = 16.dp, topEnd = 16.dp),
        containerColor = Color.White
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = 8.dp)
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 12.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "후기 정렬 기준",
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold
                )
                IconButton(onClick = { onDismissRequest() }) {
                    Icon(
                        painter = painterResource(R.drawable.ic_close),
                        contentDescription = "닫기"
                    )
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            sortOptions.forEach { option ->
                Column {
                    Text(
                        text = option,
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable {
                                fundingViewModel.sortLetters(option)
                                onDismissRequest()
                            }
                            .padding(horizontal = 16.dp, vertical = 14.dp),
                        fontSize = 16.sp
                    )
                    HorizontalDivider(color = Color(0xFFECECEC), thickness = 1.dp)
                }
            }
        }
    }
}