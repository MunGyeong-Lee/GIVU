package com.wukiki.givu.views.home.viewmodel

sealed class HomeUiEvent {

    data object AutoLoginFail : HomeUiEvent()

    data object GoToDetailFunding : HomeUiEvent()
}