package com.wukiki.givu.views.mypage

import android.widget.Toast
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.wrapContentHeight
import androidx.compose.foundation.pager.HorizontalPager
import androidx.compose.foundation.pager.rememberPagerState
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.Button
import androidx.compose.material.ButtonDefaults
import androidx.compose.material.TabRowDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.ScrollableTabRow
import androidx.compose.material3.Surface
import androidx.compose.material3.Tab
import androidx.compose.material3.TabRowDefaults.tabIndicatorOffset
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
import com.wukiki.givu.views.mypage.component.BankAccountChargeItem
import kotlinx.coroutines.launch

@Composable
fun ChargeAccountScreen(
    homeViewModel: HomeViewModel,
    navController: NavController
) {
    val context = LocalContext.current
    val user by homeViewModel.user.collectAsState()
    val charge by homeViewModel.charge.collectAsState()
    val homeUiEvent = homeViewModel.homeUiEvent

    val tabTitles = listOf("연동 계좌")
    val pagerState = rememberPagerState(
        initialPage = 0,
        initialPageOffsetFraction = 0F,
        pageCount = { tabTitles.size }
    )
    val coroutineScope = rememberCoroutineScope()

    val notices = listOf(
        "은행계좌 간편결제로 GIVU 페이를 충전하여 다양한 사용처에서 편리하게 이용하실 수 있습니다.",
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
                is HomeUiEvent.WithdrawalSuccess -> {
                    Toast.makeText(
                        context,
                        context.getString(R.string.message_charge_account_success),
                        Toast.LENGTH_SHORT
                    ).show()
                    navController.popBackStack()
                }

                is HomeUiEvent.WithdrawalFail -> {
                    Toast.makeText(
                        context,
                        context.getString(R.string.message_charge_account_fail),
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
                stringResource(R.string.title_charge_account),
                onBackClick = {},
                onHomeClick = {}
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
                        onClick = { homeViewModel.withdrawAccount() },
                        modifier = Modifier.fillMaxSize(),
                        enabled = charge > 0,
                        shape = RoundedCornerShape(5.dp),
                        border = BorderStroke(1.dp, Color(0xFFECECEC)),
                        colors = ButtonDefaults.buttonColors(if (charge == 0) Color.LightGray else colorResource(R.color.main_primary)),
                        elevation = ButtonDefaults.elevation(0.dp)
                    ) {
                        Text(
                            text = stringResource(R.string.text_charge_account),
                            fontFamily = suit,
                            fontWeight = FontWeight.Bold,
                            fontSize = 18.sp,
                            color = if (charge == 0) Color.DarkGray else Color.White
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

            ScrollableTabRow(
                modifier = Modifier.background(Color.White),
                selectedTabIndex = pagerState.currentPage,
                containerColor = Color.White,
                contentColor = colorResource(R.color.main_primary),
                edgePadding = 8.dp,
                indicator = { tabPositions ->
                    TabRowDefaults.Indicator(
                        modifier = Modifier.tabIndicatorOffset(tabPositions[pagerState.currentPage]),
                        color = colorResource(R.color.main_primary)
                    )
                },
                divider = {}
            ) {
                tabTitles.forEachIndexed { index, title ->
                    Tab(
                        selected = pagerState.currentPage == index,
                        onClick = { coroutineScope.launch { pagerState.animateScrollToPage(index) } },
                        text = { Text(
                            text = title,
                            fontWeight = FontWeight.Bold,
                            fontFamily = suit
                        ) }
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            HorizontalPager(
                state = pagerState,
                modifier = Modifier
                    .fillMaxWidth()
                    .wrapContentHeight()
            ) { page ->
                when (page) {
                    0 -> BankAccountChargeItem(homeViewModel)
                }
            }

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