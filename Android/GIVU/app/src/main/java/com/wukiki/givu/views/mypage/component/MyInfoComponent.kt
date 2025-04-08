package com.wukiki.givu.views.mypage.component

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.wukiki.givu.R
import com.wukiki.givu.ui.suit

@Composable
fun MyInfoComponent(
    navController: NavController
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 8.dp)
            .shadow(
                elevation = 1.dp,
                shape = RoundedCornerShape(20.dp),
                clip = true
            ),
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp)
                .padding(bottom = 8.dp)
                .background(Color.White)
        ) {
            Text(
                text = "나의 활동",
                fontFamily = suit,
                fontWeight = FontWeight.ExtraBold,
                fontSize = 18.sp,
                modifier = Modifier.padding(top = 16.dp)
            )
            Spacer(Modifier.height(8.dp))
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(52.dp)
                    .padding(vertical = 4.dp)
                    .clip(shape = RoundedCornerShape(10.dp))
                    .clickable { navController.navigate("MyParticipateFunding") },
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "참여한 펀딩 목록",
                    fontFamily = suit,
                    fontWeight = FontWeight.SemiBold,
                    fontSize = 16.sp,
                    modifier = Modifier.padding(start = 4.dp)
                )

                Spacer(Modifier.weight(1f))

                Icon(
                    painter = painterResource(R.drawable.ic_arrow_forward),
                    contentDescription = null,
                    tint = Color(0xFF8D8686),
                    modifier = Modifier
                        .padding(end = 4.dp)
                        .size(18.dp)
                )

            }
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(52.dp)
                    .padding(vertical = 4.dp)
                    .clip(shape = RoundedCornerShape(10.dp))
                    .clickable { navController.navigate("MyRegisterFunding") },

                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "내가 만든 펀딩 조회",
                    fontFamily = suit,
                    fontWeight = FontWeight.SemiBold,
                    fontSize = 16.sp,
                    modifier = Modifier.padding(start = 4.dp)

                )

                Spacer(Modifier.weight(1f))

                Icon(
                    painter = painterResource(R.drawable.ic_arrow_forward),
                    contentDescription = null,
                    tint = Color(0xFF8D8686),
                    modifier = Modifier
                        .padding(end = 4.dp)
                        .size(18.dp)
                )

            }
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(52.dp)
                    .padding(vertical = 4.dp)
                    .clip(shape = RoundedCornerShape(10.dp))
                    .clickable {

                    },

                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "후원 내역",
                    fontFamily = suit,
                    fontWeight = FontWeight.SemiBold,
                    fontSize = 16.sp,
                    modifier = Modifier.padding(start = 4.dp)

                )

                Spacer(Modifier.weight(1f))

                Icon(
                    painter = painterResource(R.drawable.ic_arrow_forward),
                    contentDescription = null,
                    tint = Color(0xFF8D8686),
                    modifier = Modifier
                        .padding(end = 4.dp)
                        .size(18.dp)
                )

            }

            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(52.dp)
                    .padding(vertical = 4.dp)
                    .clip(shape = RoundedCornerShape(10.dp))
                    .clickable {

                    },

                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "후기",
                    fontFamily = suit,
                    fontWeight = FontWeight.SemiBold,
                    fontSize = 16.sp,
                    modifier = Modifier.padding(start = 4.dp)

                )

                Spacer(Modifier.weight(1f))

                Icon(
                    painter = painterResource(R.drawable.ic_arrow_forward),
                    contentDescription = null,
                    tint = Color(0xFF8D8686),
                    modifier = Modifier
                        .padding(end = 4.dp)
                        .size(18.dp)
                )

            }

        }
    }
}