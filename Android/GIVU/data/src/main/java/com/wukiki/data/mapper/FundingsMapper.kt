package com.wukiki.data.mapper

import com.wukiki.data.entity.FundingEntity
import com.wukiki.domain.model.Funding

object FundingsMapper {

    operator fun invoke(fundingEntities: List<FundingEntity>): List<Funding> {
        val newFundings = mutableListOf<Funding>()

        fundingEntities.forEach { fundingEntity ->
            newFundings.add(
                Funding(
                    id = fundingEntity.fundingId,
                    userId = fundingEntity.user.userId,
                    userNickname = fundingEntity.user.nickname,
                    userProfile = fundingEntity.user.image ?: "",
                    productId = fundingEntity.product.id,
                    productName = fundingEntity.product.productName,
                    productPrice = fundingEntity.product.price.toString(),
                    productImage = fundingEntity.product.image,
                    title = fundingEntity.title,
                    body = "",
                    description = fundingEntity.description,
                    category = fundingEntity.category ?: "",
                    categoryName = fundingEntity.categoryName ?: "",
                    scope = fundingEntity.scope ?: "",
                    participantsNumber = fundingEntity.participantsNumber.toString(),
                    fundedAmount = fundingEntity.fundedAmount,
                    status = fundingEntity.status ?: "",
                    images = fundingEntity.images ?: emptyList(),
                    createdAt = fundingEntity.createdAt,
                    updatedAt = fundingEntity.updatedAt ?: ""
                )
            )
        }

        return newFundings
    }
}