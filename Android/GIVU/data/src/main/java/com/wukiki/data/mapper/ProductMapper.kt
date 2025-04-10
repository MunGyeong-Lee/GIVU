package com.wukiki.data.mapper

import com.wukiki.data.entity.ProductEntity
import com.wukiki.data.util.CommonUtils.formatDateTime
import com.wukiki.domain.model.Product
import com.wukiki.domain.model.ProductDetail
import com.wukiki.domain.model.ProductReview

object ProductMapper {

    operator fun invoke(productEntity: ProductEntity): ProductDetail {
        val newProductReviews = mutableListOf<ProductReview>()

        productEntity.reviews.forEach { review ->
            newProductReviews.add(
                ProductReview(
                    reviewId = review.reviewId,
                    title = review.title,
                    body = review.body,
                    image = review.image ?: "",
                    star = review.star,
                    userId = review.user.userId,
                    nickname = review.user.nickname,
                    userImage = review.user.image ?: ""
                )
            )
        }

        val product = Product(
            productId = productEntity.product.id.toString(),
            productName = productEntity.product.productName,
            category = productEntity.product.category,
            price = productEntity.product.price.toString(),
            image = productEntity.product.image,
            star = productEntity.product.star.toString(),
            createdAt = formatDateTime(productEntity.product.createdAt),
            description = productEntity.product.description,
            reviews = newProductReviews
        )

        return ProductDetail(
            product = product,
            likeCount = productEntity.likeCount,
            isLiked = productEntity.isLiked
        )
    }
}