package com.wukiki.givu.views.detail.viewmodel

sealed class FundingUiEvent {

    data object GetProductsFail : FundingUiEvent()
}