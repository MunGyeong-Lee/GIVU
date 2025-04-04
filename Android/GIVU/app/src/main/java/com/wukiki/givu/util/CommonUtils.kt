package com.wukiki.givu.util

import java.text.DecimalFormat

object CommonUtils {

    // 천단위 콤마
    fun makeCommaPrice(num:Int):String{
        val comma = DecimalFormat("#,###")
        return "${comma.format(num)}원"
    }

    fun makePercentage(first: Int, second: Int): Int {
        return (first.toFloat() / second.toFloat() * 100F).toInt()
    }
}