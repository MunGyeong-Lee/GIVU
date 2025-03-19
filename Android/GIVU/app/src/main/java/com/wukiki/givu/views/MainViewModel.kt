package com.wukiki.givu.views

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import javax.inject.Inject

@HiltViewModel
class MainViewModel @Inject constructor(
    application: Application
) : AndroidViewModel(application) {

    private val _bnvState = MutableStateFlow<Boolean>(true)
    val bnvState = _bnvState.asStateFlow()

    fun setBnvState(isVisible: Boolean) {
        _bnvState.value = isVisible
    }
}