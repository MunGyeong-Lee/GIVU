package com.wukiki.givu.views.register

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.wrapContentHeight
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.Divider
import androidx.compose.material3.Icon
import androidx.compose.material3.Scaffold
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.colorResource
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.wukiki.givu.R
import com.wukiki.givu.ui.pretendard
import com.wukiki.givu.ui.suit
import com.wukiki.givu.util.CommonBottomButton
import com.wukiki.givu.util.CommonTopBar
import com.wukiki.givu.util.StoreDetailBottomButton
import com.wukiki.givu.views.detail.component.DetailFundingContent
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun RegisterInputScreen(navController: NavController, xmlNavController: NavController) {

    data class CategoryItem(val iconId: Int, val label: String)

    val categoryList = listOf(
        CategoryItem(R.drawable.ic_category_birthday, "생일"),
        CategoryItem(R.drawable.ic_category_house, "집들이"),
        CategoryItem(R.drawable.ic_category_marriage, "결혼"),
        CategoryItem(R.drawable.ic_category_graduate, "졸업"),
        CategoryItem(R.drawable.ic_category_buisness, "취업"),
        CategoryItem(R.drawable.ic_category_born, "출산"),
    )

    var publicOpenState by remember { mutableStateOf(true) }
    var titleInput by remember { mutableStateOf("") }
    var descriptionInput by remember { mutableStateOf("") }
    var categorySelect by remember { mutableStateOf("카테고리 선택") }

    var showSheet by remember { mutableStateOf(false) }
    val sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)
    val scope = rememberCoroutineScope()

    val scrollState = rememberScrollState()


    Scaffold(
        bottomBar = {
            Surface(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 16.dp),
                shadowElevation = 16.dp,
                color = Color.White
            ) {
                CommonBottomButton(
                    Modifier
                        .fillMaxWidth()
                        .height(68.dp),
                    text = "선물 선택하기"
                )
            }
        },
        topBar = {
            CommonTopBar(
                title = "펀딩 생성하기",
                onBackClick = { navController.popBackStack() },
                onHomeClick = { xmlNavController.navigate(R.id.fragment_home) }
            )
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(bottom = 8.dp)
                .verticalScroll(scrollState)
                .background(Color.White)
                .padding(paddingValues)
        ) {
            Column(
                Modifier
                    .fillMaxSize()
                    .padding(horizontal = 24.dp)
            ) {
                Spacer(Modifier.height(20.dp))
                Text(
                    text = "2단계",
                    fontFamily = suit,
                    fontWeight = FontWeight.SemiBold,
                    fontSize = 20.sp,
                    color = colorResource(R.color.main_secondary)
                )
                Spacer(Modifier.height(12.dp))
                Text(
                    text = "정보 입력하기",
                    fontFamily = suit,
                    fontWeight = FontWeight.Bold,
                    fontSize = 24.sp
                )

                Spacer(Modifier.height(28.dp))
                Text(
                    text = "선택한 선물",
                    fontFamily = suit,
                    fontWeight = FontWeight.SemiBold,
                    fontSize = 20.sp
                )
                Spacer(Modifier.height(16.dp))
                Row(modifier = Modifier.fillMaxWidth()) {
                    Image(
                        painter = painterResource(R.drawable.test_img_doll),
                        contentDescription = null,
                        modifier = Modifier
                            .size(100.dp)
                            .clip(shape = RoundedCornerShape(10.dp))
                    )
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(100.dp)
                            .padding(horizontal = 12.dp, vertical = 6.dp)
                    ) {
                        Text(
                            text = "상품 이름 표시",
                            fontFamily = pretendard,
                            fontWeight = FontWeight.SemiBold,
                            fontSize = 18.sp,
                            maxLines = 2,
                            overflow = TextOverflow.Ellipsis
                        )
                        Spacer(Modifier.weight(1f))
                        Text(
                            text = "15,800원",
                            fontFamily = pretendard,
                            fontWeight = FontWeight.Medium,
                            fontSize = 17.sp,
                            color = colorResource(R.color.main_secondary)
                        )
                    }
                }
                Spacer(Modifier.height(24.dp))


                TitleText("펀딩 제목")
                Spacer(Modifier.height(8.dp))
                OutlinedTextField(
                    value = titleInput,
                    onValueChange = {
                        titleInput = it
                    },
                    modifier = Modifier.fillMaxWidth(),
                    textStyle = TextStyle(
                        fontSize = 16.sp,
                        fontFamily = pretendard,
                        fontWeight = FontWeight(500),
                        textAlign = TextAlign.Start,
                        color = Color(0xFF201704)
                    ),
                    placeholder = {
                        Text(
                            text = "제목을 입력해주세요. (최대 15글자)",
                            fontSize = 16.sp,
                            fontFamily = pretendard,
                            fontWeight = FontWeight(400),
                            color = Color(0xFFBCBCBC)
                        )
                    },
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = colorResource(R.color.main_secondary),
                        unfocusedBorderColor = Color(0xFFBCBCBC)
                    ),
                    singleLine = true
                )

                Spacer(Modifier.height(24.dp))
                TitleText("카테고리")
                Text(
                    text = "어떤 날을 기념하고 싶나요?",
                    fontFamily = suit,
                    fontWeight = FontWeight.Normal,
                    fontSize = 16.sp,
                    modifier = Modifier.padding(top = 4.dp)
                )
                Spacer(Modifier.height(8.dp))
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(54.dp)
                        .clip(shape = RoundedCornerShape(5.dp))
                        .border(
                            width = 1.dp,
                            shape = RoundedCornerShape(5.dp),
                            color = if (categorySelect == "카테고리 선택") Color(0xFFBCBCBC) else colorResource(
                                R.color.main_secondary
                            )
                        )
                        .clickable(
                            interactionSource = remember { MutableInteractionSource() },
                            indication = null,
                            onClick = {
                                // 바텀 시트 생성
                                showSheet = true
                                scope.launch {
                                    sheetState.show()
                                }

                            }
                        )
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(horizontal = 16.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = categorySelect,
                            fontFamily = suit,
                            fontWeight = FontWeight.Normal,
                            fontSize = 16.sp,
                            color = if (categorySelect == "카테고리 선택") Color(0xFF888888) else Color.Black
                        )
                        Spacer(Modifier.weight(1f))
                        Icon(
                            painter = painterResource(R.drawable.ic_arrow_back),
                            contentDescription = null,
                            modifier = Modifier
                                .rotate(-90f)
                                .size(22.dp)
                        )
                    }

                }


                if (showSheet) {
                    ModalBottomSheet(
                        onDismissRequest = { showSheet = false },
                        sheetState = sheetState,
                        containerColor = Color.White
                    ) {
                        Column(
                            modifier = Modifier
                                .fillMaxWidth()
                                .wrapContentHeight()
                                .background(color = Color.White)
                        ) {
                            categoryList.forEachIndexed { index, item ->
                                Row(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .height(54.dp)
                                        .padding(start = 20.dp)
                                        .clickable(
                                            interactionSource = remember { MutableInteractionSource() },
                                            indication = null,
                                            onClick = {
                                                categorySelect = item.label
                                                showSheet = false
                                                scope.launch {
                                                    sheetState.hide()
                                                }
                                            }
                                        ),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Icon(painter = painterResource(item.iconId), null)
                                    Spacer(Modifier.width(24.dp))
                                    Text(
                                        text = item.label,
                                        fontFamily = suit,
                                        fontWeight = FontWeight.Normal,
                                        fontSize = 15.sp
                                    )

                                }

                                if (index < categoryList.lastIndex) {
                                    Divider(
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .padding(horizontal = 4.dp),
                                        thickness = 1.dp,
                                        color = Color(0xFFECECEC)
                                    )
                                }
                            }
                        }

                    }
                }


                Spacer(Modifier.height(24.dp))
                TitleText("공개 범위 설정")
                Text(
                    text = "펀딩 공개 범위를 설정해주세요.",
                    fontFamily = suit,
                    fontWeight = FontWeight.Normal,
                    fontSize = 16.sp,
                    modifier = Modifier.padding(top = 4.dp)
                )
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 8.dp)
                ) {
                    // 전체 공개
                    Column(
                        modifier = Modifier
                            .clickable(
                                interactionSource = remember { MutableInteractionSource() },
                                indication = null,
                                onClick = {
                                    publicOpenState = true
                                }
                            )
                            .height(148.dp)
                            .weight(1f)
                            .clip(shape = RoundedCornerShape(10.dp))
                            .border(
                                width = 1.dp,
                                shape = RoundedCornerShape(10.dp),
                                color = colorResource(R.color.main_secondary)
                            )
                            .background(color = if (publicOpenState == true) colorResource(R.color.main_secondary) else Color.White),
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.Center
                    ) {
                        Icon(
                            painter = painterResource(R.drawable.ic_public_open),
                            null,
                            tint = if (publicOpenState == true) Color.White else Color.Black
                        )
                        Spacer(Modifier.height(4.dp))
                        Text(
                            text = "전체 공개",
                            fontFamily = suit,
                            fontWeight = FontWeight.Medium,
                            fontSize = 16.sp,
                            color = if (publicOpenState == true) Color.White else Color.Black
                        )
                        Spacer(Modifier.height(16.dp))
                        Text(
                            text = "누구나 펀딩을 볼 수 있고\n" +
                                    "참여할 수 있어요.",
                            fontFamily = suit,
                            fontWeight = FontWeight.Medium,
                            fontSize = 14.sp,
                            textAlign = TextAlign.Center,
                            color = if (publicOpenState == true) Color.White else Color.Black
                        )
                    }
                    Spacer(Modifier.width(16.dp))

                    // 친구 공개
                    Column(
                        modifier = Modifier
                            .clickable(
                                interactionSource = remember { MutableInteractionSource() },
                                indication = null,
                                onClick = {
                                    publicOpenState = false
                                }
                            )
                            .height(148.dp)
                            .weight(1f)
                            .clip(shape = RoundedCornerShape(10.dp))
                            .border(
                                width = 1.dp,
                                shape = RoundedCornerShape(10.dp),
                                color = colorResource(R.color.main_secondary)
                            )
                            .background(color = if (publicOpenState == false) colorResource(R.color.main_secondary) else Color.White),
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.Center
                    ) {
                        Icon(
                            painter = painterResource(R.drawable.ic_private_open),
                            null,
                            tint = if (publicOpenState == false) Color.White else Color.Black
                        )
                        Spacer(Modifier.height(4.dp))
                        Text(
                            text = "친구 공개",
                            fontFamily = suit,
                            fontWeight = FontWeight.Medium,
                            fontSize = 16.sp,
                            color = if (publicOpenState == false) Color.White else Color.Black
                        )
                        Spacer(Modifier.height(16.dp))
                        Text(
                            text = "카카오톡 친구만 펀딩에\n" +
                                    "참여할 수 있어요.",
                            fontFamily = suit,
                            fontWeight = FontWeight.Medium,
                            fontSize = 14.sp,
                            textAlign = TextAlign.Center,
                            color = if (publicOpenState == false) Color.White else Color.Black
                        )

                    }

                }
                Spacer(Modifier.height(24.dp))
                Text(
                    text = "메시지 작성",
                    fontFamily = suit,
                    fontWeight = FontWeight.SemiBold,
                    fontSize = 20.sp
                )
                Spacer(Modifier.height(8.dp))

                OutlinedTextField(
                    value = descriptionInput,
                    onValueChange = {
                        descriptionInput = it
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .heightIn(min = 100.dp, max = 300.dp),
                    textStyle = TextStyle(
                        fontSize = 16.sp,
                        fontFamily = pretendard,
                        fontWeight = FontWeight(500),
                        textAlign = TextAlign.Start,
                        color = Color(0xFF201704)
                    ),
                    placeholder = {
                        Text(
                            text = "친구들에게 남길 메시지를 입력해주세요. (최대 100자)",
                            fontSize = 14.sp,
                            fontFamily = pretendard,
                            fontWeight = FontWeight(400),
                            color = Color(0xFF888888)
                        )
                    },
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = colorResource(R.color.main_secondary),
                        unfocusedBorderColor = Color(0xFFBCBCBC)
                    ),
                    maxLines = Int.MAX_VALUE
                )

            }
        }
    }


}


@Composable
private fun TitleText(title: String) {

    Row() {
        Text(
            text = title,
            fontFamily = suit,
            fontWeight = FontWeight.SemiBold,
            fontSize = 20.sp
        )
        Text(
            text = "*",
            fontFamily = suit,
            fontWeight = FontWeight.SemiBold,
            fontSize = 20.sp,
            color = Color.Red,
            modifier = Modifier.offset(y = -8.dp)
        )
    }
}


@Composable
private fun PublicOpenButton() {
    Column(modifier = Modifier.height(140.dp)) { }
}

@Composable
private fun PrivateOpenButton() {

}
