package com.wukiki.data.mapper

import com.wukiki.data.entity.LetterEntity
import com.wukiki.data.util.CommonUtils.formatDateTime
import com.wukiki.domain.model.Letter

object LetterMapper {

    operator fun invoke(letterEntity: LetterEntity): Letter {
        return Letter(
            letterId = letterEntity.letterId.toString(),
            isCreator = letterEntity.isCreator,
            fundingId = letterEntity.fundingId.toString(),
            userId = letterEntity.user.userId,
            userNickname = letterEntity.user.nickname,
            userProfile = letterEntity.user.image ?: "",
            comment = letterEntity.comment,
            image = letterEntity.image ?: "",
            access = letterEntity.access ?: "",
            createdAt = formatDateTime(letterEntity.createdAt ?: ""),
            updatedAt = formatDateTime(letterEntity.updatedAt ?: ""),
            hidden = letterEntity.hidden
        )
    }
}