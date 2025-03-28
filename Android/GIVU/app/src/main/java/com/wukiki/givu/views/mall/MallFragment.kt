package com.wukiki.givu.views.mall

import android.os.Bundle
import android.view.View
import androidx.fragment.app.activityViewModels
import com.wukiki.givu.R
import com.wukiki.givu.config.BaseFragment
import com.wukiki.givu.databinding.FragmentMallBinding
import com.wukiki.givu.views.MainViewModel
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class MallFragment : BaseFragment<FragmentMallBinding>(R.layout.fragment_mall) {

    private val mainViewModel: MainViewModel by activityViewModels()

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        binding.composeMall.setContent {
            MallScreen()
        }

    }

    override fun onResume() {
        super.onResume()

        mainViewModel.setBnvState(true)
    }
}