package com.wukiki.data.di

import com.wukiki.data.api.AuthApi
import com.wukiki.data.api.ProductApi
import com.wukiki.data.api.ProductReviewApi
import com.wukiki.data.repository.auth.AuthRemoteDataSource
import com.wukiki.data.repository.auth.AuthRemoteDataSourceImpl
import com.wukiki.data.repository.product.ProductRemoteDataSource
import com.wukiki.data.repository.product.ProductRemoteDataSourceImpl
import com.wukiki.data.repository.review.ProductReviewRemoteDataSource
import com.wukiki.data.repository.review.ProductReviewRemoteDataSourceImpl
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object RemoteDataModule {

    @Provides
    @Singleton
    fun provideAuthRemoteDataSource(authApi: AuthApi): AuthRemoteDataSource {
        return AuthRemoteDataSourceImpl(authApi)
    }

    @Provides
    @Singleton
    fun provideProductRemoteDataSource(productApi: ProductApi): ProductRemoteDataSource {
        return ProductRemoteDataSourceImpl(productApi)
    }

    @Provides
    @Singleton
    fun provideProductReviewRemoteDataSource(productReviewApi: ProductReviewApi): ProductReviewRemoteDataSource {
        return ProductReviewRemoteDataSourceImpl(productReviewApi)
    }
}