package com.wukiki.givu.views.community

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.NavController
import com.wukiki.givu.R
import com.wukiki.givu.views.community.component.FriendListCommunityPager
import com.wukiki.givu.views.community.component.FriendParticipateCommunityPager
import com.wukiki.givu.views.community.component.FriendRegisterCommunityPager
import com.wukiki.givu.views.community.component.RecentlyCommunityPager
import com.wukiki.givu.views.community.viewmodel.CommunityUiEvent
import com.wukiki.givu.views.community.viewmodel.CommunityViewModel
import com.wukiki.givu.views.home.viewmodel.HomeUiEvent

@Composable
fun CommunityScreen(
    communityViewModel: CommunityViewModel = hiltViewModel(),
    navController: NavController
) {
    val context = LocalContext.current
    val selectedFriend by communityViewModel.selectedFriend.collectAsState()
    val recentlyParticipatedFundings by communityViewModel.recentlyParticipatedFundings.collectAsState()
    val friendParticipatedFundings by communityViewModel.friendParticipatedFundings.collectAsState()
    val friendRegisterFundings by communityViewModel.friendRegisterFundings.collectAsState()
    val communityUiEvent = communityViewModel.communityUiEvent

    LaunchedEffect(Unit) {
        communityUiEvent.collect { event ->
            when (event) {
                is CommunityUiEvent.GoToLogin -> {
                    navController.navigate(R.id.action_community_to_login)
                }
            }
        }
    }

    Scaffold(
        topBar = {
            Row {
                Text(
                    text = stringResource(R.string.title_community),
                    fontSize = 24.sp,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier.padding(16.dp)
                )
            }
        },
        containerColor = Color.White
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .padding(innerPadding)
                .padding(horizontal = 16.dp)
                .verticalScroll(rememberScrollState())
        ) {
            FriendListCommunityPager()
            if (selectedFriend == null) {
                RecentlyCommunityPager(recentlyParticipatedFundings, navController)
            }
            FriendParticipateCommunityPager(friendParticipatedFundings, navController, selectedFriend)
            FriendRegisterCommunityPager(friendRegisterFundings, navController, selectedFriend)
        }
    }
}