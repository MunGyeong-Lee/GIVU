package com.wukiki.givu.views.home

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.wukiki.givu.R
import com.wukiki.givu.ui.suit

@Composable
fun CategoryTagItem(category: String) {
    Box(
        modifier = Modifier
            .background(Color.LightGray, shape = RoundedCornerShape(10.dp))
            .padding(horizontal = 12.dp, vertical = 2.dp)
    ) {
        Text(
            text = "생일",
            fontSize = 14.sp,
            fontWeight = FontWeight.Medium,
            fontFamily = suit,
            color = Color.Black
        )
    }
}