package com.wukiki.givu.views.register

import android.os.Bundle
import android.view.View
import androidx.fragment.app.activityViewModels
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.fragment.findNavController
import com.wukiki.givu.R
import com.wukiki.givu.config.BaseFragment
import com.wukiki.givu.databinding.FragmentRegisterFundingBinding
import com.wukiki.givu.views.MainViewModel
import com.wukiki.givu.views.register.viewmodel.RegisterViewModel
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class RegisterFundingFragment :
    BaseFragment<FragmentRegisterFundingBinding>(R.layout.fragment_register_funding) {

    private val viewModel: RegisterViewModel by activityViewModels()
    private val mainViewModel: MainViewModel by activityViewModels()

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        binding.vm = viewModel

        binding.composeRegisterFunding.setContent {

//            val navController = rememberAnimatedNavController()
//            AnimatedNavHost(
//                navController = navController,
//                startDestination = "RegisterStep1",
//                enterTransition = {
//                    slideInHorizontally(initialOffsetX = { it }) + fadeIn()
//                },
//                exitTransition = {
//                    slideOutHorizontally(targetOffsetX = { -it }) + fadeOut()
//                },
//                popEnterTransition = {
//                    slideInHorizontally(initialOffsetX = { -it }) + fadeIn()
//                },
//                popExitTransition = {
//                    slideOutHorizontally(targetOffsetX = { it }) + fadeOut()
//                }
//            ) {
//                composable("RegisterStep1") {
//                    RegisterFundingScreen(navController)
//                }
//
//                composable("RegisterInputStep2") {
//                    RegisterInputScreen()
//                }
//
//                composable("SelectPresent") {
//                    SelectPresentScreen(navController)
//
//                }
//                composable("DetailPresent") {
//                    DetailPresentScreen()
//                }
//            }


            val navController = rememberNavController()
//            val navController = rememberAnimatedNavController()
//            AnimatedNavHost(
            NavHost(
                navController = navController,
                startDestination = "RegisterStep1"
            ) {

                composable("RegisterStep1") {
                    RegisterFundingScreen(viewModel, navController, findNavController())
                }

                composable("RegisterInputStep2") {
                    RegisterInputScreen(viewModel, navController, findNavController())
                }

                composable("SelectPresent") {
                    SelectPresentScreen(viewModel, navController, findNavController())

                }
                composable("DetailPresent") {
                    DetailPresentScreen(viewModel, navController, findNavController())
                }
            }
        }
    }

    override fun onResume() {
        super.onResume()

        mainViewModel.setBnvState(false)
    }
}