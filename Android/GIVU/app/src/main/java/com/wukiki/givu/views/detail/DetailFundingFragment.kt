package com.wukiki.givu.views.detail

import android.os.Bundle
import android.view.View
import androidx.fragment.app.activityViewModels
import androidx.navigation.fragment.findNavController
import com.wukiki.givu.R
import com.wukiki.givu.config.BaseFragment
import com.wukiki.givu.databinding.FragmentDetailFundingBinding
import com.wukiki.givu.views.MainViewModel
import com.wukiki.givu.views.detail.viewmodel.FundingViewModel
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class DetailFundingFragment :
    BaseFragment<FragmentDetailFundingBinding>(R.layout.fragment_detail_funding) {

    private val viewModel: FundingViewModel by activityViewModels()
    private val mainViewModel: MainViewModel by activityViewModels()

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        binding.vm = viewModel
        viewModel.initFundings()
        viewModel.initProducts()

        binding.composeDetailFunding.setContent {
            DetailFundingScreen(viewModel, findNavController())
        }
    }

    override fun onResume() {
        super.onResume()

        mainViewModel.setBnvState(false)
    }
}