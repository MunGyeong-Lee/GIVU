package com.wukiki.givu.views

import android.os.Bundle
import androidx.activity.viewModels
import androidx.lifecycle.lifecycleScope
import androidx.navigation.NavController
import androidx.navigation.fragment.NavHostFragment
import androidx.navigation.ui.setupWithNavController
import com.wukiki.domain.model.ApiStatus
import com.wukiki.givu.R
import com.wukiki.givu.config.BaseActivity
import com.wukiki.givu.databinding.ActivityMainBinding
import com.wukiki.givu.views.community.viewmodel.CommunityViewModel
import com.wukiki.givu.views.detail.viewmodel.FundingViewModel
import com.wukiki.givu.views.home.viewmodel.HomeViewModel
import com.wukiki.givu.views.mall.viewmodel.MallViewModel
import com.wukiki.givu.views.register.viewmodel.RegisterViewModel
import com.wukiki.givu.views.search.viewmodel.SearchViewModel
import dagger.hilt.android.AndroidEntryPoint
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.launch
import timber.log.Timber

@AndroidEntryPoint
class MainActivity : BaseActivity<ActivityMainBinding>(ActivityMainBinding::inflate) {

    private val mainViewModel: MainViewModel by viewModels()
    private val homeViewModel: HomeViewModel by viewModels()
    private val communityViewModel: CommunityViewModel by viewModels()
    private val fundingViewModel: FundingViewModel by viewModels()
    private val registerViewModel: RegisterViewModel by viewModels()
    private val searchViewModel: SearchViewModel by viewModels()
    private val mallViewModel: MallViewModel by viewModels()
    private lateinit var navController: NavController
    private val navHostFragment: NavHostFragment by lazy {
        supportFragmentManager.findFragmentById(R.id.fcv_main) as NavHostFragment
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        binding.vm = mainViewModel
        binding.lifecycleOwner = this

        setBottomNavigationBar()
        setLoading()
        setUserStateInHome()
        setFundingsStateInHome()
        setMyRegisterFundingsStateInHome()
        setMyParticipateFundingsStateInHome()
        setAccountStateInHome()
        setProductsStateInHome()
        setReviewsStateInHome()
        setUserStateInFunding()
        setFundingStateInFunding()
        setFundingDetailStateInFunding()
        setTransferStateInFunding()
        setLetterStateInFunding()
        setAccountStateInFunding()
        setProductsStateInFunding()
        setReviewStateInFunding()
        setFundingStateInRegister()
        setProductsStateInRegister()
        setFundingsStateInSearch()
        setProductsStateInMall()
        setProductDetailStateInMall()
    }

    private fun setBottomNavigationBar() {
        navController = navHostFragment.navController
        navController.setGraph(R.navigation.nav_graph_main)
        binding.bnvMain.setupWithNavController(navController = navController)
    }

    private fun setLoading() {
        lifecycleScope.launch {
            mainViewModel.loadingState.collectLatest { loadingTaskCount ->
                Timber.d("Loading Task: $loadingTaskCount")
                if (loadingTaskCount > 0) {
                    binding.rootMain.isClickable = true
                    binding.rootMain.isFocusable = true
                    binding.loadingAnimation.playAnimation()
                } else {
                    binding.rootMain.isClickable = false
                    binding.rootMain.isFocusable = false
                    binding.loadingAnimation.cancelAnimation()
                }
            }
        }
    }

    private fun setUserStateInHome() {
        lifecycleScope.launch {
            homeViewModel.userState.collectLatest { state ->
                when (state.status) {
                    ApiStatus.LOADING -> {
                        mainViewModel.addLoadingTask()
                    }

                    ApiStatus.SUCCESS -> {
                        mainViewModel.removeLoadingTask()
                    }

                    ApiStatus.ERROR -> {
                        mainViewModel.removeLoadingTask()
                    }

                    ApiStatus.FAIL -> {
                        mainViewModel.removeLoadingTask()
                    }

                    else -> {}
                }
            }
        }
    }

