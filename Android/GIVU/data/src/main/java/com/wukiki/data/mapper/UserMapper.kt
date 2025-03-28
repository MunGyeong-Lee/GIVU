package com.wukiki.data.mapper

import com.wukiki.data.entity.UserEntity
import com.wukiki.domain.model.User

object UserMapper {

    operator fun invoke(userEntity: UserEntity): User {
        return User(
            id = "-1",
            kakaoid = userEntity.kakaoid.toString(),
            nickname = userEntity.nickname,
            email = userEntity.email,
            birth = userEntity.birth ?: "",
            profileImage = userEntity.profileImage ?: "",
            address = userEntity.address ?: "",
            gender = userEntity.gender ?: "",
            ageRange = userEntity.ageRange ?: "",
            balance = userEntity.balance.toString(),
            createdAt = "",
            updatedAt = ""
        )
    }
}