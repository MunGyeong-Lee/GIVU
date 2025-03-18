package com.wukiki.givu.views.register

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import com.wukiki.givu.R
import com.wukiki.givu.config.BaseFragment
import com.wukiki.givu.databinding.FragmentRegisterFundingBinding
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class RegisterFundingFragment : BaseFragment<FragmentRegisterFundingBinding>(R.layout.fragment_register_funding) {

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        binding.composeRegisterFunding.setContent {
            RegisterFundingScreen()
        }

    }


}