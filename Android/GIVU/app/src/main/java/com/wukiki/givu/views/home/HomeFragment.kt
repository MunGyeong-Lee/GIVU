package com.wukiki.givu.views.home

import android.os.Bundle
import android.view.View
import androidx.fragment.app.activityViewModels
import androidx.navigation.fragment.findNavController
import com.wukiki.givu.R
import com.wukiki.givu.config.BaseFragment
import com.wukiki.givu.databinding.FragmentHomeBinding
import com.wukiki.givu.views.MainViewModel
import com.wukiki.givu.views.home.viewmodel.HomeViewModel
import com.wukiki.givu.views.mall.viewmodel.MallViewModel
import com.wukiki.givu.views.register.viewmodel.RegisterViewModel
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class HomeFragment : BaseFragment<FragmentHomeBinding>(R.layout.fragment_home) {

    private val viewModel: HomeViewModel by activityViewModels()
    private val mainViewModel: MainViewModel by activityViewModels()
    private val registerViewModel: RegisterViewModel by activityViewModels()
    private val mallViewModel: MallViewModel by activityViewModels()

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        binding.vm = viewModel

        viewModel.initFundings()

        binding.composeHome.setContent {
            HomeScreen(viewModel, findNavController())
        }
    }

    override fun onResume() {
        super.onResume()

        mainViewModel.setBnvState(true)
        viewModel.initUserInfo()
        registerViewModel.setFromMall(false)
        mallViewModel.initProducts()
    }
}