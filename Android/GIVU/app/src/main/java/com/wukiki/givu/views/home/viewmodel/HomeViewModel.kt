package com.wukiki.givu.views.home.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.google.gson.GsonBuilder
import com.wukiki.domain.model.ApiStatus
import com.wukiki.domain.model.Funding
import com.wukiki.domain.model.User
import com.wukiki.domain.usecase.GetAuthUseCase
import com.wukiki.domain.usecase.GetFundingUseCase
import com.wukiki.domain.usecase.GetMyPageUseCase
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asSharedFlow
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
class HomeViewModel @Inject constructor(
    application: Application,
    private val getAuthUseCase: GetAuthUseCase,
    private val getFundingUseCase: GetFundingUseCase,
    private val getMyPageUseCase: GetMyPageUseCase
) : AndroidViewModel(application), OnHomeClickListener {

    /*** UiState, UiEvent ***/
    private val _homeUiEvent = MutableSharedFlow<HomeUiEvent>()
    val homeUiEvent = _homeUiEvent.asSharedFlow()

    /*** Data ***/
    private val _user = MutableStateFlow<User?>(null)
    val user = _user.asStateFlow()

    private val _balance = MutableStateFlow<Int>(0)
    val balance = _balance.asStateFlow()

    private val _charge = MutableStateFlow<Int>(0)
    val charge = _charge.asStateFlow()

    private val _fundings = MutableStateFlow<List<List<Funding>>>(listOf(listOf(), listOf(), listOf(), listOf(), listOf(), listOf()))
    val fundings = _fundings.asStateFlow()

    private val _popularFundings = MutableStateFlow<List<Funding>>(emptyList())
    val popularFundings = _popularFundings.asStateFlow()

    init {
        initUserInfo()
        initFundings()
    }

    override fun onClickFunding() {
        viewModelScope.launch {
            _homeUiEvent.emit(HomeUiEvent.GoToDetailFunding)
        }
    }

    private fun fetchUserInfo(): Flow<User?> = flow {
        val user = getAuthUseCase.getUserInfo().first()
        emit(user)
    }

    private fun initFundings() {
        viewModelScope.launch {
            val response = getFundingUseCase.fetchFundings()

            when (response.status) {
                ApiStatus.SUCCESS -> {
                    val newFundings = response.data ?: emptyList()
                    setFundings(newFundings)
                }

                else -> {

                }
            }
        }
    }

    private fun setFundings(fundings: List<Funding>) {
        val allFundings = mutableListOf<Funding>()
        val birthFundings = mutableListOf<Funding>()
        val houseFundings = mutableListOf<Funding>()
        val marriageFundings = mutableListOf<Funding>()
        val graduateFundings = mutableListOf<Funding>()
        val jobFundings = mutableListOf<Funding>()
        val childFundings = mutableListOf<Funding>()

        fundings.forEach { funding ->
            allFundings.add(funding)
            when (funding.category) {
                "생일" -> birthFundings.add(funding)

                "집들이" -> houseFundings.add(funding)

                "결혼" -> marriageFundings.add(funding)

                "졸업" -> graduateFundings.add(funding)

                "취업" -> jobFundings.add(funding)

                "출산" -> childFundings.add(funding)
            }
        }

        val newFundings = listOf(
            allFundings,
            birthFundings,
            houseFundings,
            marriageFundings,
            graduateFundings,
            jobFundings,
            childFundings
        )
        _fundings.value = newFundings
        _popularFundings.value = allFundings.sortedByDescending { it.participantsNumber }.subList(0, 10)
    }

    private fun makePayRequestBody(): RequestBody {
        val metadata = mapOf(
            "amount" to _charge.value
        )
        val gson = GsonBuilder().serializeNulls().create()
        val json = gson.toJson(metadata)
        return json.toRequestBody("application/json".toMediaTypeOrNull())
    }

    private fun updateUserInfo() {
        viewModelScope.launch {
            _user.value = fetchUserInfo().first()
        }
    }

    fun initUserInfo() {
        viewModelScope.launch {
            val response = getAuthUseCase.fetchUserInfo()

            when (response.status) {
                ApiStatus.SUCCESS -> {
                    _user.value = response.data
                }

                else -> {
                    _homeUiEvent.emit(HomeUiEvent.AutoLoginFail)
                }
            }
        }
    }

    fun initAccount() {
        viewModelScope.launch {
            val response = getMyPageUseCase.fetchAccount()

            when (response.status) {
                ApiStatus.SUCCESS -> {
                    _balance.value = response.data ?: 0
                }

                else -> {

                }
            }
        }
    }

    fun setCharge(money: Int) {
        _charge.value = money
    }

    fun withdrawAccount() {
        viewModelScope.launch {
            val response = getMyPageUseCase.withdrawGivuPay(
                body = makePayRequestBody()
            )

            when (response.status) {
                ApiStatus.SUCCESS -> {
                    _homeUiEvent.emit(HomeUiEvent.WithdrawalSuccess)
                    _charge.value = 0
                    initUserInfo()
                }

                else -> {
                    _homeUiEvent.emit(HomeUiEvent.WithdrawalFail)
                }
            }
        }
    }

    fun logout() {
        viewModelScope.launch {
            getAuthUseCase.logout()
            updateUserInfo()
            _homeUiEvent.emit(HomeUiEvent.Logout)
        }
    }
}