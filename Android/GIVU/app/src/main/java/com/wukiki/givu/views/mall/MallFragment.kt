package com.wukiki.givu.views.mall

import android.os.Bundle
import android.view.View
import com.wukiki.givu.R
import com.wukiki.givu.config.BaseFragment
import com.wukiki.givu.databinding.FragmentMallBinding
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class MallFragment : BaseFragment<FragmentMallBinding>(R.layout.fragment_mall) {

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

    }
}