package com.wukiki.givu.views.community.component

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.wukiki.domain.model.Funding
import com.wukiki.domain.model.User
import com.wukiki.givu.R
import com.wukiki.givu.ui.suit

@Composable
fun FriendParticipateCommunityPager(
    fundings: List<Funding>,
    navController: NavController,
    friend: User?
) {
    Column {
        Row {
            if (friend != null) {
                Text(
                    text = friend.nickname,
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Bold,
                    fontFamily = suit,
                    color = Color.Red
                )
            }
            Text(
                text = when (friend == null) {
                    true -> {
                        stringResource(R.string.title_friend_participate_funding)
                    }

                    else -> {
                        "님이 참여한 펀딩"
                    }
                },
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                fontFamily = suit
            )
        }

        Spacer(Modifier.height(8.dp))

        LazyRow(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            items(fundings) { funding ->
                CommunityCardItem(funding, navController)
            }
        }

        Spacer(Modifier.height(24.dp))
    }
}