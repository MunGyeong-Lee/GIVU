package com.wukiki.givu.views.home

import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.NavController
import com.wukiki.domain.model.Funding
import com.wukiki.givu.R
import com.wukiki.givu.ui.suit
import com.wukiki.givu.views.home.component.FriendFundingListPager
import com.wukiki.givu.views.home.component.FundingAllPager
import com.wukiki.givu.views.home.component.HomeAppBarPager
import com.wukiki.givu.views.home.component.PopularFundingListPager
import com.wukiki.givu.views.home.component.SearchBarItem
import com.wukiki.givu.views.home.viewmodel.HomeViewModel

@Composable
fun HomeScreen(homeViewModel: HomeViewModel = hiltViewModel(), navController: NavController) {
    val user by homeViewModel.user.collectAsState()

    val sampleFundings = listOf(
        Funding(
            id = "1",
            userId = "user123",
            productId = "product456",
            title = "마이화장품한테 화장품 사주세요~",
            body = "펀딩 내용 설명",
            description = "설명",
            category = "beauty",
            categoryName = "뷰티",
            scope = "public",
            participantsNumber = "100",
            fundedAmount = "10,000",
            status = "active",
            images = listOf("https://images.unsplash.com/photo-1522383225653-ed111181a951"),
            createdAt = "2024-03-01",
            updatedAt = "2024-03-10"
        ),
        Funding(
            id = "2",
            userId = "user456",
            productId = "product789",
            title = "친구 생일선물 같이 준비해요!",
            body = "펀딩 내용 설명",
            description = "설명",
            category = "birthday",
            categoryName = "생일",
            scope = "public",
            participantsNumber = "50",
            fundedAmount = "120,000",
            status = "active",
            images = listOf("https://images.unsplash.com/photo-1604023009903-95644dfc1c2c"),
            createdAt = "2024-03-02",
            updatedAt = "2024-03-12"
        ),
        Funding(
            id = "3",
            userId = "user789",
            productId = "product101",
            title = "우리 가족 홈카페 기기 마련 프로젝트 ☕",
            body = "펀딩 내용 설명",
            description = "설명",
            category = "home",
            categoryName = "집들이",
            scope = "public",
            participantsNumber = "80",
            fundedAmount = "250,000",
            status = "active",
            images = listOf("https://images.unsplash.com/photo-1517705008128-361805f42e86"),
            createdAt = "2024-03-03",
            updatedAt = "2024-03-13"
        ),
        Funding(
            id = "4",
            userId = "user999",
            productId = "product222",
            title = "결혼기념일 맞이, 특별한 선물 준비!",
            body = "펀딩 내용 설명",
            description = "설명",
            category = "wedding",
            categoryName = "결혼",
            scope = "private",
            participantsNumber = "30",
            fundedAmount = "500,000",
            status = "active",
            images = listOf("https://images.unsplash.com/photo-1529042410759-befb1204b468"),
            createdAt = "2024-03-04",
            updatedAt = "2024-03-14"
        ),
        Funding(
            id = "5",
            userId = "user321",
            productId = "product333",
            title = "대학 졸업 선물 🎓 노트북 모금!",
            body = "펀딩 내용 설명",
            description = "설명",
            category = "graduation",
            categoryName = "졸업",
            scope = "public",
            participantsNumber = "90",
            fundedAmount = "800,000",
            status = "active",
            images = listOf("https://images.unsplash.com/photo-1502865787650-3f8318917153"),
            createdAt = "2024-03-05",
            updatedAt = "2024-03-15"
        ),
        Funding(
            id = "6",
            userId = "user654",
            productId = "product444",
            title = "첫 직장 입사 선물 준비 🎉",
            body = "펀딩 내용 설명",
            description = "설명",
            category = "job",
            categoryName = "취업",
            scope = "public",
            participantsNumber = "70",
            fundedAmount = "320,000",
            status = "active",
            images = listOf("https://images.unsplash.com/photo-1507679799987-c73779587ccf"),
            createdAt = "2024-03-06",
            updatedAt = "2024-03-16"
        ),
        Funding(
            id = "7",
            userId = "user777",
            productId = "product555",
            title = "아기용품 함께 마련하기 🍼",
            body = "펀딩 내용 설명",
            description = "설명",
            category = "child",
            categoryName = "출산",
            scope = "public",
            participantsNumber = "120",
            fundedAmount = "950,000",
            status = "active",
            images = listOf("https://images.unsplash.com/photo-1511974035430-5de47d3b95da"),
            createdAt = "2024-03-07",
            updatedAt = "2024-03-17"
        ),
        Funding(
            id = "8",
            userId = "user888",
            productId = "product666",
            title = "우리집 강아지 생일파티 준비 🎂🐶",
            body = "펀딩 내용 설명",
            description = "설명",
            category = "pet",
            categoryName = "반려동물",
            scope = "public",
            participantsNumber = "40",
            fundedAmount = "180,000",
            status = "active",
            images = listOf("https://images.unsplash.com/photo-1517423440428-a5a00ad493e8"),
            createdAt = "2024-03-08",
            updatedAt = "2024-03-18"
        ),
        Funding(
            id = "9",
            userId = "user999",
            productId = "product777",
            title = "친구의 새로운 시작을 위한 응원 선물!",
            body = "펀딩 내용 설명",
            description = "설명",
            category = "friendship",
            categoryName = "친구",
            scope = "private",
            participantsNumber = "60",
            fundedAmount = "420,000",
            status = "active",
            images = listOf("https://images.unsplash.com/photo-1523540490786-7cc9c1fced68"),
            createdAt = "2024-03-09",
            updatedAt = "2024-03-19"
        ),
        Funding(
            id = "10",
            userId = "user1010",
            productId = "product888",
            title = "사무실에 새로운 커피 머신 장만 ☕",
            body = "펀딩 내용 설명",
            description = "설명",
            category = "office",
            categoryName = "사무실",
            scope = "public",
            participantsNumber = "100",
            fundedAmount = "600,000",
            status = "active",
            images = listOf("https://images.unsplash.com/photo-1497935586351-b67a49e012bf"),
            createdAt = "2024-03-10",
            updatedAt = "2024-03-20"
        )
    )

    LazyColumn(
        modifier = Modifier.fillMaxWidth()
    ) {
        item {
            HomeAppBarPager(navController, user)
            Spacer(modifier = Modifier.height(4.dp))
            SearchBarItem("웅") { }
        }
        item {
            Spacer(modifier = Modifier.height(16.dp))
            Text(
                text = stringResource(id = R.string.text_popular_funding),
                fontSize = 24.sp,
                fontWeight = FontWeight.Bold,
                fontFamily = suit
            )
            PopularFundingListPager(sampleFundings, navController)
        }
        if (user != null) {
            item {
                Spacer(modifier = Modifier.height(16.dp))
                Text(
                    text = stringResource(id = R.string.text_my_friends_funding),
                    fontSize = 24.sp,
                    fontWeight = FontWeight.Bold,
                    fontFamily = suit
                )
                FriendFundingListPager(sampleFundings)
            }
        }
        item {
            Spacer(modifier = Modifier.height(16.dp))
            Text(
                text = stringResource(id = R.string.text_funding_list),
                fontSize = 24.sp,
                fontWeight = FontWeight.Bold,
                fontFamily = suit
            )
            Spacer(modifier = Modifier.height(8.dp))
            FundingAllPager(sampleFundings)
        }
    }
}