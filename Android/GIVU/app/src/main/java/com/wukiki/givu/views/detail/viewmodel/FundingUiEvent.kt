package com.wukiki.givu.views.detail.viewmodel

sealed class FundingUiEvent {

    data object GetProductsFail : FundingUiEvent()

    data object ParticipateFundingSuccess : FundingUiEvent()

    data object ParticipateFundingFail : FundingUiEvent()

    data object UpdateFundingSuccess : FundingUiEvent()

    data object UpdateFundingFail : FundingUiEvent()

    data object CancelFundingSuccess : FundingUiEvent()

    data object CancelFundingFail : FundingUiEvent()

    data object FinishFundingSuccess : FundingUiEvent()

    data object FinishFundingFail : FundingUiEvent()
}