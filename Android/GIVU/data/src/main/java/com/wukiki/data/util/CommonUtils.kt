package com.wukiki.data.util

import java.time.Instant
import java.time.ZoneId
import java.time.format.DateTimeFormatter

object CommonUtils {

    fun formatDateTime(input: String): String {
        return try {
            val instant = Instant.parse(input) // ISO 8601 + Z 처리
            val zonedDateTime = instant.atZone(ZoneId.of("Asia/Seoul")) // 한국 시간대 적용
            val formatter = DateTimeFormatter.ofPattern("yyyy.MM.dd")
            zonedDateTime.format(formatter)
        } catch (e: Exception) {
            "1970.01.01"
        }
    }
}