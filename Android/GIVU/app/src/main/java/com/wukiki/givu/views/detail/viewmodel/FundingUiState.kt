package com.wukiki.givu.views.detail.viewmodel

import com.wukiki.givu.util.InputValidState

data class FundingUiState(
    val fundingTitleState: InputValidState = InputValidState.NONE,
    val fundingCategoryState: InputValidState = InputValidState.NONE,
    val fundingDescriptionState: InputValidState = InputValidState.NONE
) {
    val isUpdateButton: Boolean =
        ((fundingTitleState == InputValidState.VALID) && (fundingCategoryState == InputValidState.VALID) && (fundingDescriptionState == InputValidState.VALID))
}