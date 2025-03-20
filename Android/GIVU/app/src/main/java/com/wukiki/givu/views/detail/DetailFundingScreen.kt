package com.wukiki.givu.views.detail

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.NavController
import com.wukiki.givu.views.detail.component.DetailFundingContent
import com.wukiki.givu.views.detail.component.FundingBottomActions
import com.wukiki.givu.views.detail.viewmodel.FundingViewModel

@Composable
fun DetailFundingScreen(
    fundingViewModel: FundingViewModel = hiltViewModel(),
    navController: NavController
) {
    val funding by fundingViewModel.selectedFunding.collectAsState()

    Scaffold(
        bottomBar = { FundingBottomActions() }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
        ) {
            funding?.let { DetailFundingContent(it, navController) }
        }
    }
}