    private fun setFundingsStateInHome() {
        lifecycleScope.launch {
            homeViewModel.fundingsState.collectLatest { state ->
                when (state.status) {
                    ApiStatus.LOADING -> {
                        mainViewModel.addLoadingTask()
                    }

                    ApiStatus.SUCCESS -> {
                        mainViewModel.removeLoadingTask()
                    }

                    ApiStatus.ERROR -> {
                        mainViewModel.removeLoadingTask()
                    }

                    ApiStatus.FAIL -> {
                        mainViewModel.removeLoadingTask()
                    }

                    else -> {}
                }
            }
        }
    }

    private fun setMyRegisterFundingsStateInHome() {
        lifecycleScope.launch {
            homeViewModel.myRegisterFundingsState.collectLatest { state ->
                when (state.status) {
                    ApiStatus.LOADING -> {
                        mainViewModel.addLoadingTask()
                    }

                    ApiStatus.SUCCESS -> {
                        mainViewModel.removeLoadingTask()
                    }

                    ApiStatus.ERROR -> {
                        mainViewModel.removeLoadingTask()
                    }

                    ApiStatus.FAIL -> {
                        mainViewModel.removeLoadingTask()
                    }

                    else -> {}
                }
            }
        }
    }

    private fun setMyParticipateFundingsStateInHome() {
        lifecycleScope.launch {
            homeViewModel.myParticipateFundingsState.collectLatest { state ->
                when (state.status) {
                    ApiStatus.LOADING -> {
                        mainViewModel.addLoadingTask()
                    }

                    ApiStatus.SUCCESS -> {
                        mainViewModel.removeLoadingTask()
                    }

                    ApiStatus.ERROR -> {
                        mainViewModel.removeLoadingTask()
                    }

                    ApiStatus.FAIL -> {
                        mainViewModel.removeLoadingTask()
                    }

                    else -> {}
                }
            }
        }
    }

    private fun setAccountStateInHome() {
        lifecycleScope.launch {
            homeViewModel.accountState.collectLatest { state ->
                when (state.status) {
                    ApiStatus.LOADING -> {
                        mainViewModel.addLoadingTask()
                    }

                    ApiStatus.SUCCESS -> {
                        mainViewModel.removeLoadingTask()
                    }

                    ApiStatus.ERROR -> {
                        mainViewModel.removeLoadingTask()
                    }

                    ApiStatus.FAIL -> {
                        mainViewModel.removeLoadingTask()
                    }

                    else -> {}
                }
            }
        }
    }

    private fun setProductsStateInHome() {
        lifecycleScope.launch {
            homeViewModel.productsState.collectLatest { state ->
                when (state.status) {
                    ApiStatus.LOADING -> {
                        mainViewModel.addLoadingTask()
                    }

                    ApiStatus.SUCCESS -> {
                        mainViewModel.removeLoadingTask()
                    }

                    ApiStatus.ERROR -> {
                        mainViewModel.removeLoadingTask()
                    }

                    ApiStatus.FAIL -> {
                        mainViewModel.removeLoadingTask()
                    }

                    else -> {}
                }
            }
        }
    }

    private fun setReviewsStateInHome() {
        lifecycleScope.launch {
            homeViewModel.reviewsState.collectLatest { state ->
                when (state.status) {
                    ApiStatus.LOADING -> {
                        mainViewModel.addLoadingTask()
                    }

                    ApiStatus.SUCCESS -> {
                        mainViewModel.removeLoadingTask()
                    }

                    ApiStatus.ERROR -> {
                        mainViewModel.removeLoadingTask()
                    }

                    ApiStatus.FAIL -> {
                        mainViewModel.removeLoadingTask()
                    }

                    else -> {}
                }
            }
        }
    }

