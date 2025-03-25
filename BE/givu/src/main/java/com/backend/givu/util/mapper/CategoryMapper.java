package com.backend.givu.util.mapper;

import com.backend.givu.model.Enum.FundingsCategory;

public class CategoryMapper {

    /**
     *  한글 -> 영어로 번역
     *
     */
    public static FundingsCategory fromClient(String category){

        if(category == null) return null;

        return switch (category.toLowerCase()){
            case "생일" -> FundingsCategory.BIRTHDAY;
            case "집들이" -> FundingsCategory.HOUSEWARMING;
            case "결혼" -> FundingsCategory.WEDDING;
            case "졸업" -> FundingsCategory.GRADUATION;
            case "취직" -> FundingsCategory.EMPLOYMENT;
            case "출산" -> FundingsCategory.CHILDBIRTH;
            case "기타" -> FundingsCategory.ETC;
            default -> null;

        };

    }


    /**
     *  영어 -> 한글로 번역
     *
     */

    public static String toClient(FundingsCategory category){
        if (category == null) return null;

        return switch(category){
            case BIRTHDAY -> "생일";
            case HOUSEWARMING -> "집들이";
            case WEDDING -> "결혼";
            case GRADUATION -> "졸업";
            case EMPLOYMENT -> "취직";
            case CHILDBIRTH -> "출산";
            case ETC -> "기타";
        };
    }

}
