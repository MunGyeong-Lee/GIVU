package com.wukiki.data.mapper

import com.wukiki.data.entity.FundingDetailEntity
import com.wukiki.data.util.CommonUtils.formatDateTime
import com.wukiki.domain.model.FundingDetail
import com.wukiki.domain.model.Letter
import com.wukiki.domain.model.Review

object FundingDetailMapper {

    operator fun invoke(fundingDetailEntity: FundingDetailEntity): FundingDetail {
        val newLetters = mutableListOf<Letter>()
        val newReviews = mutableListOf<Review>()

        fundingDetailEntity.data.letters.forEach { letter ->
            newLetters.add(
                Letter(
                    letterId = letter.letterId.toString(),
                    fundingId = letter.fundingId.toString(),
                    userId = letter.user.userId,
                    userNickname = letter.user.nickname,
                    userProfile = letter.user.image,
                    comment = letter.comment,
                    image = letter.image ?: "",
                    access = letter.access ?: "",
                    createdAt = formatDateTime(letter.createdAt ?: ""),
                    updatedAt = formatDateTime(letter.updatedAt ?: "")
                )
            )
        }
        
        fundingDetailEntity.data.reviews.forEach { review ->
            newReviews.add(
                Review(
                    reviewId = review.reviewId,
                    fundingId = review.fundingId,
                    userId = review.user.userId,
                    userNickname = review.user.nickname,
                    userProfile = review.user.image,
                    comment = review.comment,
                    image = review.image ?: "",
                    createdAt = formatDateTime(review.createdAt ?: ""),
                    updatedAt = formatDateTime(review.updatedAt ?: ""),
                    visit = review.visit.toString()
                )
            )
        }
        
        return FundingDetail(
            id = fundingDetailEntity.data.fundingId,
            title = fundingDetailEntity.data.title,
            description = fundingDetailEntity.data.description,
            category = fundingDetailEntity.data.category ?: "",
            categoryName = fundingDetailEntity.data.categoryName ?: "",
            scope = fundingDetailEntity.data.scope ?: "",
            participantsNumber = fundingDetailEntity.data.participantsNumber.toString(),
            fundedAmount = fundingDetailEntity.data.fundedAmount,
            status = fundingDetailEntity.data.status ?: "",
            images = fundingDetailEntity.data.images ?: emptyList(),
            createdAt = formatDateTime(fundingDetailEntity.data.createdAt),
            updatedAt = formatDateTime(fundingDetailEntity.data.updatedAt ?: ""),
            writerId = fundingDetailEntity.data.writer.userId,
            writerNickname = fundingDetailEntity.data.writer.nickname,
            writerProfile = fundingDetailEntity.data.writer.image,
            productId = fundingDetailEntity.data.product.id,
            productName = fundingDetailEntity.data.product.productName,
            productPrice = fundingDetailEntity.data.product.price.toString(),
            productImage = fundingDetailEntity.data.product.image,
            letters = newLetters,
            reviews = newReviews
        )
    }
}