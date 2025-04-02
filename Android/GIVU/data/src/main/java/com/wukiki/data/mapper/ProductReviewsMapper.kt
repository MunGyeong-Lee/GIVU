package com.wukiki.data.mapper

import com.wukiki.data.entity.ProductReviewEntity
import com.wukiki.domain.model.Review

object ProductReviewsMapper {

    operator fun invoke(productReviewEntities: List<ProductReviewEntity>): List<Review> {
        val newReviews = mutableListOf<Review>()

        productReviewEntities.forEach { productReviewEntity ->
            newReviews.add(
                Review(
                    reviewId = productReviewEntity.reviewId,
                    fundingId = -1,
                    userId = -1,
                    comment = "",
                    image = "",
                    createdAt = "",
                    updatedAt = "",
                    visit = "",
                    userNickname = "",
                    userProfile = ""
                )
            )
        }

        return newReviews
    }
}