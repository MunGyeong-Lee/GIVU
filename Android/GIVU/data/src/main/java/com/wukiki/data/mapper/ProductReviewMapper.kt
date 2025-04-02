package com.wukiki.data.mapper

import com.wukiki.data.entity.ProductReviewEntity
import com.wukiki.domain.model.ProductReview
import com.wukiki.domain.model.Review

object ProductReviewMapper {

    operator fun invoke(productReviewEntity: ProductReviewEntity): ProductReview {
        return ProductReview(
            reviewId = productReviewEntity.reviewId,
            title = productReviewEntity.title,
            body = productReviewEntity.body,
            image = productReviewEntity.image,
            star = productReviewEntity.star,
            userId = productReviewEntity.user.userId,
            nickname = productReviewEntity.user.nickname,
            userImage = productReviewEntity.user.image
        )
    }
}