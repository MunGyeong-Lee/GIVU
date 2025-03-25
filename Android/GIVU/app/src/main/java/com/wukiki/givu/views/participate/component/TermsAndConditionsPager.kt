package com.wukiki.givu.views.participate.component

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Checkbox
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.colorResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.wukiki.givu.R
import com.wukiki.givu.ui.suit

@Composable
fun TermsAndConditionsPager(
    btnText: String,
    navController: NavController,
    actionId: Int
) {
    Column(modifier = Modifier.fillMaxWidth()) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Checkbox(checked = false, onCheckedChange = {})
            Text(
                modifier = Modifier.weight(1F),
                text = "개인정보 제3자 제공 동의",
                fontSize = 16.sp,
                fontWeight = FontWeight.Medium,
                fontFamily = suit,
                color = Color.Black
            )
            Text(
                text = "내용 보기 >",
                fontSize = 14.sp,
                fontWeight = FontWeight.Medium,
                fontFamily = suit,
                color = Color.Black
            )
        }
        Row(verticalAlignment = Alignment.CenterVertically) {
            Checkbox(checked = false, onCheckedChange = {})
            Text(
                modifier = Modifier.weight(1F),
                text = "펀딩 유의사항 확인",
                fontSize = 16.sp,
                fontWeight = FontWeight.Medium,
                fontFamily = suit,
                color = Color.Black
            )
        }
        Spacer(modifier = Modifier.height(4.dp))
        Text(
            modifier = Modifier.padding(horizontal = 16.dp),
            text = "· 펀딩은 직접 구매가 아닌 사용자의 구매 계획에 자금을 지원하는 일입니다.",
            fontSize = 15.sp,
            fontWeight = FontWeight.Medium,
            fontFamily = suit,
            color = Color.Black
        )
        Spacer(modifier = Modifier.height(2.dp))
        Text(
            modifier = Modifier.padding(horizontal = 16.dp),
            text = "GIVU에서의 펀딩은 사용자의 구매가 실현될 수 있도록 자금을 후원하는 과정으로, 기존의 상품을 거래의 대상으로 하는 매매와는 차이가 있습니다. 따라서 전자상거래법상 청약철회 등의 규정이 적용되지 않습니다.",
            fontSize = 14.sp,
            fontWeight = FontWeight.Medium,
            fontFamily = suit,
            color = Color.Black
        )
        Spacer(modifier = Modifier.height(2.dp))
        Text(
            modifier = Modifier.padding(horizontal = 16.dp),
            text = "· 펀딩 프로젝트는 계획과 다르게 진행될 수 있습니다.",
            fontSize = 15.sp,
            fontWeight = FontWeight.Medium,
            fontFamily = suit,
            color = Color.Black
        )
        Spacer(modifier = Modifier.height(2.dp))
        Text(
            modifier = Modifier.padding(horizontal = 16.dp),
            text = "진행 과정에서 계획이 지연, 변경되거나 무산될 수도 있습니다. 펀딩을 완수할 팩임과 권리는 펀딩을 생성한 사용자에게 있습니다.",
            fontSize = 14.sp,
            fontWeight = FontWeight.Medium,
            fontFamily = suit,
            color = Color.Black
        )

        Spacer(modifier = Modifier.height(16.dp))
        Button(
            onClick = { navController.navigate(actionId) },
            modifier = Modifier.fillMaxSize().height(56.dp),
            enabled = true,
            shape = RoundedCornerShape(10.dp),
            border = BorderStroke(1.dp, Color(0xFFECECEC)),
            colors = ButtonDefaults.buttonColors(colorResource(R.color.main_primary)),
        ) {
            Text(
                text = btnText,
                fontFamily = suit,
                fontWeight = FontWeight.Bold,
                fontSize = 18.sp,
                color = Color.White
            )
        }
    }
}