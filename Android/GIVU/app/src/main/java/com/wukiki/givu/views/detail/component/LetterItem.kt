package com.wukiki.givu.views.detail.component

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.wukiki.domain.model.Letter

@Composable
fun LetterItem(letter: Letter) {
    Column(modifier = Modifier.padding(vertical = 8.dp)) {
        Text(text = letter.userId, fontWeight = FontWeight.Bold)
        Text(text = letter.comment)
        Text(text = letter.createdAt, fontSize = 12.sp, color = Color.Gray)
    }
}