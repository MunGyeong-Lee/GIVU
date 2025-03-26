package com.wukiki.givu.views.register

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.compose.animation.EnterTransition
import androidx.compose.animation.ExitTransition
import androidx.compose.animation.ExperimentalAnimationApi
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.slideInHorizontally
import androidx.compose.animation.slideOutHorizontally
import androidx.fragment.app.activityViewModels
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.fragment.findNavController
import com.google.accompanist.navigation.animation.AnimatedNavHost
import com.google.accompanist.navigation.animation.rememberAnimatedNavController
import com.wukiki.givu.R
import com.wukiki.givu.config.BaseFragment
import com.wukiki.givu.databinding.FragmentRegisterFundingBinding
import com.wukiki.givu.views.MainViewModel
import dagger.hilt.android.AndroidEntryPoint

@OptIn(ExperimentalAnimationApi::class)
@AndroidEntryPoint
class RegisterFundingFragment : BaseFragment<FragmentRegisterFundingBinding>(R.layout.fragment_register_funding) {

    private val mainViewModel: MainViewModel by activityViewModels()

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

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
                    RegisterFundingScreen(navController, xmlNavController = findNavController())
                }

                composable("RegisterInputStep2") {
                    RegisterInputScreen(navController, xmlNavController = findNavController())
                }

                composable("SelectPresent") {
                    SelectPresentScreen(navController, xmlNavController = findNavController())

                }
                composable("DetailPresent") {
                    DetailPresentScreen(navController, xmlNavController = findNavController())
                }
            }

        }

    }

    override fun onResume() {
        super.onResume()
        mainViewModel.setBnvState(false)
    }

}