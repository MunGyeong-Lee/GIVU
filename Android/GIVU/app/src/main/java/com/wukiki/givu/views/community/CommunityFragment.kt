package com.wukiki.givu.views.community

import android.os.Bundle
import android.view.View
import com.wukiki.givu.R
import com.wukiki.givu.config.BaseFragment
import com.wukiki.givu.databinding.FragmentCommunityBinding
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class CommunityFragment : BaseFragment<FragmentCommunityBinding>(R.layout.fragment_community) {

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

    }
}