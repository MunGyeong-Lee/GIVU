package com.wukiki.givu.views.mall.viewmodel

sealed class MallUiEvent {

    data object GetProductsFail : MallUiEvent()

    data object GoToProductDetail : MallUiEvent()
}