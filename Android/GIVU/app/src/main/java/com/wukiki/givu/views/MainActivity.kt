package com.wukiki.givu.views

import android.content.Context
import android.content.pm.PackageManager
import android.os.Bundle
import android.util.Base64
import android.util.Log
import androidx.activity.viewModels
import androidx.fragment.app.viewModels
import androidx.navigation.NavController
import androidx.navigation.fragment.NavHostFragment
import androidx.navigation.ui.setupWithNavController
import com.wukiki.givu.R
import com.wukiki.givu.config.BaseActivity
import com.wukiki.givu.databinding.ActivityMainBinding
import com.wukiki.givu.views.community.viewmodel.CommunityViewModel
import com.wukiki.givu.views.detail.viewmodel.FundingViewModel
import com.wukiki.givu.views.home.viewmodel.HomeViewModel
import com.wukiki.givu.views.mall.viewmodel.MallViewModel
import com.wukiki.givu.views.register.viewmodel.RegisterViewModel
import com.wukiki.givu.views.search.viewmodel.SearchViewModel
import dagger.hilt.android.AndroidEntryPoint
import java.security.MessageDigest

@AndroidEntryPoint
class MainActivity : BaseActivity<ActivityMainBinding>(ActivityMainBinding::inflate) {

    private val mainViewModel: MainViewModel by viewModels()
    private val homeViewModel: HomeViewModel by viewModels()
    private val communityViewModel: CommunityViewModel by viewModels()
    private val fundingViewModel: FundingViewModel by viewModels()
//    private val registerViewModel: RegisterViewModel by viewModels()
    private val searchViewModel: SearchViewModel by viewModels()
    private val mallViewModel: MallViewModel by viewModels()
    private lateinit var navController: NavController
    private val navHostFragment: NavHostFragment by lazy {
        supportFragmentManager.findFragmentById(R.id.fcv_main) as NavHostFragment
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        binding.vm = mainViewModel
        binding.lifecycleOwner = this

        setBottomNavigationBar()
    }

    private fun setBottomNavigationBar() {
        navController = navHostFragment.navController
        navController.setGraph(R.navigation.nav_graph_main)
        binding.bnvMain.setupWithNavController(navController = navController)
    }
}