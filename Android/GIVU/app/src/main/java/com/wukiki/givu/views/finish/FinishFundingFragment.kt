package com.wukiki.givu.views.finish

import android.os.Bundle
import android.view.View
import androidx.fragment.app.activityViewModels
import androidx.navigation.fragment.findNavController
import com.wukiki.givu.R
import com.wukiki.givu.config.BaseFragment
import com.wukiki.givu.databinding.FragmentFinishFundingBinding
import com.wukiki.givu.views.detail.viewmodel.FundingViewModel
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class FinishFundingFragment :
    BaseFragment<FragmentFinishFundingBinding>(R.layout.fragment_finish_funding) {

    private val viewModel: FundingViewModel by activityViewModels()

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        binding.vm = viewModel

        binding.composeFinishFunding.setContent {
            FinishFundingScreen(navController = findNavController())
        }
    }
}