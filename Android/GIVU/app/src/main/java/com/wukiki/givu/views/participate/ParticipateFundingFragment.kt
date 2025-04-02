package com.wukiki.givu.views.participate

import android.os.Bundle
import android.view.View
import androidx.fragment.app.activityViewModels
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.fragment.findNavController
import com.wukiki.givu.R
import com.wukiki.givu.config.BaseFragment
import com.wukiki.givu.databinding.FragmentParticipateFundingBinding
import com.wukiki.givu.views.detail.viewmodel.FundingViewModel
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class ParticipateFundingFragment :
    BaseFragment<FragmentParticipateFundingBinding>(R.layout.fragment_participate_funding) {

    private val viewModel: FundingViewModel by activityViewModels()

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        binding.vm = viewModel

        binding.composeParticipateFunding.setContent {
            val navController = rememberNavController()
            NavHost(
                navController = navController,
                startDestination = "ParticipateFunding"
            ) {
                composable("ParticipateFunding") {
                    ParticipateFundingScreen(viewModel, navController, findNavController())
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