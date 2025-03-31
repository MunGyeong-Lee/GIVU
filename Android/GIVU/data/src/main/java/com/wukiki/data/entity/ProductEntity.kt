package com.wukiki.data.entity

import com.squareup.moshi.Json
import com.squareup.moshi.JsonClass

@JsonClass(generateAdapter = true)
data class ProductEntity(
    @Json(name = "id")
    val id: Int,

    @Json(name = "productName")
    val productName: String,

    @Json(name = "category")
    val category: String,

    @Json(name = "price")
    val price: Int,

    @Json(name = "image")
    val image: String,

    @Json(name = "favorite")
    val favorite: Int,

    @Json(name = "star")
    val star: Double,

    @Json(name = "createdAt")
    val createdAt: String,

    @Json(name = "description")
    val description: String
)