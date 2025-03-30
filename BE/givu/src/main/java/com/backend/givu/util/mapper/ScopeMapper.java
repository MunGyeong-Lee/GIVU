package com.backend.givu.util.mapper;

import com.backend.givu.model.Enum.FundingsCategory;
import com.backend.givu.model.Enum.FundingsScope;

public class ScopeMapper {

    /**
     *  한글 -> 영어로 번역
     *
     */
    public static FundingsScope fromClient(String scope){

        if(scope == null) return null;

        return switch (scope.toLowerCase()){
            case "공개" -> FundingsScope.PUBLIC;
            case "비밀" -> FundingsScope.PRIVATE;
            default -> null;
        };

    }


    /**
     *  영어 -> 한글로 번역
     *
     */

    public static String toClient(FundingsScope scope){
        if (scope == null) return null;

        return switch(scope){
            case PUBLIC -> "공개";
            case PRIVATE -> "비밀";
        };
    }

}
