package com.wukiki.data.repository.letter

import android.util.Log
import com.wukiki.data.mapper.LetterMapper
import com.wukiki.domain.model.ApiResult
import com.wukiki.domain.model.Letter
import com.wukiki.domain.repository.LetterRepository
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.MultipartBody
import okhttp3.RequestBody
import javax.inject.Inject

class LetterRepositoryImpl @Inject constructor(
    private val letterRemoteDataSource: LetterRemoteDataSource
) : LetterRepository {

    override suspend fun submitFundingLetter(
        fundingId: String,
        image: MultipartBody.Part?,
        body: RequestBody
    ): ApiResult<Letter> =
        try {
            val response = withContext(CoroutineScope(Dispatchers.IO).coroutineContext) {
                letterRemoteDataSource.postFundingLetter(fundingId, image, body)
            }

            val responseBody = response.body()
            Log.d("LetterRepositoryImpl", "Response: $responseBody")
            if (response.isSuccessful && (responseBody != null)) {
                Log.d("LetterRepositoryImpl", "submitFundingLetter Success")
                ApiResult.success(LetterMapper(responseBody))
            } else {
                Log.d("LetterRepositoryImpl", "submitFundingLetter Fail: ${response.code()}")
                ApiResult.error(response.errorBody().toString(), null)
            }
        } catch (e: Exception) {
            Log.e("LetterRepositoryImpl", "submitFundingLetter Error: $e")
            ApiResult.fail()
        }

    override suspend fun deleteFundingLetter(fundingId: String): ApiResult<Unit> =
        try {
            val response = withContext(CoroutineScope(Dispatchers.IO).coroutineContext) {
                letterRemoteDataSource.deleteFundingLetter(fundingId)
            }

            val responseBody = response.body()
            Log.d("LetterRepositoryImpl", "Response: $responseBody")
            if (response.isSuccessful) {
                Log.d("LetterRepositoryImpl", "deleteFundingLetter Success")
                ApiResult.success(responseBody)
            } else {
                Log.d("LetterRepositoryImpl", "deleteFundingLetter Fail: ${response.code()}")
                ApiResult.error(response.errorBody().toString(), null)
            }
        } catch (e: Exception) {
            Log.e("LetterRepositoryImpl", "deleteFundingLetter Error: $e")
            ApiResult.fail()
        }
}