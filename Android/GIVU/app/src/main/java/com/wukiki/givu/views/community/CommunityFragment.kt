package com.wukiki.givu.views.community

import android.os.Bundle
import android.view.View
import androidx.fragment.app.activityViewModels
import androidx.navigation.fragment.findNavController
import com.wukiki.givu.R
import com.wukiki.givu.config.BaseFragment
import com.wukiki.givu.databinding.FragmentCommunityBinding
import com.wukiki.givu.views.MainViewModel
import com.wukiki.givu.views.community.viewmodel.CommunityViewModel
import com.wukiki.givu.views.home.viewmodel.HomeViewModel
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class CommunityFragment : BaseFragment<FragmentCommunityBinding>(R.layout.fragment_community) {

    private val viewModel: CommunityViewModel by activityViewModels()
    private val mainViewModel: MainViewModel by activityViewModels()

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        viewModel.initUserInfo()

        binding.composeCommunity.setContent {
            CommunityScreen(navController = findNavController())
        }
    }

    override fun onResume() {
        super.onResume()

        mainViewModel.setBnvState(true)
    }
}