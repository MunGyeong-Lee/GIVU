package com.wukiki.givu.views.detail.viewmodel

import com.wukiki.givu.util.CheckState
import com.wukiki.givu.util.InputValidState

data class FundingUiState(
    val fundingTitleState: InputValidState = InputValidState.NONE,
    val fundingCategoryState: InputValidState = InputValidState.NONE,
    val fundingDescriptionState: InputValidState = InputValidState.NONE,
    val reviewCommentState: InputValidState = InputValidState.NONE,
    val reviewPersonalCheck: CheckState = CheckState.FALSE,
    val reviewNoteCheck: CheckState = CheckState.FALSE
) {
    val isUpdateButton: Boolean =
        ((fundingTitleState == InputValidState.VALID) && (fundingCategoryState == InputValidState.VALID) && (fundingDescriptionState == InputValidState.VALID))
    val isFinishButton: Boolean =
        ((reviewCommentState == InputValidState.VALID) && (reviewPersonalCheck == CheckState.TRUE) && (reviewNoteCheck == CheckState.TRUE))
}