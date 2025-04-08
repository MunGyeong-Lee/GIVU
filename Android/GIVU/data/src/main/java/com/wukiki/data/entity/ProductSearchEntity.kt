package com.wukiki.data.entity

import com.squareup.moshi.Json
import com.squareup.moshi.JsonClass

@JsonClass(generateAdapter = true)
data class ProductSearchEntity(
    @Json(name = "code")
    val code: String,

    @Json(name = "message")
    val message: String,

    @Json(name = "data")
    val data: ProductDetailEntity
)