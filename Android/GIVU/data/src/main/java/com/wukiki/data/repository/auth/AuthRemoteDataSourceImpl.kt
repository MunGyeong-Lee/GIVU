package com.wukiki.data.repository.auth

import com.wukiki.data.api.AuthApi
import javax.inject.Inject

class AuthRemoteDataSourceImpl @Inject constructor(
    private val authApi: AuthApi
) : AuthRemoteDataSource {

}