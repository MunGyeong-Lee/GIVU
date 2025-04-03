package com.wukiki.data.mapper

import com.wukiki.data.entity.MyFundingEntity
import com.wukiki.data.util.CommonUtils.makeCommaPrice
import com.wukiki.domain.model.Funding

object MyFundingMapper {

    operator fun invoke(myFundingEntity: MyFundingEntity): List<Funding> {
        val newFundings = mutableListOf<Funding>()

        myFundingEntity.data.forEach { funding ->
            newFundings.add(
                Funding(
                    id = funding.fundingId,
                    userId = funding.user.userId,
                    userNickname = funding.user.nickname,
                    userProfile = funding.user.image,
                    productId = funding.product.id,
                    productName = funding.product.productName,
                    productPrice = makeCommaPrice(funding.product.price),
                    productImage = funding.product.image,
                    title = funding.title,
                    body = "",
                    description = funding.description,
                    category = funding.category ?: "",
                    categoryName = funding.categoryName ?: "",
                    scope = funding.scope ?: "",
                    participantsNumber = funding.participantsNumber.toString(),
                    fundedAmount = funding.fundedAmount,
                    status = funding.status ?: "",
                    images = funding.images ?: emptyList(),
                    createdAt = funding.createdAt,
                    updatedAt = funding.updatedAt ?: ""
                )
            )
        }

        return newFundings
    }
}