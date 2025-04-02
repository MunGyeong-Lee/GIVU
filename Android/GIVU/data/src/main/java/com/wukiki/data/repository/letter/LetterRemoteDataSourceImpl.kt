package com.wukiki.data.repository.letter

import com.wukiki.data.api.LetterApi
import com.wukiki.data.entity.LetterEntity
import okhttp3.MultipartBody
import okhttp3.RequestBody
import retrofit2.Response
import javax.inject.Inject

class LetterRemoteDataSourceImpl @Inject constructor(
    private val letterApi: LetterApi
) : LetterRemoteDataSource {

    override suspend fun postFundingLetter(
        fundingId: String,
        image: MultipartBody.Part?,
        body: RequestBody
    ): Response<LetterEntity> =
        letterApi.postFundingLetter(fundingId, image, body)

    override suspend fun deleteFundingLetter(fundingId: String): Response<Unit> =
        letterApi.deleteFundingLetter(fundingId)
}