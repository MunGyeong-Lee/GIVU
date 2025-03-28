package com.wukiki.givu.views.participate

import android.os.Bundle
import android.view.View
import androidx.fragment.app.activityViewModels
import androidx.navigation.fragment.findNavController
import com.wukiki.givu.R
import com.wukiki.givu.config.BaseFragment
import com.wukiki.givu.databinding.FragmentCompleteFundingBinding
import com.wukiki.givu.views.detail.viewmodel.FundingViewModel
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class CompleteFundingFragment :
    BaseFragment<FragmentCompleteFundingBinding>(R.layout.fragment_complete_funding) {

    private val viewModel: FundingViewModel by activityViewModels()

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        binding.vm = viewModel

        binding.composeCompleteFunding.setContent {
            CompleteFundingScreen(navController = findNavController())
        }
    }
}