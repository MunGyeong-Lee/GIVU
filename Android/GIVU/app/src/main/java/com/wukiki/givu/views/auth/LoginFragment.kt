package com.wukiki.givu.views.auth

import android.os.Bundle
import android.view.View
import androidx.fragment.app.activityViewModels
import androidx.fragment.app.viewModels
import androidx.navigation.fragment.findNavController
import com.wukiki.givu.R
import com.wukiki.givu.config.BaseFragment
import com.wukiki.givu.databinding.FragmentLoginBinding
import com.wukiki.givu.views.MainViewModel
import com.wukiki.givu.views.auth.viewmodel.AuthViewModel
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class LoginFragment : BaseFragment<FragmentLoginBinding>(R.layout.fragment_login) {

    private val viewModel: AuthViewModel by viewModels()
    private val mainViewModel: MainViewModel by activityViewModels()

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        binding.vm = viewModel

        // Timber.d(getKeyHash(requireContext()))

        binding.composeLogin.setContent {
            LoginScreen(navController = findNavController())
        }
    }

    override fun onResume() {
        super.onResume()

        mainViewModel.setBnvState(false)
    }

//    private fun getKeyHash(context: Context): String? {
//        return try {
//            val info = context.packageManager.getPackageInfo(
//                context.packageName,
//                PackageManager.GET_SIGNING_CERTIFICATES
//            )
//            val signatures = info.signingInfo.apkContentsSigners
//            val md = MessageDigest.getInstance("SHA")
//            md.update(signatures[0].toByteArray())
//            Base64.encodeToString(md.digest(), Base64.NO_WRAP)
//        } catch (e: Exception) {
//            null
//        }
//    }
}