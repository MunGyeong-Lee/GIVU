package com.wukiki.data.di

import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import com.wukiki.data.repository.auth.AuthRemoteDataSource
import com.wukiki.data.repository.auth.AuthRepositoryImpl
import com.wukiki.data.repository.datastore.DataStoreRepositoryImpl
import com.wukiki.data.repository.funding.FundingRemoteDataSource
import com.wukiki.data.repository.funding.FundingRepositoryImpl
import com.wukiki.data.repository.letter.LetterRemoteDataSource
import com.wukiki.data.repository.letter.LetterRepositoryImpl
import com.wukiki.data.repository.mypage.MyPageRemoteDataSource
import com.wukiki.data.repository.mypage.MyPageRepositoryImpl
import com.wukiki.data.repository.product.ProductRemoteDataSource
import com.wukiki.data.repository.product.ProductRepositoryImpl
import com.wukiki.data.repository.productreview.ProductReviewRemoteDataSource
import com.wukiki.data.repository.productreview.ProductReviewRepositoryImpl
import com.wukiki.data.repository.review.ReviewRemoteDataSource
import com.wukiki.data.repository.review.ReviewRepositoryImpl
import com.wukiki.data.repository.transfer.TransferRemoteDataSource
import com.wukiki.data.repository.transfer.TransferRepositoryImpl
import com.wukiki.domain.repository.AuthRepository
import com.wukiki.domain.repository.DataStoreRepository
import com.wukiki.domain.repository.FundingRepository
import com.wukiki.domain.repository.LetterRepository
import com.wukiki.domain.repository.MyPageRepository
import com.wukiki.domain.repository.ProductRepository
import com.wukiki.domain.repository.ProductReviewRepository
import com.wukiki.domain.repository.ReviewRepository
import com.wukiki.domain.repository.TransferRepository
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
    fun provideFundingRepository(fundingRemoteDataSource: FundingRemoteDataSource): FundingRepository {
        return FundingRepositoryImpl(fundingRemoteDataSource)
    }

    @Provides
    @Singleton
    fun provideReviewRepository(reviewRemoteDataSource: ReviewRemoteDataSource): ReviewRepository {
        return ReviewRepositoryImpl(reviewRemoteDataSource)
    }

    @Provides
    @Singleton
    fun provideLetterRepository(letterRemoteDataSource: LetterRemoteDataSource): LetterRepository {
        return LetterRepositoryImpl(letterRemoteDataSource)
    }

    @Provides
    @Singleton
    fun provideMyPageRepository(myPageRemoteDataSource: MyPageRemoteDataSource): MyPageRepository {
        return MyPageRepositoryImpl(myPageRemoteDataSource)
    }

    @Provides
    @Singleton
    fun provideTransferRepository(transferRemoteDataSource: TransferRemoteDataSource): TransferRepository {
        return TransferRepositoryImpl(transferRemoteDataSource)
    }

    @Provides
    @Singleton
    fun provideDataStoreRepository(dataStore: DataStore<Preferences>): DataStoreRepository {
        return DataStoreRepositoryImpl(dataStore)
    }
}