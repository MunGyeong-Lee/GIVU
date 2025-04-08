package com.wukiki.givu.views.mypage.component

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.colorResource
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.wukiki.givu.R
import com.wukiki.givu.ui.lusitana
import com.wukiki.givu.ui.pretendard
import com.wukiki.givu.ui.suit
import com.wukiki.givu.util.CommonUtils
import com.wukiki.givu.views.home.viewmodel.HomeViewModel

@Composable
fun PayComponent(
    homeViewModel: HomeViewModel,
    navController: NavController,
    xmlNavController: NavController
) {
    val user by homeViewModel.user.collectAsState()

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 8.dp, vertical = 16.dp)
            .shadow(
                elevation = 1.dp,
                shape = RoundedCornerShape(20.dp),
                clip = true
            ),
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .height(96.dp)
                .padding(8.dp)
                .clip(shape = RoundedCornerShape(10.dp))
                .clickable {
                    if (user != null) {
                        navController.navigate("UserInfoScreen")
                    }
                    else {
                        xmlNavController.navigate(R.id.action_fragment_my_page_to_fragment_login)
                    }
                },
            verticalAlignment = Alignment.CenterVertically,

            ) {
            Image(
                painter = painterResource(R.drawable.ic_profile_default),
                contentDescription = null,
                modifier = Modifier
                    .padding(start = 16.dp)
                    .size(60.dp)
            )
            Spacer(Modifier.width(16.dp))

            Text(
                text = user?.nickname ?: "로그인해주세요.",
                fontFamily = suit,
                fontWeight = FontWeight.Bold,
                fontSize = 20.sp
            )
        }

        HorizontalDivider(color = Color(0xFFEFEFEF))

        Row(
            modifier = Modifier
                .fillMaxWidth()
                .height(72.dp)
                .padding(8.dp)
                .clip(shape = RoundedCornerShape(10.dp))
                .clickable {
                    navController.navigate("PayUsageScreen")
                },
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Spacer(Modifier.width(16.dp))

            Text(
                text = "GIVU pay",
                fontFamily = lusitana,
                fontWeight = FontWeight.Bold,
                fontSize = 17.sp,
                color = colorResource(R.color.main_primary)
            )

            Spacer(Modifier.width(24.dp))

            Text(
                text = CommonUtils.makeCommaPrice((user?.balance ?: "0").toInt()),
                fontFamily = pretendard,
                fontWeight = FontWeight.Bold,
                fontSize = 24.sp,
            )
            Spacer(Modifier.width(8.dp))
            Icon(
                painter = painterResource(R.drawable.ic_arrow_forward),
                contentDescription = null,
                tint = Color(0xFF8D8686),
                modifier = Modifier.size(18.dp)
            )
        }

        Row(modifier = Modifier.fillMaxWidth()) {
            Spacer(Modifier.width(24.dp))
            Box(
                modifier = Modifier
                    .height(52.dp)
                    .weight(1f)
                    .background(
                        color = Color(0xFFE8ECEF),
                        shape = RoundedCornerShape(10.dp)
                    )
                    .clip(shape = RoundedCornerShape(10.dp))
                    .clickable(
                        interactionSource = remember { MutableInteractionSource() },
                        indication = null,
                        onClick = {
                            navController.navigate("ChargeAccount")
                        }
                    ),
                contentAlignment = Alignment.Center

            ) {
                Text(
                    text = "충전",
                    fontFamily = suit,
                    fontWeight = FontWeight.Bold,
                    fontSize = 20.sp
                )
            }

            Spacer(Modifier.width(12.dp))

            Box(
                modifier = Modifier
                    .height(52.dp)
                    .weight(1f)
                    .background(
                        color = Color(0xFFE8ECEF),
                        shape = RoundedCornerShape(10.dp)
                    )
                    .clip(shape = RoundedCornerShape(10.dp))
                    .clickable(
                        interactionSource = remember { MutableInteractionSource() },
                        indication = null,
                        onClick = {

                        }
                    ),
                contentAlignment = Alignment.Center

            ) {
                Text(
                    text = "송금",
                    fontFamily = suit,
                    fontWeight = FontWeight.Bold,
                    fontSize = 20.sp
                )
            }
            Spacer(Modifier.width(24.dp))
        }

        Spacer(Modifier.height(16.dp))
    }
}