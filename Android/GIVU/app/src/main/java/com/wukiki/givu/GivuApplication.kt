package com.wukiki.givu

import android.app.Application
import dagger.hilt.android.HiltAndroidApp
import timber.log.Timber

@HiltAndroidApp
class GivuApplication : Application() {

    init {
        instance = this
    }

    override fun onCreate() {
        super.onCreate()

        Timber.plant(Timber.DebugTree())
    }

    companion object {

        var instance: GivuApplication? = null
    }
}