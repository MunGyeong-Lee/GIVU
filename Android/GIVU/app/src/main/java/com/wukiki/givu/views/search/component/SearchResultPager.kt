package com.wukiki.givu.views.search.component

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.NavController
import com.wukiki.domain.model.Funding
import com.wukiki.givu.util.SortButton
import com.wukiki.givu.views.search.viewmodel.SearchViewModel

@Composable
fun SearchResultPager(
    searchResult: List<Funding>,
    searchViewModel: SearchViewModel = hiltViewModel(),
    navController: NavController
) {
    val sortOption by searchViewModel.sortOption.collectAsState()
    val showSheet = remember { mutableStateOf(false) }

    Column(
        modifier = Modifier.padding(8.dp)
    ) {
        Spacer(modifier = Modifier.height(8.dp))
        Row(
            modifier = Modifier.fillMaxWidth()
                .padding(end = 8.dp),
            horizontalArrangement = Arrangement.End
        ) {
            SortButton(
                modifier = Modifier.padding(end = 8.dp),
                category = sortOption
            ) {
                showSheet.value = true
            }
        }
        Spacer(modifier = Modifier.height(8.dp))
        LazyVerticalGrid(
            columns = GridCells.Fixed(2),
            modifier = Modifier.fillMaxSize(),
            contentPadding = PaddingValues(8.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            items(searchResult) { funding ->
                SearchResultCardItem(funding, navController)
            }
        }
    }

    if (showSheet.value) {
        SortOptionBottomSheet(
            onDismissRequest = { showSheet.value = false },
        )
    }
}