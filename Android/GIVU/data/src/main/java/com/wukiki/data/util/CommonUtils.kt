package com.wukiki.data.util

import java.text.DecimalFormat
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

object CommonUtils {

    fun formatDateTime(input: String): String {
        return try {
            val formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSSSSS")
            val dateTime = LocalDateTime.parse(input, formatter)
            val outputFormatter = DateTimeFormatter.ofPattern("yyyy.MM.dd HH:mm")
            dateTime.format(outputFormatter)
        } catch (e: Exception) {
            "1970.01.01"
        }
    }

    fun makeCommaPrice(num: Int): String {
        val comma = DecimalFormat("#,###")
        return "${comma.format(num)}원"
    }
}