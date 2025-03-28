package com.wukiki.data.mapper

import com.wukiki.data.entity.KakaoUserEntity
import com.wukiki.domain.model.KakaoUser

object KakaoUserMapper {

    operator fun invoke(kakaoUserEntity: KakaoUserEntity): KakaoUser {
        return KakaoUser(
            type = kakaoUserEntity.type,
            jwtToken = kakaoUserEntity.jwtToken,
            refreshToken = kakaoUserEntity.refreshToken
        )
    }
}