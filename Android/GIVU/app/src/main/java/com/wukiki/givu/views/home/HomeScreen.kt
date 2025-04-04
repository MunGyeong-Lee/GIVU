package com.wukiki.givu.views.home

import android.widget.Toast
import androidx.compose.foundation.border
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.KeyboardArrowUp
import androidx.compose.material3.Button
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.FloatingActionButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.derivedStateOf
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.colorResource
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.wukiki.givu.R
import com.wukiki.givu.ui.suit
import com.wukiki.givu.views.home.component.FriendFundingListPager
import com.wukiki.givu.views.home.component.FundingAllPager
import com.wukiki.givu.views.home.component.HomeAppBarPager
import com.wukiki.givu.views.home.component.PopularFundingListPager
import com.wukiki.givu.views.home.component.SearchBarItem
import com.wukiki.givu.views.home.viewmodel.HomeUiEvent
import com.wukiki.givu.views.home.viewmodel.HomeViewModel
import kotlinx.coroutines.launch

@Composable
fun HomeScreen(
    homeViewModel: HomeViewModel,
    navController: NavController
) {
    val context = LocalContext.current
    val user by homeViewModel.user.collectAsState()
    val popularFundings by homeViewModel.popularFundings.collectAsState()
    val homeUiEvent = homeViewModel.homeUiEvent

    LaunchedEffect(Unit) {
        homeUiEvent.collect { event ->
            when (event) {
                is HomeUiEvent.AutoLoginFail -> {
                    Toast.makeText(
                        context,
                        context.getString(R.string.message_auto_login_fail),
                        Toast.LENGTH_SHORT
                    ).show()
                }

                else -> {}
            }
        }
    }

    Scaffold(
        floatingActionButton = {
            Column(
                horizontalAlignment = Alignment.CenterHorizontally
            ) {

                if (user != null) {
                    FloatingActionButton(
                        onClick = {
                            navController.navigate(R.id.action_home_to_register_funding)
                        },
                        containerColor = colorResource(id = R.color.main_primary),
                        modifier = Modifier
                            .padding(bottom = 20.dp)
                            .border(
                                (0.5).dp, Color(0xFFBFE0EF),
                                RoundedCornerShape(30.dp)
                            )
                            .clip(shape = RoundedCornerShape(30.dp)),
                        interactionSource = remember { MutableInteractionSource() },
                    ) {
                        Icon(
                            painter = painterResource(id = R.drawable.ic_add_plus),
                            contentDescription = null,
                            tint = Color.White,
                            modifier = Modifier.size(32.dp)
                        )
                    }
                }
            }
        },
        containerColor = Color.White
    ) { contentPadding ->

        LazyColumn(
            
            modifier = Modifier
                .fillMaxWidth()
                .padding(contentPadding)
        ) {
            item {
                HomeAppBarPager(navController, user)
                Spacer(modifier = Modifier.height(4.dp))
                SearchBarItem(navController)
            }
            item {
                Spacer(modifier = Modifier.height(16.dp))
                Text(
                    text = stringResource(id = R.string.text_popular_funding),
                    fontSize = 24.sp,
                    fontWeight = FontWeight.Bold,
                    fontFamily = suit
                )
                PopularFundingListPager(homeViewModel, navController)
            }
            if (user != null) {
                item {
                    Spacer(modifier = Modifier.height(16.dp))
                    Text(
                        text = stringResource(id = R.string.text_my_friends_funding),
                        fontSize = 24.sp,
                        fontWeight = FontWeight.Bold,
                        fontFamily = suit
                    )
                    FriendFundingListPager(popularFundings)
                }
            }
            item {
                Spacer(modifier = Modifier.height(16.dp))
                Text(
                    text = stringResource(id = R.string.text_funding_list),

                    fontSize = 24.sp,
                    fontWeight = FontWeight.Bold,
                    fontFamily = suit
                )
                Spacer(modifier = Modifier.height(8.dp))
                FundingAllPager(homeViewModel, navController)
            }
        }
    }
}