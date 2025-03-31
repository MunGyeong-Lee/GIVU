package com.wukiki.data.mapper

import com.wukiki.data.entity.ProductReviewEntity
import com.wukiki.domain.model.Review

object ProductReviewMapper {

    operator fun invoke(productReviewEntity: ProductReviewEntity): Review {
        return Review(
            reviewId = productReviewEntity.reviewId,
            fundingId = TODO(),
            userId = TODO(),
            comment = TODO(),
            image = TODO(),
            createdAt = TODO(),
            updatedAt = TODO(),
            visit = TODO()
        )
    }
}