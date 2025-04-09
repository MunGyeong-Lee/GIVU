package com.wukiki.data.mapper

import com.wukiki.data.entity.LetterRequestEntity
import com.wukiki.data.util.CommonUtils.formatDateTime
import com.wukiki.domain.model.Letter

object LetterRequestMapper {

    operator fun invoke(letterRequestEntity: LetterRequestEntity): Letter {
        return Letter(
            letterId = letterRequestEntity.letterId.toString(),
            isCreator = true,
            fundingId = letterRequestEntity.fundingId.toString(),
            userId = letterRequestEntity.user.userId,
            userNickname = letterRequestEntity.user.nickname,
            userProfile = letterRequestEntity.user.image ?: "",
            comment = letterRequestEntity.comment,
            image = letterRequestEntity.image ?: "",
            access = letterRequestEntity.access ?: "",
            createdAt = formatDateTime(letterRequestEntity.createdAt ?: ""),
            updatedAt = formatDateTime(letterRequestEntity.updatedAt ?: ""),
            hidden = true
        )
    }
}