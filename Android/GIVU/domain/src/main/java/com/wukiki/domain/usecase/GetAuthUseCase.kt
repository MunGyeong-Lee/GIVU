package com.wukiki.domain.usecase

import com.wukiki.domain.repository.AuthRepository
import javax.inject.Inject

class GetAuthUseCase @Inject constructor(
    private val authRepository: AuthRepository
) {

}