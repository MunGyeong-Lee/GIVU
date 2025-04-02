package com.wukiki.givu.views.home.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.wukiki.domain.model.ApiStatus
import com.wukiki.domain.model.Funding
import com.wukiki.domain.model.User
import com.wukiki.domain.usecase.GetAuthUseCase
import com.wukiki.domain.usecase.GetFundingUseCase
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asSharedFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.launch
import timber.log.Timber
import javax.inject.Inject

@HiltViewModel
class HomeViewModel @Inject constructor(
    application: Application,
    private val getAuthUseCase: GetAuthUseCase,
    private val getFundingUseCase: GetFundingUseCase
) : AndroidViewModel(application), OnHomeClickListener {

    /*** UiState, UiEvent ***/
    private val _homeUiEvent = MutableSharedFlow<HomeUiEvent>()
    val homeUiEvent = _homeUiEvent.asSharedFlow()

    /*** Data ***/
    private val _user = MutableStateFlow<User?>(null)
    val user = _user.asStateFlow()

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

    private fun initUserInfo() {
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

    private fun initFundings() {
        viewModelScope.launch {
            val response = getFundingUseCase.fetchFundings()

            when (response.status) {
                ApiStatus.SUCCESS -> {
                    val newFundings = response.data ?: emptyList()
                    Timber.d("Fundings: $newFundings")
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

    fun updateUserInfo() {
        viewModelScope.launch {
            _user.value = fetchUserInfo().first()
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