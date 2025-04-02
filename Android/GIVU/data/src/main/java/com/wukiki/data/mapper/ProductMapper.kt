package com.wukiki.data.mapper

import com.wukiki.data.entity.ProductDetailEntity
import com.wukiki.data.entity.ProductEntity
import com.wukiki.data.util.CommonUtils.formatDateTime
import com.wukiki.data.util.CommonUtils.makeCommaPrice
import com.wukiki.domain.model.Product

object ProductMapper {

    operator fun invoke(productEntity: ProductEntity): Product {
        return Product(
            productId = productEntity.product.id.toString(),
            productName = productEntity.product.productName,
            category = productEntity.product.category,
            price = productEntity.product.price.toString(),
            image = productEntity.product.image,
            favorite = productEntity.product.favorite.toString(),
            star = productEntity.product.star.toString(),
            createdAt = formatDateTime(productEntity.product.createdAt),
            description = productEntity.product.description
        )
    }
}