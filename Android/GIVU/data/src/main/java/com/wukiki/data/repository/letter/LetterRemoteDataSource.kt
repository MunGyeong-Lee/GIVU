package com.wukiki.data.repository.letter

import com.wukiki.data.entity.LetterEntity
import okhttp3.MultipartBody
import okhttp3.RequestBody
import retrofit2.Response

interface LetterRemoteDataSource {

    suspend fun postFundingLetter(
        fundingId: String,
        image: MultipartBody.Part?,
        body: RequestBody
    ): Response<LetterEntity>

    suspend fun deleteFundingLetter(fundingId: String): Response<Unit>
}