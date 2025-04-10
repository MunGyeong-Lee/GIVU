package com.wukiki.givu.views.home.component

import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import com.wukiki.domain.model.Funding

@Composable
fun FriendFundingListPager(fundings: List<Funding>) {
    LazyRow(
        modifier = Modifier.fillMaxWidth()
    ) {
        items(fundings, key = { it.id }) { _ ->
            FriendFundingCard(
                name = "신은찬",
                category = "생일",
                title = "나에게 선물을 줘",
                price = 45000,
                percent = 16,
                imageUrl = ""
            )
            FriendFundingCard(
                name = "박민수",
                category = "생일",
                title = "선물 주세염ㅋ",
                price = 109000,
                percent = 41,
                imageUrl = "https://i.ytimg.com/vi/J1PdlDGw5Cs/maxresdefault.jpg"
            )
            FriendFundingCard(
                name = "이문경",
                category = "취업",
                title = "취업 선물 부탁해요",
                price = 200000,
                percent = 66,
                imageUrl = "https://i.pinimg.com/736x/de/30/90/de30900657747d02235a6231a5ab325c.jpg"
            )
        }
    }
}