package com.wukiki.givu.views.mall.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import com.wukiki.domain.usecase.GetProductUseCase
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject

@HiltViewModel
class MallDetailViewModel @Inject constructor(
    application: Application,
    private val getProductUseCase: GetProductUseCase
) : AndroidViewModel(application) {

}