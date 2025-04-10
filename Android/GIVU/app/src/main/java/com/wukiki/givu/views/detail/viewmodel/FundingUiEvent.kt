package com.wukiki.givu.views.detail.viewmodel

sealed class FundingUiEvent {

    data object GetProductsFail : FundingUiEvent()

    data object TransferFail : FundingUiEvent()

    data object WithdrawalSuccess : FundingUiEvent()

    data object WithdrawalFail : FundingUiEvent()

    data object DeleteLetterSuccess : FundingUiEvent()

    data object DeleteLetterFail : FundingUiEvent()

    data object ParticipateFundingSuccess : FundingUiEvent()

    data object ParticipateFundingFail : FundingUiEvent()

    data object UpdateFundingSuccess : FundingUiEvent()

    data object UpdateFundingFail : FundingUiEvent()

    data object CancelFundingSuccess : FundingUiEvent()

    data object CancelFundingFail : FundingUiEvent()

    data object FinishFundingSuccess : FundingUiEvent()

    data object FinishFundingFail : FundingUiEvent()
}