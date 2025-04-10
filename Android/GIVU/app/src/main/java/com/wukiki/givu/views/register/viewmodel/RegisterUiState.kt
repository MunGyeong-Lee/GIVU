package com.wukiki.givu.views.register.viewmodel

import com.wukiki.givu.util.InputValidState

data class RegisterUiState(
    val productSelectState: InputValidState = InputValidState.NONE,
    val fundingTitleState: InputValidState = InputValidState.NONE,
    val fundingCategoryState: InputValidState = InputValidState.NONE,
    val fundingDescriptionState: InputValidState = InputValidState.NONE
) {
    val isSecondStepButton: Boolean = (productSelectState == InputValidState.VALID)
    val isRegisterButton: Boolean =
        ((fundingTitleState == InputValidState.VALID) && (fundingCategoryState == InputValidState.VALID) && (fundingDescriptionState == InputValidState.VALID))
}