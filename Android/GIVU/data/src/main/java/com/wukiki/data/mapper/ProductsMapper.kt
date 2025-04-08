package com.wukiki.data.mapper

import com.wukiki.data.entity.ProductDetailEntity
import com.wukiki.data.util.CommonUtils.formatDateTime
import com.wukiki.data.util.CommonUtils.makeCommaPrice
import com.wukiki.domain.model.Product

object ProductsMapper {

    operator fun invoke(productEntities: List<ProductDetailEntity>): List<Product> {
        val newProducts = mutableListOf<Product>()

        productEntities.forEach { productEntity ->
            newProducts.add(
                Product(
                    productId = productEntity.id.toString(),
                    productName = productEntity.productName,
                    category = productEntity.category,
                    price = productEntity.price.toString(),
                    image = productEntity.image,
                    star = productEntity.star.toString(),
                    createdAt = formatDateTime(productEntity.createdAt),
                    description = productEntity.description,
                    reviews = emptyList()
                )
            )
        }

        return newProducts
    }
}