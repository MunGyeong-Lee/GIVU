package com.wukiki.givu.views.register

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.wrapContentHeight
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalFocusManager
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.wukiki.givu.R
import com.wukiki.givu.ui.suit
import com.wukiki.givu.views.mall.viewmodel.MallViewModel
import com.wukiki.givu.views.register.component.SearchPresentResultPager
import com.wukiki.givu.views.register.viewmodel.RegisterViewModel
import com.wukiki.givu.views.search.component.EmptySearchResultScreen

@Composable
fun SearchPresentScreen(
    mallViewModel: MallViewModel,
    registerViewModel: RegisterViewModel,
    navController: NavController
) {
    val focusManager = LocalFocusManager.current
    val searchKeyword by mallViewModel.searchKeyword.collectAsState()
    val searchResults by mallViewModel.searchResults.collectAsState()

    Scaffold(
        topBar = {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(60.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                IconButton(onClick = {}) {
                    Icon(
                        painter = painterResource(R.drawable.ic_arrow_back),
                        contentDescription = null,
                        modifier = Modifier.size(28.dp)
                    )

                }
                Spacer(Modifier.weight(1F))
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .wrapContentHeight()
                        .padding(end = 16.dp)
                        .clip(RoundedCornerShape(10.dp))
                        .border(1.dp, Color.Red, RoundedCornerShape(10.dp))
                        .background(Color.White)
                        .padding(horizontal = 16.dp, vertical = 8.dp)
                ) {
                    BasicTextField(
                        value = searchKeyword,
                        onValueChange = { mallViewModel.searchKeyword.value = it },
                        keyboardOptions = KeyboardOptions.Default.copy(
                            imeAction = ImeAction.Search
                        ),
                        keyboardActions = KeyboardActions(
                            onSearch = {
                                mallViewModel.searchProduct(searchKeyword)
                                focusManager.clearFocus()
                            }
                        ),
                        textStyle = TextStyle(
                            fontSize = 14.sp,
                            color = Color.Black,
                            fontFamily = suit,
                            fontWeight = FontWeight.Normal,
                            textAlign = TextAlign.Start
                        ),
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth(),
                        decorationBox = { innerTextField ->
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.SpaceBetween,
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Box {
                                    innerTextField()
                                    if (searchKeyword.isEmpty()) {
                                        Text(
                                            stringResource(R.string.text_search_keyword_need),
                                            fontSize = 14.sp,
                                            color = Color.Gray
                                        )
                                    }
                                }
                                Spacer(Modifier.weight(1F))
                                Icon(
                                    painter = painterResource(id = R.drawable.ic_search),
                                    contentDescription = "Search",
                                    tint = Color.Gray,
                                    modifier = Modifier.size(18.dp)
                                        .clickable { mallViewModel.searchProduct(searchKeyword) }
                                )
                            }
                        }
                    )
                }
            }
        },
        containerColor = Color.White
    ) { paddingValues ->
        when (searchResults.isEmpty()) {
            true -> {
                EmptySearchResultScreen(modifier = Modifier.padding(paddingValues))
            }

            else -> {
                Column(
                    modifier = Modifier.fillMaxWidth()
                        .wrapContentHeight()
                        .padding(paddingValues)
                ) {
                    Column(
                        modifier = Modifier.padding(start = 16.dp, top = 16.dp, end = 16.dp)
                    ) {
                        Row {
                            Text(
                                text = searchKeyword,
                                fontSize = 16.sp,
                                fontWeight = FontWeight.Bold,
                                fontFamily = suit
                            )
                            Text(
                                text = "에 대한",
                                fontSize = 16.sp,
                                fontWeight = FontWeight.Medium,
                                fontFamily = suit
                            )
                        }
                        Text(
                            text = "검색 결과입니다.",
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Medium,
                            fontFamily = suit
                        )
                    }

                    SearchPresentResultPager(searchResults, mallViewModel, registerViewModel, navController)
                }
            }
        }
    }
}