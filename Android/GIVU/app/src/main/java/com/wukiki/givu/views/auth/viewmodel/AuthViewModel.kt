package com.wukiki.givu.views.auth.viewmodel

import android.app.Application
import android.content.Context
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.kakao.sdk.user.UserApiClient
import com.wukiki.domain.model.ApiResult
import com.wukiki.domain.model.ApiStatus
import com.wukiki.domain.model.KakaoUser
import com.wukiki.domain.model.User
import com.wukiki.domain.usecase.GetAuthUseCase
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asSharedFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.launch
import timber.log.Timber
import javax.inject.Inject

@HiltViewModel
class AuthViewModel @Inject constructor(
    application: Application,
    private val getAuthUseCase: GetAuthUseCase
) : AndroidViewModel(application) {

    /*** Ui State, Ui Event ***/
    private val _authUiEvent = MutableSharedFlow<AuthUiEvent>()
    val authUiEvent = _authUiEvent.asSharedFlow()

    private val _kakaoLoginState = MutableStateFlow<ApiResult<KakaoUser?>>(ApiResult.success(null))
    val kakaoLoginState = _kakaoLoginState.asStateFlow()

    private val _userState = MutableStateFlow<ApiResult<User?>>(ApiResult.success(null))
    val userState = _userState.asStateFlow()

    /*** Datas ***/
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
                sendKakaoUserInfo(kakaoAccessToken)
            }
        }
    }

    private fun sendKakaoUserInfo(kakaoAccessToken: String) {
        viewModelScope.launch {
            Timber.d("Access Token: $kakaoAccessToken")
            val response = getAuthUseCase.loginWithKakao(kakaoAccessToken)

            response.collectLatest { result ->
                _kakaoLoginState.value = result
                if (result.status == ApiStatus.SUCCESS) {
                    saveJwt(result.data?.jwtToken)
                } else if (result.status == ApiStatus.FAIL || result.status == ApiStatus.ERROR) {
                    _authUiEvent.emit(AuthUiEvent.LoginFail)
                }
            }
        }
    }

    private fun saveJwt(jwtToken: String?) {
        if (jwtToken == null) return

        viewModelScope.launch {
            getAuthUseCase.setJwt(jwtToken)
            val response = getAuthUseCase.fetchUserInfo()

            response.collectLatest { result ->
                _userState.value = result
                if (result.status == ApiStatus.SUCCESS) {
                    val newUserInfo = _userState.value.data
                    newUserInfo?.let {
                        getAuthUseCase.setUserInfo(newUserInfo)
                        _authUiEvent.emit(AuthUiEvent.LoginSuccess)
                    }
                } else if (result.status == ApiStatus.FAIL || result.status == ApiStatus.ERROR) {
                    _authUiEvent.emit(AuthUiEvent.LoginFail)
                }
            }
        }
    }

    fun loginWithKakao(context: Context) {
        if (kakaoAuth.isKakaoTalkLoginAvailable(context)) {
            kakaoAuth.loginWithKakaoTalk(context) { token, error ->
                if (error != null) {
                    viewModelScope.launch {
                        _authUiEvent.emit(AuthUiEvent.LoginFail)
                    }
                } else if (token != null) {
                    getUserInfo(token.accessToken)
                }
            }
        } else {
            kakaoAuth.loginWithKakaoAccount(context) { token, error ->
                if (error != null) {
                    viewModelScope.launch {
                        _authUiEvent.emit(AuthUiEvent.LoginFail)
                    }
                } else if (token != null) {
                    getUserInfo(token.accessToken)
                }
            }
        }
    }
}