    private fun setUserStateInFunding() {
        lifecycleScope.launch {
            fundingViewModel.userState.collectLatest { state ->
                when (state.status) {
                    ApiStatus.LOADING -> {
                        mainViewModel.addLoadingTask()
                    }

                    ApiStatus.SUCCESS -> {
                        mainViewModel.removeLoadingTask()
                    }

                    ApiStatus.ERROR -> {
                        mainViewModel.removeLoadingTask()
                    }

                    ApiStatus.FAIL -> {
                        mainViewModel.removeLoadingTask()
                    }

                    else -> {}
                }
            }
        }
    }

    private fun setFundingStateInFunding() {
        lifecycleScope.launch {
            fundingViewModel.fundingState.collectLatest { state ->
                when (state.status) {
                    ApiStatus.LOADING -> {
                        Timber.d("로딩중")
                        mainViewModel.addLoadingTask()
                    }

                    ApiStatus.SUCCESS -> {
                        Timber.d("로딩 끝")
                        mainViewModel.removeLoadingTask()
                    }

                    ApiStatus.ERROR -> {
                        mainViewModel.removeLoadingTask()
                    }

                    ApiStatus.FAIL -> {
                        mainViewModel.removeLoadingTask()
                    }

                    else -> {}
                }
            }
        }
    }

    private fun setFundingDetailStateInFunding() {
        lifecycleScope.launch {
            fundingViewModel.fundingDetailState.collectLatest { state ->
                when (state.status) {
                    ApiStatus.LOADING -> {
                        mainViewModel.addLoadingTask()
                    }

                    ApiStatus.SUCCESS -> {
                        mainViewModel.removeLoadingTask()
                    }

                    ApiStatus.ERROR -> {
                        mainViewModel.removeLoadingTask()
                    }

                    ApiStatus.FAIL -> {
                        mainViewModel.removeLoadingTask()
                    }

                    else -> {}
                }
            }
        }
    }

    private fun setTransferStateInFunding() {
        lifecycleScope.launch {
            fundingViewModel.transferState.collectLatest { state ->
                when (state.status) {
                    ApiStatus.LOADING -> {
                        mainViewModel.addLoadingTask()
                    }

                    ApiStatus.SUCCESS -> {
                        mainViewModel.removeLoadingTask()
                    }

                    ApiStatus.ERROR -> {
                        mainViewModel.removeLoadingTask()
                    }

                    ApiStatus.FAIL -> {
                        mainViewModel.removeLoadingTask()
                    }

                    else -> {}
                }
            }
        }
    }

    private fun setLetterStateInFunding() {
        lifecycleScope.launch {
            fundingViewModel.letterState.collectLatest { state ->
                when (state.status) {
                    ApiStatus.LOADING -> {
                        mainViewModel.addLoadingTask()
                    }

                    ApiStatus.SUCCESS -> {
                        mainViewModel.removeLoadingTask()
                    }

                    ApiStatus.ERROR -> {
                        mainViewModel.removeLoadingTask()
                    }

                    ApiStatus.FAIL -> {
                        mainViewModel.removeLoadingTask()
                    }

                    else -> {}
                }
            }
        }
    }

    private fun setAccountStateInFunding() {
        lifecycleScope.launch {
            fundingViewModel.accountState.collectLatest { state ->
                when (state.status) {
                    ApiStatus.LOADING -> {
                        mainViewModel.addLoadingTask()
                    }

                    ApiStatus.SUCCESS -> {
                        mainViewModel.removeLoadingTask()
                    }

                    ApiStatus.ERROR -> {
                        mainViewModel.removeLoadingTask()
                    }

                    ApiStatus.FAIL -> {
                        mainViewModel.removeLoadingTask()
                    }

                    else -> {}
                }
            }
        }
    }

    private fun setProductsStateInFunding() {
        lifecycleScope.launch {
            fundingViewModel.productsState.collectLatest { state ->
                when (state.status) {
                    ApiStatus.LOADING -> {
                        mainViewModel.addLoadingTask()
                    }

                    ApiStatus.SUCCESS -> {
                        mainViewModel.removeLoadingTask()
                    }

                    ApiStatus.ERROR -> {
                        mainViewModel.removeLoadingTask()
                    }

                    ApiStatus.FAIL -> {
                        mainViewModel.removeLoadingTask()
                    }

                    else -> {}
                }
            }
        }
    }

