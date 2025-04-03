package com.wukiki.data.di

import com.squareup.moshi.Moshi
import com.squareup.moshi.kotlin.reflect.KotlinJsonAdapterFactory
import com.wukiki.data.api.AuthApi
import com.wukiki.data.api.FundingApi
import com.wukiki.data.api.LetterApi
import com.wukiki.data.api.MyPageApi
import com.wukiki.data.api.ProductApi
import com.wukiki.data.api.ProductReviewApi
import com.wukiki.data.api.ReviewApi
import com.wukiki.data.util.JwtInterceptor
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import okhttp3.OkHttpClient
import retrofit2.Retrofit
import retrofit2.converter.moshi.MoshiConverterFactory
import javax.inject.Named
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object NetworkModule {

    private const val BASE_URL = "https://j12d107.p.ssafy.io/api/"

    @Provides
    @Singleton
    fun provideMoshiConverterFactory(): MoshiConverterFactory {
        val moshi = Moshi.Builder()
            .add(KotlinJsonAdapterFactory())
            .build()

        return MoshiConverterFactory.create(moshi)
    }

    @Provides
    @Singleton
    fun provideOkHttpClient(jwtInterceptor: JwtInterceptor): OkHttpClient {
        return OkHttpClient.Builder()
            .addInterceptor(jwtInterceptor)
            .build()
    }

    @Provides
    @Singleton
    @Named("Givu")
    fun provideGivuRetrofit(okHttpClient: OkHttpClient): Retrofit {
        return Retrofit.Builder()
            .baseUrl(BASE_URL)
            .client(okHttpClient)
            .addConverterFactory(provideMoshiConverterFactory())
            .build()
    }
    
    @Provides
    @Singleton
    fun provideAuthApiService(@Named("Givu") retrofit: Retrofit): AuthApi {
        return retrofit.create(AuthApi::class.java)
    }

    @Provides
    @Singleton
    fun provideProductApiService(@Named("Givu") retrofit: Retrofit): ProductApi {
        return retrofit.create(ProductApi::class.java)
    }

    @Provides
    @Singleton
    fun provideProductReviewApiService(@Named("Givu") retrofit: Retrofit): ProductReviewApi {
        return retrofit.create(ProductReviewApi::class.java)
    }

    @Provides
    @Singleton
    fun provideFundingApiService(@Named("Givu") retrofit: Retrofit): FundingApi {
        return retrofit.create(FundingApi::class.java)
    }

    @Provides
    @Singleton
    fun provideReviewApiService(@Named("Givu") retrofit: Retrofit): ReviewApi {
        return retrofit.create(ReviewApi::class.java)
    }

    @Provides
    @Singleton
    fun provideLetterApiService(@Named("Givu") retrofit: Retrofit): LetterApi {
        return retrofit.create(LetterApi::class.java)
    }

    @Provides
    @Singleton
    fun provideMyPageApiService(@Named("Givu") retrofit: Retrofit): MyPageApi {
        return retrofit.create(MyPageApi::class.java)
    }
}