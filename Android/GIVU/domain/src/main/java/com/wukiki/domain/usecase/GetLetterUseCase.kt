package com.wukiki.domain.usecase

import com.wukiki.domain.model.ApiResult
import com.wukiki.domain.model.Letter
import com.wukiki.domain.repository.LetterRepository
import kotlinx.coroutines.flow.Flow
import okhttp3.MultipartBody
import okhttp3.RequestBody
import javax.inject.Inject

class GetLetterUseCase @Inject constructor(
    private val letterRepository: LetterRepository
) {

    suspend fun submitFundingLetter(
        fundingId: String,
        image: MultipartBody.Part?,
        body: RequestBody
    ): Flow<ApiResult<Letter>> = letterRepository.submitFundingLetter(fundingId, image, body)

    suspend fun deleteFundingLetter(fundingId: String): Flow<ApiResult<Unit>> =
        letterRepository.deleteFundingLetter(fundingId)
}