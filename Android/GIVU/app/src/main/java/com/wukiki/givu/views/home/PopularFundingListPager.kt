package com.wukiki.givu.views.home

import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import com.wukiki.domain.model.Funding

@Composable
fun PopularFundingListPager(fundings: List<Funding>) {
    LazyRow(
        modifier = Modifier.fillMaxWidth()
    ) {
        items(fundings, key = { it.id }) { funding ->
            PopularFundingCardItem(funding)
        }
    }
}

@Preview(showBackground = true)
@Composable
fun PreviewPopularFundingListItem() {
    val fundings = listOf(
        Funding(
            id = "1",
            userId = "user123",
            productId = "product456",
            title = "호날두 축구화 구매",
            body = "펀딩 내용 설명",
            description = "설명",
            category = "sports",
            categoryName = "스포츠",
            scope = "public",
            participantsNumber = "100",
            fundedAmount = "58,000",
            status = "liked",
            image = "https://images.unsplash.com/photo-1522383225653-ed111181a951",
            image2 = "",
            image3 = "",
            createdAt = "2024-03-01",
            updatedAt = "2024-03-10"
        ),
        Funding(
            id = "2",
            userId = "user456",
            productId = "product789",
            title = "메시 유니폼 구매",
            body = "펀딩 내용 설명",
            description = "설명",
            category = "sports",
            categoryName = "스포츠",
            scope = "public",
            participantsNumber = "50",
            fundedAmount = "75,000",
            status = "not_liked",
            image = "https://images.unsplash.com/photo-1522383225653-ed111181a951",
            image2 = "",
            image3 = "",
            createdAt = "2024-03-02",
            updatedAt = "2024-03-12"
        )
    )

    PopularFundingListPager(fundings)
}