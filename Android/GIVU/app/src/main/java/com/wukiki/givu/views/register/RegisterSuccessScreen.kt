package com.wukiki.givu.views.register

import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.wukiki.givu.R
import com.wukiki.givu.util.CommonBottomButton
import com.wukiki.givu.util.CommonTopBar
import com.wukiki.givu.views.register.viewmodel.RegisterViewModel

@Composable
fun RegisterSuccessScreen(
    registerViewModel: RegisterViewModel,
    navController: NavController,
    xmlNavController: NavController
) {
    Scaffold(
        topBar = {
            CommonTopBar(
                title = "펀딩 생성 완료",
                onBackClick = { navController.popBackStack() },
                onHomeClick = { xmlNavController.navigate(R.id.fragment_home) }
            )
        },
        containerColor = Color.White
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .padding(paddingValues)
                .fillMaxSize(),
            verticalArrangement = Arrangement.Center,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Image(
                painter = painterResource(id = R.drawable.ic_success),
                contentDescription = "펀딩 완료 이미지",
                modifier = Modifier.size(180.dp)
            )

            Spacer(modifier = Modifier.height(24.dp))

            Text(
                text = "펀딩이 시작되었어요.",
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold
            )

            Spacer(modifier = Modifier.height(24.dp))

            Button(
                onClick = { xmlNavController.popBackStack() },
                shape = RoundedCornerShape(10.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFF88383))
            ) {
                Text(
                    text = "펀딩 확인하기",
                    color = Color.White,
                    fontWeight = FontWeight.Bold
                )
            }
        }
    }
}