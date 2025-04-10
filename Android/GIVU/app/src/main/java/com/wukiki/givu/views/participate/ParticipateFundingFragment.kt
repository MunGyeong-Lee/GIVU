package com.wukiki.givu.views.participate

import android.os.Bundle
import android.view.View
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.mutableStateOf
import androidx.fragment.app.activityViewModels
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.fragment.findNavController
import com.wukiki.givu.R
import com.wukiki.givu.config.BaseFragment
import com.wukiki.givu.databinding.FragmentParticipateFundingBinding
import com.wukiki.givu.views.BiometricAuth
import com.wukiki.givu.views.detail.viewmodel.FundingViewModel
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class ParticipateFundingFragment :
    BaseFragment<FragmentParticipateFundingBinding>(R.layout.fragment_participate_funding) {

    private val viewModel: FundingViewModel by activityViewModels()
    private var biometricAuthResult = mutableStateOf(false)
    private var biometricAuthChargeResult = mutableStateOf(false)

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        binding.vm = viewModel

        binding.composeParticipateFunding.setContent {
            val navController = rememberNavController()

            if (biometricAuthResult.value) {
                LaunchedEffect(Unit) {
                    biometricAuthResult.value = false
                    viewModel.transferFunding()
                }
            }
            if (biometricAuthChargeResult.value) {
                LaunchedEffect(Unit) {
                    biometricAuthChargeResult.value = false
                    viewModel.withdrawAccount()
                }
            }

            NavHost(
                navController = navController,
                startDestination = "ParticipateFunding"
            ) {
                composable("ParticipateFunding") {
                    ParticipateFundingScreen(viewModel, navController, findNavController())
                }

                composable("ParticipateCharge") {
                    ParticipateChargeScreen(viewModel, navController, findNavController()) {
                        BiometricAuth(
                            activity = requireActivity(),
                            onSuccess = {
                                biometricAuthChargeResult.value = true
                            },
                            onFailure = {
                                // 실패 시 처리
                            }
                        ).authenticate()
                    }
                }

                composable("WriteLetter") {
                    WriteLetterScreen(viewModel, navController, findNavController(),
                        onRequestFingerprint = {
                            BiometricAuth(
                                activity = requireActivity(),
                                onSuccess = {
                                    biometricAuthResult.value = true
                                },
                                onFailure = {
                                    // 실패 시 처리
                                }
                            ).authenticate()
                        })
                }

                composable("CompleteParticipate") {
                    CompleteFundingScreen(viewModel, navController, findNavController())
                }
            }
        }
    }
}