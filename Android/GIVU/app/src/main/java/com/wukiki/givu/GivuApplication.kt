package com.wukiki.givu

import android.app.Application
import timber.log.Timber

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