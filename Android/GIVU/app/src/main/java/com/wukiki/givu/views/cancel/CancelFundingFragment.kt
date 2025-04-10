package com.wukiki.givu.views.cancel

import android.os.Bundle
import android.view.View
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.mutableStateOf
import androidx.fragment.app.activityViewModels
import androidx.navigation.fragment.findNavController
import com.wukiki.givu.R
import com.wukiki.givu.config.BaseFragment
import com.wukiki.givu.databinding.FragmentCancelFundingBinding
import com.wukiki.givu.views.BiometricAuth
import com.wukiki.givu.views.detail.viewmodel.FundingViewModel
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class CancelFundingFragment :
    BaseFragment<FragmentCancelFundingBinding>(R.layout.fragment_cancel_funding) {

    private val viewModel: FundingViewModel by activityViewModels()
    private var biometricAuthResult = mutableStateOf(false)

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        binding.vm = viewModel

        binding.composeCancelFunding.setContent {
            if (biometricAuthResult.value) {
                LaunchedEffect(Unit) {
                    biometricAuthResult.value = false
                    val fundedAmount = viewModel.selectedFunding.value?.fundedAmount ?: 0
                    val productPrice = (viewModel.selectedFunding.value?.productPrice ?: "0").toInt()
                    if (fundedAmount * 2 <= productPrice) {
                        viewModel.refundFunding()
                    } else {
                        viewModel.successFunding()
                    }
                }
            }

            CancelFundingScreen(viewModel, findNavController()) {
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
        }
    }
}