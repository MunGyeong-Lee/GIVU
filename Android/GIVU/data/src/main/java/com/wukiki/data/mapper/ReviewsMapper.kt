package com.wukiki.data.mapper

import com.wukiki.data.entity.ProductReviewEntity
import com.wukiki.domain.model.Review

object ReviewsMapper {

    operator fun invoke(productReviewEntities: List<ProductReviewEntity>): List<Review> {
        val newReviews = mutableListOf<Review>()

        productReviewEntities.forEach { productReviewEntity ->
            newReviews.add(
                Review(
                    reviewId = productReviewEntity.reviewId,
                    fundingId = "",
                    userId = "",
                    comment = "",
                    image = "",
                    createdAt = "",
                    updatedAt = "",
                    visit = ""
                )
            )
        }

        return newReviews
    }
}