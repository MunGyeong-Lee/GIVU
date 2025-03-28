package com.wukiki.givu.views.finish

import android.os.Bundle
import android.view.View
import androidx.fragment.app.activityViewModels
import androidx.navigation.fragment.findNavController
import com.wukiki.givu.R
import com.wukiki.givu.config.BaseFragment
import com.wukiki.givu.databinding.FragmentFundingFinishedBinding
import com.wukiki.givu.views.detail.viewmodel.FundingViewModel
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class FundingFinishedFragment :
    BaseFragment<FragmentFundingFinishedBinding>(R.layout.fragment_funding_finished) {

    private val viewModel: FundingViewModel by activityViewModels()

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        binding.vm = viewModel

        binding.composeFundingFinished.setContent {
            FundingFinishedScreen(navController = findNavController())
        }
    }
}