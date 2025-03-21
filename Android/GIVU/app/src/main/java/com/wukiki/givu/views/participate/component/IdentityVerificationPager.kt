package com.wukiki.givu.views.participate.component

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.TextField
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.colorResource
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.wukiki.givu.R
import com.wukiki.givu.ui.suit

@Composable
fun IdentityVerificationPager() {
    Column(
        modifier = Modifier.fillMaxWidth()
    ) {
        Text(text = "본인 인증하기", fontSize = 18.sp, fontWeight = FontWeight.Bold)
        Spacer(modifier = Modifier.height(8.dp))

        var verificationCode by remember { mutableStateOf("") }

        Row {
            BasicTextField(
                value = "",
                onValueChange = {  },
                textStyle = TextStyle(
                    color = Color.Black,
                    fontSize = 16.sp
                ),
                modifier = Modifier
                    .weight(1F)
                    .height(56.dp)
                    .background(Color(0xFFD6D6D6), shape = RoundedCornerShape(50.dp)) // 배경색 + 둥근 모서리
                    .padding(horizontal = 16.dp, vertical = 12.dp),
                decorationBox = { innerTextField ->
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier.padding(horizontal = 16.dp)
                    ) {
                        Text(
                            text = "인증번호를 입력하세요",
                            color = Color.Gray,
                            fontSize = 16.sp
                        )
                        innerTextField()
                    }
                }
            )
            Spacer(modifier = Modifier.width(8.dp))
            Button(
                onClick = {  },
                modifier = Modifier.height(56.dp),
                enabled = true,
                shape = RoundedCornerShape(10.dp),
                border = BorderStroke(1.dp, Color(0xFFECECEC)),
                colors = ButtonDefaults.buttonColors(colorResource(R.color.main_primary)),
            ) {
                Text(
                    text = "전송",
                    fontFamily = suit,
                    fontWeight = FontWeight.Bold,
                    fontSize = 18.sp,
                    color = Color.White
                )
            }
        }

        Spacer(modifier = Modifier.height(8.dp))

        Button(
            onClick = {  },
            modifier = Modifier.fillMaxSize().height(56.dp),
            enabled = true,
            shape = RoundedCornerShape(10.dp),
            border = BorderStroke(1.dp, Color(0xFFECECEC)),
            colors = ButtonDefaults.buttonColors(colorResource(R.color.main_primary)),
        ) {
            Text(
                text = "인증번호 받기",
                fontFamily = suit,
                fontWeight = FontWeight.Bold,
                fontSize = 18.sp,
                color = Color.White
            )
        }
    }
}