package com.wukiki.givu.views.register

import android.annotation.SuppressLint
import android.os.Bundle
import android.util.Log
import android.view.View
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.fragment.app.activityViewModels
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.fragment.findNavController
import androidx.navigation.navArgument
import com.wukiki.givu.R
import com.wukiki.givu.config.BaseFragment
import com.wukiki.givu.databinding.FragmentRegisterFundingBinding
import com.wukiki.givu.views.MainViewModel
import com.wukiki.givu.views.mall.viewmodel.MallViewModel
import com.wukiki.givu.views.register.viewmodel.RegisterViewModel
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class RegisterFundingFragment :
    BaseFragment<FragmentRegisterFundingBinding>(R.layout.fragment_register_funding) {

    private val viewModel: RegisterViewModel by activityViewModels()
    private val viewModelMall: MallViewModel by activityViewModels()
    private val mainViewModel: MainViewModel by activityViewModels()


    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        binding.vm = viewModel
        viewModel.initFundingInfo()

        binding.composeRegisterFunding.setContent {
            val navController = rememberNavController()


            val selectedProduct by mainViewModel.selectedProduct.collectAsState()
            val isFromMall by viewModel.isFromMall.collectAsState()

            val startDestination = if (isFromMall && selectedProduct != null) "RegisterInputStep2" else "RegisterStep1"
//            var startDestination = "RegisterStep1"

            LaunchedEffect(selectedProduct, isFromMall) {
                Log.d("RegisterFragment", "쇼핑몰에서 왔니: ${isFromMall}, ${selectedProduct}")
                if (isFromMall && selectedProduct != null) {
                    viewModel.selectProduct(selectedProduct!!)
                }
            }
            NavHost(
                navController = navController,
                startDestination = startDestination
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

                composable(
                    route = "DetailPresent/{productId}",
                    arguments = listOf(navArgument("productId") { type = NavType.StringType })
                ) { backStackEntry ->
                    val productId = backStackEntry.arguments?.getString("productId")

                    DetailPresentScreen(
                        navController = navController,
                        xmlNavController = findNavController(),
                        productId = productId,
                        registerViewModel = viewModel,
                        mallViewModel = viewModelMall
                    )
                }

                composable("RegisterSuccess") {
                    RegisterSuccessScreen(viewModel, navController, findNavController())
                }
            }
        }
    }

    override fun onResume() {
        super.onResume()

        mainViewModel.setBnvState(false)
    }
}