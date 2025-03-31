package com.wukiki.givu.views.community.component

import androidx.compose.foundation.Image
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import coil.compose.SubcomposeAsyncImage
import com.wukiki.givu.R
import com.wukiki.givu.ui.suit
import com.wukiki.givu.views.community.viewmodel.CommunityViewModel

@Composable
fun FriendListCommunityPager(
    communityViewModel: CommunityViewModel = hiltViewModel()
) {
    val friends by communityViewModel.friends.collectAsState()
    val selectedFriend by communityViewModel.selectedFriend.collectAsState()

    Text(
        text = "내 친구 목록",
        fontWeight = FontWeight.Bold,
        fontSize = 18.sp,
        fontFamily = suit
    )
    Spacer(Modifier.height(8.dp))
    LazyRow(
        horizontalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        item {
            Column(
                modifier = Modifier.alpha(if (selectedFriend == null) 1F else 0.5F)
                    .clickable { communityViewModel.selectAllFriends() },
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Image(
                    painter = painterResource(R.drawable.ic_classification_all),
                    contentDescription = "Profile Image",
                    contentScale = ContentScale.Crop,
                    modifier = Modifier
                        .size(56.dp)
                        .clip(CircleShape)
                )
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = "전체",
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold,
                    fontFamily = suit
                )
            }
        }
        items(friends) { friend ->
            Column(
                modifier = Modifier.alpha(if (selectedFriend == friend) 1F else 0.5F)
                    .clickable { communityViewModel.selectFriend(friend) },
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                SubcomposeAsyncImage(
                    model = friend.profileImage,
                    contentDescription = "Profile Image",
                    contentScale = ContentScale.Crop,
                    modifier = Modifier
                        .size(56.dp)
                        .clip(CircleShape)
                )
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = friend.nickname,
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold,
                    fontFamily = suit
                )
            }
        }
    }

    Spacer(Modifier.height(24.dp))
}