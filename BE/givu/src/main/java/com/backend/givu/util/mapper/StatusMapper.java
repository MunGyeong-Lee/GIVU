package com.backend.givu.util.mapper;

import com.backend.givu.model.Enum.FundingsScope;
import com.backend.givu.model.Enum.FundingsStatus;

public class StatusMapper {

    /**
     *  한글 -> 영어로 번역
     *
     */
    public static FundingsStatus fromClient(String status){

        if(status == null) return null;

        return switch (status.toLowerCase()){
            case "대기" -> FundingsStatus.PENDING;
            case "완료" -> FundingsStatus.COMPLETED;
            case "취소" -> FundingsStatus.CANCELED;
            case "배송 중" -> FundingsStatus.SHIPPING;
            case "배송 완료" -> FundingsStatus.DELIVERED;

            default -> null;
        };

    }


    /**
     *  영어 -> 한글로 번역
     *
     */

    public static String toClient(FundingsStatus status){
        if (status == null) return null;

        return switch(status){
            case PENDING -> "대기";
            case COMPLETED -> "완료";
            case CANCELED -> "취소";
            case SHIPPING -> "배송 중";
            case DELIVERED -> "배송 완료";
        };
    }

}
