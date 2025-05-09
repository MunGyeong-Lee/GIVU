package com.wukiki.data.di

import com.wukiki.data.api.AuthApi
import com.wukiki.data.api.FundingApi
import com.wukiki.data.api.LetterApi
import com.wukiki.data.api.MyPageApi
import com.wukiki.data.api.ProductApi
import com.wukiki.data.api.ProductReviewApi
import com.wukiki.data.api.ReviewApi
import com.wukiki.data.api.TransferApi
import com.wukiki.data.repository.auth.AuthRemoteDataSource
import com.wukiki.data.repository.auth.AuthRemoteDataSourceImpl
import com.wukiki.data.repository.funding.FundingRemoteDataSource
import com.wukiki.data.repository.funding.FundingRemoteDataSourceImpl
import com.wukiki.data.repository.letter.LetterRemoteDataSource
import com.wukiki.data.repository.letter.LetterRemoteDataSourceImpl
import com.wukiki.data.repository.mypage.MyPageRemoteDataSource
import com.wukiki.data.repository.mypage.MyPageRemoteDataSourceImpl
import com.wukiki.data.repository.product.ProductRemoteDataSource
import com.wukiki.data.repository.product.ProductRemoteDataSourceImpl
import com.wukiki.data.repository.productreview.ProductReviewRemoteDataSource
import com.wukiki.data.repository.productreview.ProductReviewRemoteDataSourceImpl
import com.wukiki.data.repository.review.ReviewRemoteDataSource
import com.wukiki.data.repository.review.ReviewRemoteDataSourceImpl
import com.wukiki.data.repository.transfer.TransferRemoteDataSource
import com.wukiki.data.repository.transfer.TransferRemoteDataSourceImpl
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

    @Provides
    @Singleton
    fun provideFundingRemoteDataSource(fundingApi: FundingApi): FundingRemoteDataSource {
        return FundingRemoteDataSourceImpl(fundingApi)
    }

    @Provides
    @Singleton
    fun provideReviewRemoteDataSource(reviewApi: ReviewApi): ReviewRemoteDataSource {
        return ReviewRemoteDataSourceImpl(reviewApi)
    }

    @Provides
    @Singleton
    fun provideLetterRemoteDataSource(letterApi: LetterApi): LetterRemoteDataSource {
        return LetterRemoteDataSourceImpl(letterApi)
    }

    @Provides
    @Singleton
    fun provideMyPageRemoteDataSource(myPageApi: MyPageApi): MyPageRemoteDataSource {
        return MyPageRemoteDataSourceImpl(myPageApi)
    }

    @Provides
    @Singleton
    fun provideTransferRemoteDataSource(transferApi: TransferApi): TransferRemoteDataSource {
        return TransferRemoteDataSourceImpl(transferApi)
    }
}