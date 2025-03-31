package com.wukiki.data.mapper

import com.wukiki.data.entity.ProductEntity
import com.wukiki.data.util.CommonUtils.formatDateTime
import com.wukiki.domain.model.Product

object ProductsMapper {

    operator fun invoke(productEntities: List<ProductEntity>): List<Product> {
        val newProducts = mutableListOf<Product>()

        productEntities.forEach { productEntity ->
            newProducts.add(
                Product(
                    productId = productEntity.id.toString(),
                    productName = productEntity.productName,
                    category = productEntity.category,
                    price = productEntity.price.toString(),
                    image = productEntity.image,
                    favorite = productEntity.favorite.toString(),
                    star = productEntity.star.toString(),
                    createdAt = formatDateTime(productEntity.createdAt),
                    description = productEntity.description
                )
            )
        }

        return newProducts
    }
}