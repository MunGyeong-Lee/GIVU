package com.wukiki.givu.util

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.Button
import androidx.compose.material.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.colorResource
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.wukiki.givu.R
import com.wukiki.givu.ui.suit

@Composable
fun CommonTopBar() {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .height(60.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {

        IconButton(onClick = {}) {
            Icon(
                painter = painterResource(R.drawable.ic_arrow_back),
                contentDescription = null,
                modifier = Modifier.size(28.dp)
            )
        }
        Spacer(Modifier.weight(1f))
        Text(
            text = "펀딩 생성하기",
            fontFamily = suit,
            fontWeight = FontWeight.Bold,
            fontSize = 20.sp
        )
        Spacer(Modifier.weight(1f))
        IconButton(
            onClick = {},
        ) {
            Icon(painter = painterResource(R.drawable.ic_home), null)
        }

    }
}


@Composable
fun CommonBottomButton(modifier: Modifier) {
    Box(
        modifier = modifier
    ) {
        Button(
            onClick = { },
            modifier = Modifier
                .fillMaxSize()
                .padding(8.dp),
            enabled = true,
            shape = RoundedCornerShape(5.dp),
            border = BorderStroke(1.dp, Color(0xFFECECEC)),
            colors = ButtonDefaults.buttonColors(colorResource(R.color.main_primary)),
            elevation = ButtonDefaults.elevation(0.dp)
            ) {
            Text(
                text = "선물 선택하기",
                fontFamily = suit,
                fontWeight = FontWeight.Bold,
                fontSize = 18.sp,
                color = Color.White
            )
        }
    }
}

@Preview(showBackground = true)
@Composable
private fun test() {
    CommonTopBar()
}