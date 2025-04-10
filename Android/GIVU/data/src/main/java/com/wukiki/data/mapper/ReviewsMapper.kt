package com.wukiki.data.mapper

import com.wukiki.data.entity.ReviewEntity
import com.wukiki.domain.model.Review

object ReviewsMapper {

    operator fun invoke(reviewEntity: ReviewEntity): List<Review> {
        val newReviews = mutableListOf<Review>()

        reviewEntity.data.forEach { reviewInfo ->
            newReviews.add(
                Review(
                    reviewId = reviewInfo.reviewId,
                    fundingId = reviewInfo.fundingId,
                    userId = reviewInfo.user.userId,
                    comment = reviewInfo.comment,
                    image = reviewInfo.image ?: "",
                    createdAt = reviewInfo.createdAt ?: "",
                    updatedAt = reviewInfo.updatedAt ?: "",
                    visit = reviewInfo.visit.toString(),
                    userNickname = reviewInfo.user.nickname,
                    userProfile = reviewInfo.user.image ?: ""
                )
            )
        }

        return newReviews
    }
}