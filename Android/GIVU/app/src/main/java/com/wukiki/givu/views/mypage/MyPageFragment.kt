package com.wukiki.givu.views.mypage

import android.os.Bundle
import android.view.View
import androidx.fragment.app.activityViewModels
import com.wukiki.givu.R
import com.wukiki.givu.config.BaseFragment
import com.wukiki.givu.databinding.FragmentMyPageBinding
import com.wukiki.givu.views.MainViewModel
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class MyPageFragment : BaseFragment<FragmentMyPageBinding>(R.layout.fragment_my_page) {

    private val mainViewModel: MainViewModel by activityViewModels()

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        binding.composeMyPage.setContent {
            MyPageScreen()
        }

    }

    override fun onResume() {
        super.onResume()

        mainViewModel.setBnvState(true)
    }
}