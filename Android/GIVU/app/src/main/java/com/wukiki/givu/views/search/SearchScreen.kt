package com.wukiki.givu.views.search

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.wrapContentHeight
import androidx.compose.foundation.pager.HorizontalPager
import androidx.compose.foundation.pager.rememberPagerState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Scaffold
import androidx.compose.material3.ScrollableTabRow
import androidx.compose.material3.Tab
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberCoroutineScope
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
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.NavController
import com.wukiki.givu.R
import com.wukiki.givu.ui.suit
import com.wukiki.givu.views.search.component.EmptySearchResultScreen
import com.wukiki.givu.views.search.component.SearchResultPager
import com.wukiki.givu.views.search.viewmodel.SearchViewModel
import kotlinx.coroutines.launch

@Composable
fun SearchScreen(
    searchViewModel: SearchViewModel = hiltViewModel(),
    navController: NavController
) {
    val focusManager = LocalFocusManager.current
    val searchKeyword by searchViewModel.searchKeyword.collectAsState()
    val searchResults by searchViewModel.searchResults.collectAsState()
    val tabTitles = listOf("제목", "작성자")
    val pagerState = rememberPagerState { tabTitles.size }
    val coroutineScope = rememberCoroutineScope()

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
                        onValueChange = { searchViewModel.searchKeyword.value = it },
                        keyboardOptions = KeyboardOptions.Default.copy(
                            imeAction = ImeAction.Search
                        ),
                        keyboardActions = KeyboardActions(
                            onSearch = {
                                searchViewModel.search(searchKeyword)
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
                                        .clickable { searchViewModel.search(searchKeyword) }
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
                    ScrollableTabRow(
                        selectedTabIndex = pagerState.currentPage,
                        containerColor = Color.White,
                        contentColor = Color.Black,
                        edgePadding = 8.dp,
                        indicator = {},
                        divider = {}
                    ) {
                        tabTitles.forEachIndexed { index, title ->
                            Tab(
                                selected = pagerState.currentPage == index,
                                onClick = {
                                    coroutineScope.launch {
                                        pagerState.animateScrollToPage(index)
                                    }
                                },
                                modifier = Modifier.padding(horizontal = 4.dp),
                                text = {
                                    Text(
                                        text = title,
                                        fontWeight = FontWeight.Bold,
                                        color = if (pagerState.currentPage == index) Color.Black else Color.Gray,
                                        fontSize = 20.sp
                                    )
                                }
                            )
                        }
                    }

                    HorizontalDivider()

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

                    HorizontalPager(
                        state = pagerState,
                        modifier = Modifier.fillMaxSize()
                    ) { page ->
                        when (page) {
                            0 -> SearchResultPager(searchResults, navController = navController)

                            1 -> SearchResultPager(searchResults, navController = navController)
                        }
                    }
                }
            }
        }
    }
}