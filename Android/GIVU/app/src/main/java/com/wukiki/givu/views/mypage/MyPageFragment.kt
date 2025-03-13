package com.wukiki.givu.views.mypage

import android.os.Bundle
import android.view.View
import com.wukiki.givu.R
import com.wukiki.givu.config.BaseFragment
import com.wukiki.givu.databinding.FragmentMyPageBinding
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class MyPageFragment : BaseFragment<FragmentMyPageBinding>(R.layout.fragment_my_page) {

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

    }
}