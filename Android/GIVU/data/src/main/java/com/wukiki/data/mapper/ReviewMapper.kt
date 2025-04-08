package com.wukiki.data.mapper

import com.wukiki.data.entity.ReviewEntity
import com.wukiki.domain.model.Review

object ReviewMapper {

    operator fun invoke(reviewEntity: ReviewEntity): Review {
        return Review(
            reviewId = reviewEntity.reviewId,
            fundingId = reviewEntity.fundingId,
            userId = reviewEntity.user.userId,
            comment = reviewEntity.comment,
            image = reviewEntity.image ?: "",
            createdAt = reviewEntity.createdAt ?: "",
            updatedAt = reviewEntity.updatedAt ?: "",
            visit = reviewEntity.visit.toString(),
            userNickname = reviewEntity.user.nickname,
            userProfile = reviewEntity.user.image ?: ""
        )
    }
}