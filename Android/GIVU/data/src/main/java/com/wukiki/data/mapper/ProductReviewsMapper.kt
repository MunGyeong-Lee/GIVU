package com.wukiki.data.mapper

import com.wukiki.data.entity.ProductReviewEntity
import com.wukiki.domain.model.ProductReview

object ProductReviewsMapper {

    operator fun invoke(productReviewEntities: List<ProductReviewEntity>): List<ProductReview> {
        val newReviews = mutableListOf<ProductReview>()

        productReviewEntities.forEach { productReviewEntity ->
            newReviews.add(
                ProductReview(
                    reviewId = productReviewEntity.reviewId,
                    title = productReviewEntity.title,
                    body = productReviewEntity.body,
                    userId = productReviewEntity.user.userId,
                    image = productReviewEntity.image ?: "",
                    nickname = productReviewEntity.user.nickname,
                    star = productReviewEntity.star,
                    userImage = productReviewEntity.user.image ?: ""
                )
            )
        }

        return newReviews
    }
}