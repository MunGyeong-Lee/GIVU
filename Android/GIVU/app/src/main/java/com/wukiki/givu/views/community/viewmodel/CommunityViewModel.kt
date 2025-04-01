package com.wukiki.givu.views.community.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import com.wukiki.domain.model.Funding
import com.wukiki.domain.model.User
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import javax.inject.Inject

@HiltViewModel
class CommunityViewModel @Inject constructor(
    application: Application
) : AndroidViewModel(application) {

    private val _friends = MutableStateFlow<List<User>>(emptyList())
    val friends = _friends.asStateFlow()

    private val _selectedFriend = MutableStateFlow<User?>(null)
    val selectedFriend = _selectedFriend.asStateFlow()

    private val _recentlyParticipatedFundings = MutableStateFlow<List<Funding>>(emptyList())
    val recentlyParticipatedFundings = _recentlyParticipatedFundings.asStateFlow()

    private val _friendParticipatedFundings = MutableStateFlow<List<Funding>>(emptyList())
    val friendParticipatedFundings = _friendParticipatedFundings.asStateFlow()

    private val _friendRegisterFundings = MutableStateFlow<List<Funding>>(emptyList())
    val friendRegisterFundings = _friendRegisterFundings.asStateFlow()

    init {
        val sampleFundings = listOf(
            Funding(
                id = 1,
                userId = 1,
                userNickname = "",
                userProfile = "",
                productId = 1,
                productName = "",
                productPrice = "",
                productImage = "",
                title = "마이화장품한테 화장품 사주세요~",
                body = "펀딩 내용 설명",
                description = "설명",
                category = "beauty",
                categoryName = "뷰티",
                scope = "public",
                participantsNumber = "100",
                fundedAmount = 10000,
                status = "active",
                images = listOf("https://images.unsplash.com/photo-1522383225653-ed111181a951"),
                createdAt = "2024-03-01",
                updatedAt = "2024-03-10"
            ),
            Funding(
                id = 2,
                userId = 1,
                userNickname = "",
                userProfile = "",
                productId = 1,
                productName = "",
                productPrice = "",
                productImage = "",
                title = "친구 생일선물 같이 준비해요!",
                body = "펀딩 내용 설명",
                description = "설명",
                category = "birthday",
                categoryName = "생일",
                scope = "public",
                participantsNumber = "50",
                fundedAmount = 120000,
                status = "active",
                images = listOf("https://images.unsplash.com/photo-1604023009903-95644dfc1c2c"),
                createdAt = "2024-03-02",
                updatedAt = "2024-03-12"
            ),
            Funding(
                id = 3,
                userId = 1,
                userNickname = "",
                userProfile = "",
                productId = 1,
                productName = "",
                productPrice = "",
                productImage = "",
                title = "우리 가족 홈카페 기기 마련 프로젝트 ☕",
                body = "펀딩 내용 설명",
                description = "설명",
                category = "home",
                categoryName = "집들이",
                scope = "public",
                participantsNumber = "80",
                fundedAmount = 250000,
                status = "active",
                images = listOf("https://images.unsplash.com/photo-1517705008128-361805f42e86"),
                createdAt = "2024-03-03",
                updatedAt = "2024-03-13"
            ),
            Funding(
                id = 4,
                userId = 1,
                userNickname = "",
                userProfile = "",
                productId = 1,
                productName = "",
                productPrice = "",
                productImage = "",
                title = "결혼기념일 맞이, 특별한 선물 준비!",
                body = "펀딩 내용 설명",
                description = "설명",
                category = "wedding",
                categoryName = "결혼",
                scope = "private",
                participantsNumber = "30",
                fundedAmount = 500000,
                status = "active",
                images = listOf("https://images.unsplash.com/photo-1529042410759-befb1204b468"),
                createdAt = "2024-03-04",
                updatedAt = "2024-03-14"
            ),
            Funding(
                id = 5,
                userId = 1,
                userNickname = "",
                userProfile = "",
                productId = 1,
                productName = "",
                productPrice = "",
                productImage = "",
                title = "대학 졸업 선물 🎓 노트북 모금!",
                body = "펀딩 내용 설명",
                description = "설명",
                category = "graduation",
                categoryName = "졸업",
                scope = "public",
                participantsNumber = "90",
                fundedAmount = 800000,
                status = "active",
                images = listOf("https://images.unsplash.com/photo-1502865787650-3f8318917153"),
                createdAt = "2024-03-05",
                updatedAt = "2024-03-15"
            ),
            Funding(
                id = 6,
                userId = 1,
                userNickname = "",
                userProfile = "",
                productId = 1,
                productName = "",
                productPrice = "",
                productImage = "",
                title = "첫 직장 입사 선물 준비 🎉",
                body = "펀딩 내용 설명",
                description = "설명",
                category = "job",
                categoryName = "취업",
                scope = "public",
                participantsNumber = "70",
                fundedAmount = 320000,
                status = "active",
                images = listOf("https://images.unsplash.com/photo-1507679799987-c73779587ccf"),
                createdAt = "2024-03-06",
                updatedAt = "2024-03-16"
            ),
            Funding(
                id = 7,
                userId = 1,
                userNickname = "",
                userProfile = "",
                productId = 1,
                productName = "",
                productPrice = "",
                productImage = "",
                title = "아기용품 함께 마련하기 🍼",
                body = "펀딩 내용 설명",
                description = "설명",
                category = "child",
                categoryName = "출산",
                scope = "public",
                participantsNumber = "120",
                fundedAmount = 950000,
                status = "active",
                images = listOf("https://images.unsplash.com/photo-1511974035430-5de47d3b95da"),
                createdAt = "2024-03-07",
                updatedAt = "2024-03-17"
            ),
            Funding(
                id = 8,
                userId = 1,
                userNickname = "",
                userProfile = "",
                productId = 1,
                productName = "",
                productPrice = "",
                productImage = "",
                title = "우리집 강아지 생일파티 준비 🎂🐶",
                body = "펀딩 내용 설명",
                description = "설명",
                category = "pet",
                categoryName = "반려동물",
                scope = "public",
                participantsNumber = "40",
                fundedAmount = 180000,
                status = "active",
                images = listOf("https://images.unsplash.com/photo-1517423440428-a5a00ad493e8"),
                createdAt = "2024-03-08",
                updatedAt = "2024-03-18"
            ),
            Funding(
                id = 9,
                userId = 1,
                userNickname = "",
                userProfile = "",
                productId = 1,
                productName = "",
                productPrice = "",
                productImage = "",
                title = "친구의 새로운 시작을 위한 응원 선물!",
                body = "펀딩 내용 설명",
                description = "설명",
                category = "friendship",
                categoryName = "친구",
                scope = "private",
                participantsNumber = "60",
                fundedAmount = 420000,
                status = "active",
                images = listOf("https://images.unsplash.com/photo-1523540490786-7cc9c1fced68"),
                createdAt = "2024-03-09",
                updatedAt = "2024-03-19"
            ),
            Funding(
                id = 10,
                userId = 1,
                userNickname = "",
                userProfile = "",
                productId = 1,
                productName = "",
                productPrice = "",
                productImage = "",
                title = "사무실에 새로운 커피 머신 장만 ☕",
                body = "펀딩 내용 설명",
                description = "설명",
                category = "office",
                categoryName = "사무실",
                scope = "public",
                participantsNumber = "100",
                fundedAmount = 600000,
                status = "active",
                images = listOf("https://images.unsplash.com/photo-1497935586351-b67a49e012bf"),
                createdAt = "2024-03-10",
                updatedAt = "2024-03-20"
            )
        )

        _recentlyParticipatedFundings.value = sampleFundings
        _friendParticipatedFundings.value = sampleFundings
        _friendRegisterFundings.value = sampleFundings

        val sampleFriends = listOf(
            User(
                id = "1",
                kakaoid = "kakao_001",
                nickname = "호날두",
                email = "ronaldo@example.com",
                birth = "1985.02.05",
                profileImage = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFc0Cry8E_MF-5Qkl5umnXnZ77LI0B8tYKTn-nIG48KTFKnzxLHhIP2Usqb8Hsq0ERpH8_pM0M06a1kB-A0CToMw",
                address = "포르투갈 마데이라",
                gender = "남성",
                ageRange = "30~39",
                balance = "10000",
                createdAt = "2024-01-01",
                updatedAt = "2024-01-15"
            ),
            User(
                id = "2",
                kakaoid = "kakao_002",
                nickname = "김싸피",
                email = "ssafy.kim@example.com",
                birth = "1995.08.20",
                profileImage = "https://www.gotokyo.org/kr/story/guide/the-japanese-cherry-blossom-trees/images/sub001.webp",
                address = "서울특별시",
                gender = "여성",
                ageRange = "20~29",
                balance = "25000",
                createdAt = "2024-02-01",
                updatedAt = "2024-03-10"
            ),
            User(
                id = "3",
                kakaoid = "kakao_003",
                nickname = "장싸피",
                email = "jang@example.com",
                birth = "1992.04.10",
                profileImage = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8JUVCJUIwJTk0JUVCJThCJUE0JTIwJUVEJTkyJThEJUVBJUIyJUJEfGVufDB8fDB8fHww",
                address = "부산광역시",
                gender = "남성",
                ageRange = "30~39",
                balance = "5000",
                createdAt = "2024-03-01",
                updatedAt = "2024-03-20"
            ),
            User(
                id = "4",
                kakaoid = "kakao_004",
                nickname = "이싸피",
                email = "lee@example.com",
                birth = "2000.12.12",
                profileImage = "https://blog.kakaocdn.net/dn/MdN8g/btsJUbXutLF/0qFdB26gjRZiz7kMfVhjOk/img.png",
                address = "인천광역시",
                gender = "여성",
                ageRange = "20~29",
                balance = "8000",
                createdAt = "2024-04-01",
                updatedAt = "2024-04-05"
            ),
            User(
                id = "5",
                kakaoid = "kakao_005",
                nickname = "윤싸피",
                email = "yoon@example.com",
                birth = "1988.07.07",
                profileImage = "https://www.adobe.com/kr/creativecloud/photography/hub/guides/media_19be50009ba86b0f56ac7abd68fa2e8c31caaa87f.png?width=750&format=png&optimize=medium",
                address = "대전광역시",
                gender = "남성",
                ageRange = "30~39",
                balance = "12000",
                createdAt = "2024-05-01",
                updatedAt = "2024-05-20"
            )
        )

        _friends.value = sampleFriends
    }

    fun selectFriend(friend: User) {
        _selectedFriend.value = friend
        /*** 선택한 친구가 참여하거나 생성한 펀딩 가져오기 ***/
    }

    fun selectAllFriends() {
        _selectedFriend.value = null
        /*** 전체 친구들의 펀딩 가져오기 ***/
    }
}