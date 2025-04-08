package com.wukiki.data.repository.letter

import com.wukiki.data.entity.LetterRequestEntity
import okhttp3.MultipartBody
import okhttp3.RequestBody
import retrofit2.Response

interface LetterRemoteDataSource {

    suspend fun postFundingLetter(
        fundingId: String,
        image: MultipartBody.Part?,
        body: RequestBody
    ): Response<LetterRequestEntity>

    suspend fun deleteFundingLetter(fundingId: String): Response<Unit>
}