package com.wukiki.data.entity

import com.squareup.moshi.Json
import com.squareup.moshi.JsonClass

@JsonClass(generateAdapter = true)
data class ProductImageEntity(
    @Json(name = "imageUrl")
    val imageUrl: String,

    @Json(name = "message")
    val message: String
)