package com.wukiki.givu.views.mall.viewmodel

sealed class MallUiEvent {

    data object GetProductsFail : MallUiEvent()

    data object GoToProductDetail : MallUiEvent()

    data object LikeProductSuccess : MallUiEvent()

    data object LikeProductFail : MallUiEvent()

    data object CancelLikeProductSuccess : MallUiEvent()

    data object CancelLikeProductFail : MallUiEvent()
}