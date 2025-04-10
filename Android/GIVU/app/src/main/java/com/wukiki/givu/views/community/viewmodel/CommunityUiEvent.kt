package com.wukiki.givu.views.community.viewmodel

sealed class CommunityUiEvent {

    data object GoToLogin : CommunityUiEvent()
}