package com.wukiki.givu.views.participate

import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.biometric.BiometricPrompt
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.mutableStateOf
import androidx.core.content.ContextCompat
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

    // 생체 인증 결과
    private var biometricAuthResult = mutableStateOf(false)

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        binding.vm = viewModel

        binding.composeParticipateFunding.setContent {
            val navController = rememberNavController()

            // 인증이 완료되면 이동
            if (biometricAuthResult.value) {
                LaunchedEffect(Unit) {
                    biometricAuthResult.value = false // 초기화
                    navController.navigate("WriteLetter")
                }
            }

            NavHost(
                navController = navController,
                startDestination = "ParticipateFunding"
            ) {
                composable("ParticipateFunding") {
                    ParticipateFundingScreen(viewModel, navController, findNavController(),
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
                        }
                    )
                }

                composable("WriteLetter") {
                    WriteLetterScreen(viewModel, navController, findNavController())
                }

                composable("CompleteParticipate") {
                    CompleteFundingScreen(viewModel, navController, findNavController())
                }
            }
        }
    }
}