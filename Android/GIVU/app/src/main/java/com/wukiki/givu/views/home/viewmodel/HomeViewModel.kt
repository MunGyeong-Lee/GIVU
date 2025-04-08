package com.wukiki.givu.views.home.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.google.gson.GsonBuilder
import com.wukiki.domain.model.Account
import com.wukiki.domain.model.ApiResult
import com.wukiki.domain.model.ApiStatus
import com.wukiki.domain.model.Funding
import com.wukiki.domain.model.Product
import com.wukiki.domain.model.Review
import com.wukiki.domain.model.User
import com.wukiki.domain.usecase.GetAuthUseCase
import com.wukiki.domain.usecase.GetFundingUseCase
import com.wukiki.domain.usecase.GetMyPageUseCase
import com.wukiki.domain.usecase.GetProductUseCase
import com.wukiki.domain.usecase.GetReviewUseCase
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asSharedFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.launch
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.RequestBody
import okhttp3.RequestBody.Companion.toRequestBody
import javax.inject.Inject

@HiltViewModel
class HomeViewModel @Inject constructor(
    application: Application,
    private val getAuthUseCase: GetAuthUseCase,
    private val getFundingUseCase: GetFundingUseCase,
    private val getMyPageUseCase: GetMyPageUseCase,
    private val getProductUseCase: GetProductUseCase,
    private val getReviewUseCase: GetReviewUseCase
) : AndroidViewModel(application), OnHomeClickListener {

    /*** UiState, UiEvent ***/
    private val _homeUiEvent = MutableSharedFlow<HomeUiEvent>()
    val homeUiEvent = _homeUiEvent.asSharedFlow()

    private val _userState = MutableStateFlow<ApiResult<User?>>(ApiResult.init())
    val userState = _userState.asStateFlow()

    private val _fundingsState = MutableStateFlow<ApiResult<List<Funding>>>(ApiResult.init())
    val fundingsState = _fundingsState.asStateFlow()

    private val _accountState = MutableStateFlow<ApiResult<Account?>>(ApiResult.init())
    val accountState = _accountState.asStateFlow()

    private val _productsState =
        MutableStateFlow<ApiResult<List<Product>>>(ApiResult.init())
    val productsState = _productsState.asStateFlow()

    private val _reviewsState = MutableStateFlow<ApiResult<List<Review>>>(ApiResult.init())
    val reviewsState = _reviewsState.asStateFlow()

    /*** Data ***/
    private val _user = MutableStateFlow<User?>(null)
    val user = _user.asStateFlow()

    private val _account = MutableStateFlow<Account?>(null)
    val account = _account.asStateFlow()

    private val _myRegisterFundings = MutableStateFlow<List<Funding>>(emptyList())
    val myRegisterFundings = _myRegisterFundings.asStateFlow()

    private val _myParticipateFundings = MutableStateFlow<List<Funding>>(emptyList())
    val myParticipateFundings = _myParticipateFundings.asStateFlow()

    private val _myLikeProducts = MutableStateFlow<List<Product>>(emptyList())
    val myLikeProducts = _myLikeProducts.asStateFlow()

    private val _myFundingReviews = MutableStateFlow<List<Review>>(emptyList())
    val myFundingReviews = _myFundingReviews.asStateFlow()

    private val _charge = MutableStateFlow<Int>(0)
    val charge = _charge.asStateFlow()

    private val _fundings = MutableStateFlow<List<List<Funding>>>(listOf(listOf(), listOf(), listOf(), listOf(), listOf(), listOf()))
    val fundings = _fundings.asStateFlow()

    private val _popularFundings = MutableStateFlow<List<Funding>>(emptyList())
    val popularFundings = _popularFundings.asStateFlow()

    init {
        initUserInfo()
        initFundings()
    }

    override fun onClickFunding() {
        viewModelScope.launch {
            _homeUiEvent.emit(HomeUiEvent.GoToDetailFunding)
        }
    }

    private fun fetchUserInfo(): Flow<User?> = flow {
        val user = getAuthUseCase.getUserInfo().first()
        emit(user)
    }

    private fun setFundings(fundings: List<Funding>) {
        val allFundings = mutableListOf<Funding>()
        val birthFundings = mutableListOf<Funding>()
        val houseFundings = mutableListOf<Funding>()
        val marriageFundings = mutableListOf<Funding>()
        val graduateFundings = mutableListOf<Funding>()
        val jobFundings = mutableListOf<Funding>()
        val childFundings = mutableListOf<Funding>()

        fundings.forEach { funding ->
            allFundings.add(funding)
            when (funding.category) {
                "생일" -> birthFundings.add(funding)

                "집들이" -> houseFundings.add(funding)

                "결혼" -> marriageFundings.add(funding)

                "졸업" -> graduateFundings.add(funding)

                "취업" -> jobFundings.add(funding)

                "출산" -> childFundings.add(funding)
            }
        }

        val newFundings = listOf(
            allFundings,
            birthFundings,
            houseFundings,
            marriageFundings,
            graduateFundings,
            jobFundings,
            childFundings
        )
        _fundings.value = newFundings
        _popularFundings.value = allFundings.sortedByDescending { it.participantsNumber }.subList(0, 5)
    }

    private fun makePayRequestBody(): RequestBody {
        val metadata = mapOf(
            "amount" to _charge.value
        )
        val gson = GsonBuilder().serializeNulls().create()
        val json = gson.toJson(metadata)
        return json.toRequestBody("application/json".toMediaTypeOrNull())
    }

    private fun updateUserInfo() {
        viewModelScope.launch {
            _user.value = fetchUserInfo().first()
        }
    }

    fun initUserInfo() {
        viewModelScope.launch {
            val response = getAuthUseCase.fetchUserInfo()

            response.collectLatest { result ->
                _userState.value = result
                if (_userState.value.status == ApiStatus.SUCCESS) {
                    _user.value = _userState.value.data
                }
            }
        }
    }

    fun initFundings() {
        viewModelScope.launch {
            val response = getFundingUseCase.fetchFundings()

            response.collectLatest { result ->
                _fundingsState.value = result
                if (_fundingsState.value.status == ApiStatus.SUCCESS) {
                    val newFundings = result.data ?: emptyList()
                    setFundings(newFundings)
                }
            }
        }
    }

    fun initMyRegisterFundings() {
        viewModelScope.launch {
            val response = getMyPageUseCase.fetchMyRegisterFundings()

            response.collectLatest { result ->
                _fundingsState.value = result
                if (_fundingsState.value.status == ApiStatus.SUCCESS) {
                    _myRegisterFundings.value = result.data ?: emptyList()
                }
            }
        }
    }

    fun initMyParticipateFundings() {
        viewModelScope.launch {
            val response = getMyPageUseCase.fetchMyParticipateFundings()

            response.collectLatest { result ->
                _fundingsState.value = result
                if (_fundingsState.value.status == ApiStatus.SUCCESS) {
                    _myParticipateFundings.value = result.data ?: emptyList()
                }
            }
        }
    }

    fun initMyLikeProducts() {
        viewModelScope.launch {
            val response = getProductUseCase.fetchProductsLike()

            response.collectLatest { result ->
                _productsState.value = result
                if (result.status == ApiStatus.SUCCESS) {
                    val newProducts = result.data ?: emptyList()
                    _myLikeProducts.value = newProducts
                }
            }
        }
    }

    fun initMyFundingReviews() {
        viewModelScope.launch {
            val response = getReviewUseCase.fetchFundingReviews()

            response.collectLatest { result ->
                _reviewsState.value = result
                if (result.status == ApiStatus.SUCCESS) {
                    val newReviews = result.data ?: emptyList()
                    _myFundingReviews.value = newReviews
                }
            }
        }
    }

    fun initAccount() {
        viewModelScope.launch {
            val response = getMyPageUseCase.fetchAccount()

            response.collectLatest { result ->
                _accountState.value = result
                if (result.status == ApiStatus.SUCCESS) {
                    _account.value = result.data
                }
            }
        }
    }

    fun setCharge(money: Int) {
        _charge.value = money
    }

    fun withdrawAccount() {
        viewModelScope.launch {
            val response = getMyPageUseCase.withdrawGivuPay(
                body = makePayRequestBody()
            )

            response.collectLatest { result ->
                if (result.status == ApiStatus.SUCCESS) {
                    _homeUiEvent.emit(HomeUiEvent.WithdrawalSuccess)
                    _charge.value = 0
                    initUserInfo()
                } else if (result.status == ApiStatus.FAIL) {
                    _homeUiEvent.emit(HomeUiEvent.WithdrawalFail)
                }
            }
        }
    }

    fun logout() {
        viewModelScope.launch {
            getAuthUseCase.logout()
            updateUserInfo()
            _homeUiEvent.emit(HomeUiEvent.Logout)
        }
    }
}