    private fun setReviewStateInFunding() {
        lifecycleScope.launch {
            fundingViewModel.reviewState.collectLatest { state ->
                when (state.status) {
                    ApiStatus.LOADING -> {
                        mainViewModel.addLoadingTask()
                    }

                    ApiStatus.SUCCESS -> {
                        mainViewModel.removeLoadingTask()
                    }

                    ApiStatus.ERROR -> {
                        mainViewModel.removeLoadingTask()
                    }

                    ApiStatus.FAIL -> {
                        mainViewModel.removeLoadingTask()
                    }

                    else -> {}
                }
            }
        }
    }

    private fun setFundingStateInRegister() {
        lifecycleScope.launch {
            registerViewModel.fundingState.collectLatest { state ->
                when (state.status) {
                    ApiStatus.LOADING -> {
                        mainViewModel.addLoadingTask()
                    }

                    ApiStatus.SUCCESS -> {
                        mainViewModel.removeLoadingTask()
                    }

                    ApiStatus.ERROR -> {
                        mainViewModel.removeLoadingTask()
                    }

                    ApiStatus.FAIL -> {
                        mainViewModel.removeLoadingTask()
                    }

                    else -> {}
                }
            }
        }
    }

    private fun setProductsStateInRegister() {
        lifecycleScope.launch {
            registerViewModel.productsState.collectLatest { state ->
                when (state.status) {
                    ApiStatus.LOADING -> {
                        mainViewModel.addLoadingTask()
                    }

                    ApiStatus.SUCCESS -> {
                        mainViewModel.removeLoadingTask()
                    }

                    ApiStatus.ERROR -> {
                        mainViewModel.removeLoadingTask()
                    }

                    ApiStatus.FAIL -> {
                        mainViewModel.removeLoadingTask()
                    }

                    else -> {}
                }
            }
        }
    }

    private fun setFundingsStateInSearch() {
        lifecycleScope.launch {
            searchViewModel.fundingsState.collectLatest { state ->
                when (state.status) {
                    ApiStatus.LOADING -> {
                        mainViewModel.addLoadingTask()
                    }

                    ApiStatus.SUCCESS -> {
                        mainViewModel.removeLoadingTask()
                    }

                    ApiStatus.ERROR -> {
                        mainViewModel.removeLoadingTask()
                    }

                    ApiStatus.FAIL -> {
                        mainViewModel.removeLoadingTask()
                    }

                    else -> {}
                }
            }
        }
    }

    private fun setProductsStateInMall() {
        lifecycleScope.launch {
            mallViewModel.productsState.collectLatest { state ->
                when (state.status) {
                    ApiStatus.LOADING -> {
                        mainViewModel.addLoadingTask()
                    }

                    ApiStatus.SUCCESS -> {
                        mainViewModel.removeLoadingTask()
                    }

                    ApiStatus.ERROR -> {
                        mainViewModel.removeLoadingTask()
                    }

                    ApiStatus.FAIL -> {
                        mainViewModel.removeLoadingTask()
                    }

                    else -> {}
                }
            }
        }
    }

    private fun setProductDetailStateInMall() {
        lifecycleScope.launch {
            mallViewModel.productDetailState.collectLatest { state ->
                when (state.status) {
                    ApiStatus.LOADING -> {
                        mainViewModel.addLoadingTask()
                    }

                    ApiStatus.SUCCESS -> {
                        mainViewModel.removeLoadingTask()
                    }

                    ApiStatus.ERROR -> {
                        mainViewModel.removeLoadingTask()
                    }

                    ApiStatus.FAIL -> {
                        mainViewModel.removeLoadingTask()
                    }

                    else -> {}
                }
            }
        }
    }
}