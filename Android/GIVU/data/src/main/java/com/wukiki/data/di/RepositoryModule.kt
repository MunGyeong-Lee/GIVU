package com.wukiki.data.di

import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import com.wukiki.data.repository.auth.AuthRemoteDataSource
import com.wukiki.data.repository.auth.AuthRepositoryImpl
import com.wukiki.data.repository.datastore.DataStoreRepositoryImpl
import com.wukiki.domain.repository.AuthRepository
import com.wukiki.domain.repository.DataStoreRepository
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object RepositoryModule {

    @Provides
    @Singleton
    fun provideAuthRepository(authRemoteDataSource: AuthRemoteDataSource): AuthRepository {
        return AuthRepositoryImpl(authRemoteDataSource)
    }

    @Provides
    @Singleton
    fun provideDataStoreRepository(dataStore: DataStore<Preferences>): DataStoreRepository {
        return DataStoreRepositoryImpl(dataStore)
    }
}