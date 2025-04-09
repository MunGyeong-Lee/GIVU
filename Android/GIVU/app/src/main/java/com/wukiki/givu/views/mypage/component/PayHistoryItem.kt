package com.wukiki.givu.views.mypage.component

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.colorResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.wukiki.domain.model.Payment
import com.wukiki.givu.R
import com.wukiki.givu.ui.pretendard
import com.wukiki.givu.ui.suit
import com.wukiki.givu.util.CommonUtils

@Composable
fun PayHistoryItem(
    paymentHistory: Payment
) {
    val isPlus = paymentHistory.transactionType == "환불"

    val dateParts = paymentHistory.date.split(" ")
    val (year, month, day) = dateParts[0].split(".")
    val time = dateParts[1]
    val dayFormatted = "$month.$day"

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .height(64.dp)
            .clip(shape = RoundedCornerShape(10.dp))
            .clickable {

            }
            .padding(horizontal = 20.dp, vertical = 8.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(
            text = "${year}\n${dayFormatted}",
            fontFamily = pretendard,
            fontWeight = FontWeight.SemiBold,
            fontSize = 14.sp,
            color = Color(0xFF888888),
            textAlign = TextAlign.Center
        )
        Spacer(Modifier.width(20.dp))
        Column(
            modifier = Modifier.fillMaxHeight(),
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            Text(
                text = paymentHistory.fundingTitle,
                fontFamily = suit,
                fontWeight = FontWeight.Bold,
                fontSize = 17.sp,
            )
            Spacer(Modifier.height(8.dp))
            Text(
                text = time,
                fontFamily = pretendard,
                fontWeight = FontWeight.Normal,
                fontSize = 13.sp,
                color = Color(0xFF888888)
            )
        }
        Spacer(Modifier.weight(1f))
        Column(
            modifier = Modifier.fillMaxHeight(),
            horizontalAlignment = Alignment.End,
            verticalArrangement = Arrangement.Center
        ) {
            Text(
                text = (if (isPlus) "+" else "-") + CommonUtils.makeCommaPrice(paymentHistory.amount),
                fontFamily = pretendard,
                fontWeight = FontWeight.SemiBold,
                fontSize = 18.sp,
                color = if (isPlus) colorResource(R.color.main_secondary) else Color.Black

            )
        }
    }
}
