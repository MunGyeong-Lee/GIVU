package com.wukiki.givu.views.mypage.component

import android.widget.Toast
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.pager.rememberPagerState
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.Button
import androidx.compose.material.ButtonDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.colorResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.wukiki.givu.R
import com.wukiki.givu.ui.suit
import com.wukiki.givu.util.CommonTopBar
import com.wukiki.givu.util.CommonUtils.makeCommaPrice
import com.wukiki.givu.views.home.viewmodel.HomeUiEvent
import com.wukiki.givu.views.home.viewmodel.HomeViewModel

@Composable
fun DepositAccountScreen(
    homeViewModel: HomeViewModel,
    navController: NavController,
    xmlNavController: NavController,
    onRequestFingerprint: () -> Unit
) {
    val context = LocalContext.current
    val user by homeViewModel.user.collectAsState()
    val deposit by homeViewModel.deposit.collectAsState()
    val homeUiEvent = homeViewModel.homeUiEvent

    val notices = listOf(
        "GIVU 페이에서 연동 계쫘로 입금하실 수 있습니다.",
        "출금계좌는 사전에 등록되어 있어야 하며, 계좌 등록은 [계좌 관리] 메뉴에서 가능합니다.",
        "포인트는 최대 100만P까지 보유할 수 있습니다. 보유 포인트가 100만P를 초과하면 충전이 제한됩니다.",
        "1회 최대 충전 금액은 50만P입니다.",
        "최소 충전 금액은 1만P이며, 충전 단위는 1천P입니다.",
        "충전 진행 중에는 은행 점검 등 사유로 일시적으로 충전이 제한될 수 있습니다.",
        "GIVU 페이는 이벤트 참여 등으로 적립된 포인트와 충전 포인트로 구성되며, 일부 포인트는 인출 및 환불이 불가능할 수 있습니다."
    )

    LaunchedEffect(Unit) {
        homeUiEvent.collect { event ->
            when (event) {
                is HomeUiEvent.DepositSuccess -> {
                    Toast.makeText(
                        context,
                        context.getString(R.string.message_deposit_account_success),
                        Toast.LENGTH_SHORT
                    ).show()
                    navController.popBackStack()
                }

                is HomeUiEvent.DepositFail -> {
                    Toast.makeText(
                        context,
                        context.getString(R.string.message_deposit_account_fail),
                        Toast.LENGTH_SHORT
                    ).show()
                }

                else -> {}
            }
        }
    }

    Scaffold(
        topBar = {
            CommonTopBar(
                stringResource(R.string.title_deposit_account),
                onBackClick = {
                    navController.popBackStack()
                },
                onHomeClick = {
                    xmlNavController.popBackStack(
                        xmlNavController.graph.startDestinationId,
                        true
                    )
                    xmlNavController.navigate(R.id.fragment_home)
                }
            )
        },
        containerColor = Color(0xFFF3F4F6),
        bottomBar = {
            Surface(
                modifier = Modifier.fillMaxWidth(),
                shadowElevation = 16.dp,
                color = Color.White
            ) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(68.dp),
                ) {
                    Button(
                        onClick = onRequestFingerprint,
                        modifier = Modifier.fillMaxSize(),
                        enabled = deposit > 0,
                        shape = RoundedCornerShape(5.dp),
                        border = BorderStroke(1.dp, Color(0xFFECECEC)),
                        colors = ButtonDefaults.buttonColors(if (deposit == 0) Color.LightGray else colorResource(
                            R.color.main_primary)
                        ),
                        elevation = ButtonDefaults.elevation(0.dp)
                    ) {
                        Text(
                            text = stringResource(R.string.text_deposit_account),
                            fontFamily = suit,
                            fontWeight = FontWeight.Bold,
                            fontSize = 18.sp,
                            color = if (deposit == 0) Color.DarkGray else Color.White
                        )
                    }
                }
            }
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .padding(paddingValues)
                .verticalScroll(rememberScrollState())
                .fillMaxSize()
                .padding(16.dp)
        ) {
            Spacer(modifier = Modifier.height(16.dp))

            Text(
                text = "GIVU Pay 잔액",
                fontWeight = FontWeight.Bold,
                fontFamily = suit,
                fontSize = 18.sp
            )
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = makeCommaPrice((user?.balance ?: "0").toInt()),
                color = Color(0xFFFF2E79),
                fontWeight = FontWeight.Bold,
                fontFamily = suit,
                fontSize = 28.sp
            )

            Spacer(modifier = Modifier.height(24.dp))

            BankAccountDepositItem(homeViewModel)

            Spacer(modifier = Modifier.height(16.dp))

            Text(
                text = "이용안내",
                fontWeight = FontWeight.Bold,
                fontSize = 16.sp,
                modifier = Modifier.padding(vertical = 16.dp)
            )

            notices.forEach {
                Text(
                    "• $it", fontSize = 14.sp, lineHeight = 20.sp)
            }
        }
    }
}