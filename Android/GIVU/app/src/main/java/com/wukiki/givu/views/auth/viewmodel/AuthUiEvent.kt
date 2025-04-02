package com.wukiki.givu.views.auth.viewmodel

sealed class AuthUiEvent {

    data object LoginSuccess : AuthUiEvent()

    data object LoginFail : AuthUiEvent()
}