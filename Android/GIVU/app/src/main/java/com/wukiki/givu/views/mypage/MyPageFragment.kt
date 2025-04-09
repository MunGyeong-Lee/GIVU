package com.wukiki.givu.views.mypage

import android.os.Bundle
import android.view.View
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.fragment.app.activityViewModels
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import androidx.navigation.fragment.findNavController
import com.wukiki.givu.R
import com.wukiki.givu.config.BaseFragment
import com.wukiki.givu.databinding.FragmentMyPageBinding
import com.wukiki.givu.views.BiometricAuth
import com.wukiki.givu.views.MainViewModel
import com.wukiki.givu.views.home.viewmodel.HomeViewModel
import com.wukiki.givu.views.mypage.component.DepositAccountScreen
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class MyPageFragment : BaseFragment<FragmentMyPageBinding>(R.layout.fragment_my_page) {

    private val viewModel: HomeViewModel by activityViewModels()
    private val mainViewModel: MainViewModel by activityViewModels()
    private var biometricAuthForDepositResult = mutableStateOf(false)
    private var biometricAuthForChargeResult = mutableStateOf(false)

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        viewModel.initUserInfo()
        viewModel.initAccount()
        viewModel.initMyRegisterFundings()
        viewModel.initMyParticipateFundings()
        viewModel.initMyLikeProducts()
        viewModel.initMyFundingReviews()
//        viewModel.updatePaymentHistory()

        binding.composeMyPage.setContent {
            val navController = rememberNavController()
            val navBackStackEntry by navController.currentBackStackEntryAsState()
            val currentRoute = navBackStackEntry?.destination?.route

            if (biometricAuthForDepositResult.value) {
                LaunchedEffect(Unit) {
                    biometricAuthForDepositResult.value = false
                    viewModel.depositAccount()
                }
            }
            if (biometricAuthForChargeResult.value) {
                LaunchedEffect(Unit) {
                    biometricAuthForChargeResult.value = false
                    viewModel.withdrawAccount()
                }
            }

            LaunchedEffect(currentRoute) {
                if (currentRoute == "MyPageScreen") {
                    mainViewModel.setBnvState(true)
                } else {
                    mainViewModel.setBnvState(false)
                }
            }

            NavHost(
                navController = navController,
                startDestination = "MyPageScreen"
            ) {
                composable("MyPageScreen") {
                    viewModel.setCharge(0)
                    viewModel.setDeposit(0)
                    MyPageScreen(viewModel, navController, findNavController())
                }

                composable("PayUsageScreen") {
                    PayUsageScreen(viewModel, navController)
                }

                composable("UserInfoScreen") {
                    UserInfoScreen()
                }

                composable("ChargeAccount") {
                    ChargeAccountScreen(viewModel, navController, findNavController()) {
                        BiometricAuth(
                            activity = requireActivity(),
                            onSuccess = {
                                biometricAuthForChargeResult.value = true
                            },
                            onFailure = {
                                // 실패 시 처리
                            }
                        ).authenticate()
                    }
                }

                composable("DepositAccount") {
                    DepositAccountScreen(viewModel, navController, findNavController()) {
                        BiometricAuth(
                            activity = requireActivity(),
                            onSuccess = {
                                biometricAuthForDepositResult.value = true
                            },
                            onFailure = {
                                // 실패 시 처리
                            }
                        ).authenticate()
                    }
                }

                composable("MyRegisterFunding") {
                    MyRegisterFundingScreen(viewModel, findNavController())
                }

                composable("MyParticipateFunding") {
                    MyParticipateFundingScreen(viewModel, findNavController())
                }

                composable("MyLikeProduct") {
                    MyLikeProductScreen(viewModel, findNavController())
                }

                composable("MyFundingReview") {
                    MyFundingReviewScreen(viewModel, findNavController())
                }
            }
        }
    }
}