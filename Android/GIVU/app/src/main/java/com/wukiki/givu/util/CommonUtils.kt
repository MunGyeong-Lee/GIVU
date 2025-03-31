package com.wukiki.givu.util

object CommonUtils {
    //천단위 콤마
    fun makeCommaPrice(num:Int):String{
        val comma = DecimalFormat("#,###")
        return "${comma.format(num)}원"
    }

}