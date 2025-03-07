package com.wukiki.data.mapper

import com.wukiki.data.entity.UserEntity
import com.wukiki.domain.model.User

object UserMapper {

    operator fun invoke(userEntity: UserEntity): User {
        return User(id = userEntity.id.toString())
    }
}