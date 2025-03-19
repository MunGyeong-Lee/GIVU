package com.wukiki.givu.views.auth.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.google.gson.Gson
import com.kakao.sdk.user.UserApiClient
import com.wukiki.domain.model.ApiStatus
import com.wukiki.domain.model.User
import com.wukiki.domain.usecase.GetAuthUseCase
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.launch
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.RequestBody
import okhttp3.RequestBody.Companion.toRequestBody
import timber.log.Timber
import javax.inject.Inject

@HiltViewModel
class AuthViewModel @Inject constructor(
    private val application: Application,
    private val getAuthUseCase: GetAuthUseCase
) : AndroidViewModel(application) {

    private val _user = MutableStateFlow<User?>(null)
    val user = _user.asStateFlow()

    private val kakaoAuth by lazy { UserApiClient.instance }

    init {
        viewModelScope.launch {
            _user.value = fetchUserInfo().first()
        }
    }

    private fun fetchUserInfo(): Flow<User?> = flow {
        val user = getAuthUseCase.getUserInfo().first()
        emit(user)
    }

    private fun getUserInfo(kakaoAccessToken: String) {
        kakaoAuth.me { user, error ->
            if (error != null) {
                Timber.e("KakaoLogin", "사용자 정보 가져오기 실패", error)
            } else if (user != null) {
                _user.value = User(
                    id = user.id.toString(),
                    kakaoid = user.id.toString(),
                    nickname = user.kakaoAccount?.profile?.nickname ?: "Unknown",
                    email = user.kakaoAccount?.email ?: "No Email",
                    birth = user.kakaoAccount?.birthyear ?: "",
                    profileImage = user.kakaoAccount?.profile?.profileImageUrl ?: "",
                    address = "",
                    gender = user.kakaoAccount?.gender?.name ?: "Unknown",
                    ageRange = user.kakaoAccount?.ageRange?.name ?: "Unknown",
                    balance = "0",
                    createdAt = "",
                    updatedAt = ""
                )

                sendKakaoUserInfo(_user.value, kakaoAccessToken)
            }
        }
    }

    private fun sendKakaoUserInfo(userInfo: User?, kakaoAccessToken: String) {
        if (userInfo == null) return

        viewModelScope.launch {
            val response = getAuthUseCase.loginWithKakao(
                kakaoAccessToken,
                getRequestBodyWithUserInfo(userInfo)
            )

            when (response.status) {
                ApiStatus.SUCCESS -> {
                    getAuthUseCase.setUserInfo(userInfo)
                }

                else -> {
                    // 로그인 실패 처리하기
                }
            }
        }
    }

    private fun getRequestBodyWithUserInfo(userInfo: User): RequestBody {
        val metadata = mapOf(
            "id" to userInfo.id,
            "kakao_id" to userInfo.kakaoid,
            "nickname" to userInfo.nickname,
            "email" to userInfo.email,
            "birth" to userInfo.birth,
            "profile_image" to userInfo.profileImage,
            "address" to userInfo.address,
            "gender" to userInfo.gender,
            "age_range" to userInfo.ageRange,
            "balance" to userInfo.balance,
            "created_at" to userInfo.createdAt,
            "updated_at" to userInfo.updatedAt
        )
        val json = Gson().toJson(metadata)

        return json.toRequestBody("application/json".toMediaTypeOrNull())
    }


    fun loginWithKakao() {
        if (kakaoAuth.isKakaoTalkLoginAvailable(application)) {
            kakaoAuth.loginWithKakaoTalk(application) { token, error ->
                if (error != null) {
                    Timber.e(error, "카카오톡 로그인 실패")
                } else if (token != null) {
                    getUserInfo(token.accessToken)
                }
            }
        } else {
            kakaoAuth.loginWithKakaoAccount(application) { token, error ->
                if (error != null) {
                    Timber.e(error, "카카오 계정 로그인 실패")
                } else if (token != null) {
                    getUserInfo(token.accessToken)
                }
            }
        }
    }
}