package com.wukiki.givu.views.detail.component

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.material.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
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

@Composable
fun LetterItem(letter: Letter) {
    Column(
        modifier = Modifier.padding(vertical = 8.dp)
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                painter = painterResource(R.drawable.ic_profile),
                contentDescription = "Funding Letter"
            )
            Spacer(modifier = Modifier.width(4.dp))
            Text(
                modifier = Modifier.weight(1F),
                text = letter.userNickname,
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                fontFamily = suit
            )
            Icon(
                painter = painterResource(R.drawable.ic_comment_menu),
                contentDescription = "Comment Menu"
            )
        }
        Spacer(modifier = Modifier.height(16.dp))
        Text(
            text = letter.comment,
            fontSize = 16.sp,
            fontWeight = FontWeight.Medium,
            fontFamily = suit,
            maxLines = 2,
            minLines = 2
        )
        Spacer(modifier = Modifier.height(16.dp))
        Text(
            text = letter.createdAt,
            fontSize = 14.sp,
            color = Color.Gray,
            fontWeight = FontWeight.Medium,
            fontFamily = suit
        )
    }
}