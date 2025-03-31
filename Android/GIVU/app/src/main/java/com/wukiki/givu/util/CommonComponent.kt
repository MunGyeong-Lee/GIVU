package com.wukiki.givu.util

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.wrapContentWidth
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.Button
import androidx.compose.material.ButtonDefaults
import androidx.compose.material.Divider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.drawWithContent
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.PathEffect
import androidx.compose.ui.res.colorResource
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import androidx.navigation.compose.rememberNavController
import androidx.navigation.fragment.NavHostFragment.Companion.findNavController
import androidx.navigation.fragment.findNavController
import com.wukiki.givu.R
import com.wukiki.givu.ui.pretendard
import com.wukiki.givu.ui.suit

@Composable
fun CommonTopBar(
    title: String,
    onBackClick: () -> Unit,
    onHomeClick: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .background(color = Color.White)
            .height(60.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {

        IconButton(onClick = onBackClick) {
            Icon(
                painter = painterResource(R.drawable.ic_arrow_back),
                contentDescription = null,
                modifier = Modifier.size(24.dp)
            )
        }
        Spacer(Modifier.weight(1f))
        Text(
            text = title,
            fontFamily = suit,
            fontWeight = FontWeight.Bold,
            fontSize = 20.sp
        )
        Spacer(Modifier.weight(1f))
        IconButton(
            onClick = onHomeClick,
        ) {
            Icon(painter = painterResource(R.drawable.ic_topbar_home), null)
        }

    }
}


@Composable
fun CommonBottomButton(modifier: Modifier, text: String) {
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
                text = text,
                fontFamily = suit,
                fontWeight = FontWeight.Bold,
                fontSize = 18.sp,
                color = Color.White
            )
        }
    }
}

@Composable
fun StoreItemCategoryComponent(
    name: String, isSelected: Boolean,
    onClick: () -> Unit
) {
    Box(
        modifier = Modifier
            .height(24.dp)
            .wrapContentWidth()
            .clip(shape = RoundedCornerShape(5.dp))
            .background(
                color = if (isSelected) colorResource(R.color.main_secondary)
                else Color(0xFFECECEC)
            )
            .clickable(onClick = onClick),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = name,
            fontFamily = suit,
            fontWeight = FontWeight.Normal,
            fontSize = 12.sp,
            color = if (isSelected) Color.White else Color(0xFF1B1B1B),
            modifier = Modifier.padding(horizontal = 12.dp)
        )

    }
}

@Composable
fun StoreDetailTopBar() {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .height(60.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {

        IconButton(
            onClick = {

            }
        ) {
            Icon(
                painter = painterResource(R.drawable.ic_arrow_back),
                contentDescription = null,
                modifier = Modifier.size(28.dp)
            )

        }
        Spacer(Modifier.weight(1f))
        Text(
            text = "",
            fontFamily = suit,
            fontWeight = FontWeight.Bold,
            fontSize = 20.sp
        )
        Spacer(Modifier.weight(1f))
        IconButton(
            onClick = {},
        ) {
            Icon(painter = painterResource(R.drawable.ic_share), null)
        }

        IconButton(
            onClick = {},
        ) {
            Icon(painter = painterResource(R.drawable.ic_topbar_home), null)
        }

    }
}

@Composable
fun StoreDetailBottomButton(
    modifier: Modifier,
    text: String,
    navController: NavController,
    actionId: Int
) {
    Box(
        modifier = modifier
    ) {
        Row(
            modifier = Modifier
                .fillMaxSize()
                .padding(8.dp),
        ) {

            Column(
                modifier = Modifier
                    .fillMaxWidth(0.15f)
                    .fillMaxHeight(),
                verticalArrangement = Arrangement.Center,
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                IconButton(
                    onClick = {},
                    modifier = Modifier.size(24.dp)
                ) {
                    Icon(
                        painter = painterResource(R.drawable.ic_heart_outline), null,
                        modifier = Modifier.fillMaxSize()
                    )
                }
                Spacer(Modifier.height(4.dp))
                Text(
                    text = "123",
                    fontFamily = pretendard,
                    fontWeight = FontWeight.Medium,
                    fontSize = 14.sp

                )
            }


            Button(
                onClick = { navController.navigate(actionId) },
                modifier = Modifier.fillMaxSize(),
                enabled = true,
                shape = RoundedCornerShape(5.dp),
                border = BorderStroke(1.dp, Color(0xFFECECEC)),
                colors = ButtonDefaults.buttonColors(colorResource(R.color.main_primary)),
                elevation = ButtonDefaults.elevation(0.dp)
            ) {
                Text(
                    text = text,
                    fontFamily = suit,
                    fontWeight = FontWeight.Bold,
                    fontSize = 18.sp,
                    color = Color.White
                )
            }
        }

    }
}

@Composable
fun DottedDivider() {
    Divider(
        modifier = Modifier
            .fillMaxWidth()
            .height(1.dp)
            .drawWithContent {
                drawLine(
                    color = Color.Gray,
                    start = Offset(0f, size.height / 2),
                    end = Offset(size.width, size.height / 2),
                    strokeWidth = 1.dp.toPx(),
                    pathEffect = PathEffect.dashPathEffect(floatArrayOf(3f, 10f))
                )
            }
    )
}

@Composable
fun ReportButton(
    onClick: () -> Unit
) {
    Box(
        modifier = Modifier
            .clickable { onClick }
            .background(Color.White, shape = RoundedCornerShape(20.dp))
            .border(1.dp, Color(0xFFBDBDBD), shape = RoundedCornerShape(20.dp))
            .padding(horizontal = 12.dp, vertical = 8.dp)
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                painter = painterResource(id = R.drawable.ic_report),
                contentDescription = "신고하기",
                tint = Color(0xFFBDBDBD),
                modifier = Modifier.size(16.dp)
            )
            Spacer(modifier = Modifier.width(4.dp))
            Text(
                text = "신고하기",
                fontSize = 16.sp,
                color = Color(0xFFBDBDBD),
                fontWeight = FontWeight.Bold,
                fontFamily = suit
            )
        }
    }
}

@Composable
fun SortButton(
    modifier: Modifier,
    category: String,
    onClick: () -> Unit
) {
    Box(
        modifier = Modifier
            .clickable { onClick() }
            .background(Color.White, shape = RoundedCornerShape(20.dp))
            .border(1.dp, Color(0xFFBDBDBD), shape = RoundedCornerShape(20.dp))
            .padding(horizontal = 12.dp, vertical = 8.dp)
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = category,
                fontSize = 16.sp,
                color = Color(0xFFBDBDBD),
                fontWeight = FontWeight.Bold,
                fontFamily = suit
            )
            Spacer(modifier = Modifier.width(4.dp))
            Icon(
                painter = painterResource(id = R.drawable.ic_dropdown),
                contentDescription = "정렬 선택",
                tint = Color(0xFFBDBDBD),
                modifier = Modifier.size(16.dp)
            )
        }
    }
}

@Composable
fun InfoRow(label: String, value: String) {
    Row {
        Text(
            text = label,
            fontWeight = FontWeight.Bold,
            fontFamily = suit,
            fontSize = 18.sp,
            modifier = Modifier.width(60.dp)
        )
        Text(
            text = value,
            fontWeight = FontWeight.Normal,
            fontFamily = suit,
            fontSize = 18.sp,
        )
    }
}

@Preview(showBackground = true)
@Composable
private fun TestPreview() {

}