package com.wukiki.givu.views

import android.os.Bundle
import androidx.navigation.NavController
import androidx.navigation.fragment.NavHostFragment
import androidx.navigation.ui.setupWithNavController
import com.wukiki.givu.R
import com.wukiki.givu.config.BaseActivity
import com.wukiki.givu.databinding.ActivityMainBinding
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class MainActivity : BaseActivity<ActivityMainBinding>(ActivityMainBinding::inflate) {

    private lateinit var navController: NavController
    private val navHostFragment: NavHostFragment by lazy {
        supportFragmentManager.findFragmentById(R.id.fcv_main) as NavHostFragment
    }


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        binding.lifecycleOwner = this

        setBottomNavigationBar()
    }

    private fun setBottomNavigationBar() {
        navController = navHostFragment.navController
        navController.setGraph(R.navigation.nav_graph_main)
        binding.bnvMain.setupWithNavController(navController = navController)
    }
}