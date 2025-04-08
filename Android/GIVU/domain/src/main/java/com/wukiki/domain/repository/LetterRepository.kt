package com.wukiki.domain.repository

import com.wukiki.domain.model.ApiResult
import com.wukiki.domain.model.Letter
import kotlinx.coroutines.flow.Flow
import okhttp3.MultipartBody
import okhttp3.RequestBody

interface LetterRepository {

    suspend fun submitFundingLetter(
        fundingId: String,
        image: MultipartBody.Part?,
        body: RequestBody
    ): Flow<ApiResult<Letter>>

    suspend fun deleteFundingLetter(fundingId: String): Flow<ApiResult<Unit>>
}