package com.wukiki.givu.views.home

import android.os.Bundle
import android.view.View
import com.wukiki.givu.R
import com.wukiki.givu.config.BaseFragment
import com.wukiki.givu.databinding.FragmentHomeBinding
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class HomeFragment : BaseFragment<FragmentHomeBinding>(R.layout.fragment_home) {

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

    }
}