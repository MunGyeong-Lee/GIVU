package com.wukiki.givu.views.mall

import android.os.Bundle
import android.util.Log
import android.view.View
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.fragment.app.activityViewModels
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import androidx.navigation.fragment.findNavController
import androidx.navigation.navArgument
import com.wukiki.givu.R
import com.wukiki.givu.config.BaseFragment
import com.wukiki.givu.databinding.FragmentMallBinding
import com.wukiki.givu.views.MainViewModel
import com.wukiki.givu.views.mall.viewmodel.MallViewModel
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class MallFragment : BaseFragment<FragmentMallBinding>(R.layout.fragment_mall) {

    private val viewModel: MallViewModel by activityViewModels()
    private val mainViewModel: MainViewModel by activityViewModels()

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        binding.vm = viewModel

        binding.composeMall.setContent {
            val navController = rememberNavController()
            val currentBackStackEntry by navController.currentBackStackEntryAsState()
            val currentRoute = currentBackStackEntry?.destination?.route

            LaunchedEffect(currentRoute) {
                if (currentRoute == "MallMainScreen") {
                    mainViewModel.setBnvState(true)
                } else {
                    mainViewModel.setBnvState(false)
                }
            }

            NavHost(
                navController = navController,
                startDestination = "MallMainScreen"
            ) {
                composable(route = "MallMainScreen") {
                    MallScreen(navController = navController, mallViewModel = viewModel)
                }

                composable(
                    route = "ProductDetailScreen/{productId}",
                    arguments = listOf(navArgument("productId") { type = NavType.StringType })
                ) { backStackEntry ->
                    val productId = backStackEntry.arguments?.getString("productId")

                    ProductDetailScreen(productId = productId, mallViewModel = viewModel)
                }


            }
        }
    }

//    override fun onResume() {
//        super.onResume()
//
//        mainViewModel.setBnvState(true)
//    }
}