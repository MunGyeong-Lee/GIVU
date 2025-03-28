package com.wukiki.data.di

import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import com.wukiki.data.repository.auth.AuthRemoteDataSource
import com.wukiki.data.repository.auth.AuthRepositoryImpl
import com.wukiki.data.repository.datastore.DataStoreRepositoryImpl
import com.wukiki.data.repository.product.ProductRemoteDataSource
import com.wukiki.data.repository.product.ProductRepositoryImpl
import com.wukiki.data.repository.review.ProductReviewRemoteDataSource
import com.wukiki.data.repository.review.ProductReviewRepositoryImpl
import com.wukiki.domain.repository.AuthRepository
import com.wukiki.domain.repository.DataStoreRepository
import com.wukiki.domain.repository.ProductRepository
import com.wukiki.domain.repository.ProductReviewRepository
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
    fun provideProductRepository(productRemoteDataSource: ProductRemoteDataSource): ProductRepository {
        return ProductRepositoryImpl(productRemoteDataSource)
    }

    @Provides
    @Singleton
    fun provideProductReviewRepository(productReviewRemoteDataSource: ProductReviewRemoteDataSource): ProductReviewRepository {
        return ProductReviewRepositoryImpl(productReviewRemoteDataSource)
    }

    @Provides
    @Singleton
    fun provideDataStoreRepository(dataStore: DataStore<Preferences>): DataStoreRepository {
        return DataStoreRepositoryImpl(dataStore)
    }
}