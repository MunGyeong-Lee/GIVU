package com.wukiki.data.mapper

import com.wukiki.data.entity.ProductEntity
import com.wukiki.data.util.CommonUtils.formatDateTime
import com.wukiki.data.util.CommonUtils.makeCommaPrice
import com.wukiki.domain.model.Product

object ProductMapper {

    operator fun invoke(productEntity: ProductEntity): Product {
        return Product(
            productId = productEntity.id.toString(),
            productName = productEntity.productName,
            category = productEntity.category,
            price = makeCommaPrice(productEntity.price),
            image = productEntity.image,
            favorite = productEntity.favorite.toString(),
            star = productEntity.star.toString(),
            createdAt = formatDateTime(productEntity.createdAt)
        )
    }
}