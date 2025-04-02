package com.backend.givu.util.mapper;

import com.backend.givu.model.Enum.FundingsScope;
import com.backend.givu.model.Enum.LettersPrivate;

public class LetterPrivateMapper {

    /**
     *  한글 -> 영어로 번역
     *
     */
    public static LettersPrivate fromClient(String letterPrivate){

        if(letterPrivate == null) return null;

        return switch (letterPrivate.toLowerCase()){
            case "공개" -> LettersPrivate.PUBLIC;
            case "비밀" -> LettersPrivate.PRIVATE;
            default -> null;
        };

    }


    /**
     *  영어 -> 한글로 번역
     *
     */

    public static String toClient(LettersPrivate letterPrivate){
        if (letterPrivate == null) return null;

        return switch(letterPrivate){
            case PUBLIC -> "공개";
            case PRIVATE -> "비밀";
        };
    }

}
