package com.wukiki.givu.views.search.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.wukiki.domain.model.ApiResult
import com.wukiki.domain.model.ApiStatus
import com.wukiki.domain.model.Funding
import com.wukiki.domain.usecase.GetFundingUseCase
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.launch
import timber.log.Timber
import javax.inject.Inject

@HiltViewModel
class SearchViewModel @Inject constructor(
    application: Application,
    private val getFundingUseCase: GetFundingUseCase
) : AndroidViewModel(application) {

    /*** Ui State ***/
    private val _fundingsState =
        MutableStateFlow<ApiResult<List<Funding>>>(ApiResult.init())
    val fundingsState = _fundingsState.asStateFlow()

    /*** Datas ***/
    private val _searchKeyword = MutableStateFlow<String>("")
    val searchKeyword = _searchKeyword

    private val _searchResults = MutableStateFlow<List<Funding>>(emptyList())
    val searchResults = _searchResults.asStateFlow()

    private val _sortOption = MutableStateFlow("최신순")
    val sortOption = _sortOption.asStateFlow()

    fun updateSortOption(option: String) {
        _sortOption.value = option
        val newResults = _searchResults.value.toMutableList()
        when (_sortOption.value) {
            "최신순" -> {
                _searchResults.value = newResults.sortedByDescending { it.createdAt }
            }

            "오래된순" -> {
                _searchResults.value = newResults.sortedBy { it.createdAt }
            }

            "참여도순" -> {
                _searchResults.value = newResults.sortedByDescending { it.participantsNumber }
            }

            "달성률순" -> {
                _searchResults.value =
                    newResults.sortedByDescending { (it.fundedAmount.toFloat() / it.productPrice.toFloat()) }
            }
        }

        Timber.d("Result: ${_searchResults.value}")
    }

    fun search(keyword: String) {
        viewModelScope.launch {
            when (_searchKeyword.value.isBlank()) {
                true -> {
                    _searchResults.value = emptyList()
                }

                else -> {
                    val response = getFundingUseCase.searchFundings(keyword)

                    response.collectLatest { result ->
                        _fundingsState.value = result
                        if (result.status == ApiStatus.SUCCESS) {
                            val newResult = result.data?.toMutableList()
                                ?: emptyList<Funding>().toMutableList()
                            newResult.sortByDescending { it.createdAt }
                            _searchResults.value = newResult
                        }
                    }
                }
            }
        }
    }
}