package com.wukiki.givu.views.register.viewmodel

sealed class RegisterUiEvent {

    data object GetProductsFail : RegisterUiEvent()

    data object RegisterFundingSuccess : RegisterUiEvent()

    data object RegisterFundingFail : RegisterUiEvent()
}