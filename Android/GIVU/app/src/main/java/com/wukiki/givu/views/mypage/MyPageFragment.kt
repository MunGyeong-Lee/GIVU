package com.wukiki.givu.views.mypage

import android.os.Bundle
import android.view.View
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.fragment.app.activityViewModels
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import androidx.navigation.fragment.findNavController
import com.wukiki.givu.R
import com.wukiki.givu.config.BaseFragment
import com.wukiki.givu.databinding.FragmentMyPageBinding
import com.wukiki.givu.views.MainViewModel
import com.wukiki.givu.views.home.viewmodel.HomeViewModel
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class MyPageFragment : BaseFragment<FragmentMyPageBinding>(R.layout.fragment_my_page) {

    private val viewModel: HomeViewModel by activityViewModels()
    private val mainViewModel: MainViewModel by activityViewModels()

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        viewModel.initUserInfo()
        viewModel.initMyRegisterFundings()
        viewModel.initMyParticipateFundings()

        binding.composeMyPage.setContent {
            val navController = rememberNavController()
            val navBackStackEntry by navController.currentBackStackEntryAsState()
            val currentRoute = navBackStackEntry?.destination?.route

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
                    MyPageScreen(viewModel, navController)
                }

                composable("PayUsageScreen") {
                    PayUsageScreen()
                }

                composable("UserInfoScreen") {
                    UserInfoScreen()
                }

                composable("ChargeAccount") {
                    ChargeAccountScreen(viewModel, navController, findNavController())
                }

                composable("MyRegisterFunding") {
                    MyRegisterFundingScreen(viewModel, findNavController())
                }
            }
        }
    }
}