package com.wukiki.givu.views.home.viewmodel

sealed class HomeUiEvent {

    data object AutoLoginFail : HomeUiEvent()

    data object GoToDetailFunding : HomeUiEvent()

    data object DepositSuccess : HomeUiEvent()

    data object DepositFail : HomeUiEvent()

    data object WithdrawalSuccess : HomeUiEvent()

    data object WithdrawalFail : HomeUiEvent()

    data object Logout : HomeUiEvent()
}