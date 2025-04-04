package com.wukiki.givu.views.mypage

import android.widget.Toast
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.colorResource
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.wukiki.givu.R
import com.wukiki.givu.ui.pretendard
import com.wukiki.givu.ui.suit
import com.wukiki.givu.views.home.viewmodel.HomeUiEvent
import com.wukiki.givu.views.home.viewmodel.HomeViewModel
import com.wukiki.givu.views.mypage.component.MyInfoComponent
import com.wukiki.givu.views.mypage.component.PayComponent

@Composable
fun MyPageScreen(
    homeViewModel: HomeViewModel,
    navController: NavController
) {
    val context = LocalContext.current
    val user by homeViewModel.user.collectAsState()
    val homeUiEvent = homeViewModel.homeUiEvent

    LaunchedEffect(Unit) {
        homeUiEvent.collect { event ->
            when (event) {
                is HomeUiEvent.Logout -> {
                    Toast.makeText(
                        context,
                        context.getString(R.string.message_logout_success),
                        Toast.LENGTH_SHORT
                    ).show()
                }

                else -> {}
            }
        }
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF3F4F6))
            .padding(16.dp)
    ) {
        MyPageTopBar()
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(top = 60.dp)
                .verticalScroll(rememberScrollState())
        ) {
            PayComponent(homeViewModel, navController)
            MyInfoComponent(navController)
            Spacer(modifier = Modifier.height(16.dp))
            if (user != null) {
                Button(
                    onClick = {
                        homeViewModel.logout()
                    },
                    modifier = Modifier
                        .fillMaxSize()
                        .height(56.dp),
                    shape = RoundedCornerShape(10.dp),
                    border = BorderStroke(1.dp, Color(0xFFECECEC)),
                    colors = ButtonDefaults.buttonColors(colorResource(R.color.main_primary)),
                ) {
                    Text(
                        text = "로그아웃",
                        fontFamily = suit,
                        fontWeight = FontWeight.Bold,
                        fontSize = 18.sp,
                        color = Color.White
                    )
                }
            }
        }
    }
}

@Composable
private fun MyPageTopBar() {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .height(60.dp)
            .padding(horizontal = 8.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Text(
            text = "My GIVU",
            fontFamily = pretendard,
            fontWeight = FontWeight.Bold,
            fontSize = 22.sp
        )
        Icon(
            painterResource(R.drawable.ic_setting),
            contentDescription = null
        )
    }
}
