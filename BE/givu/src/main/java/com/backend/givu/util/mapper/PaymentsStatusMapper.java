package com.backend.givu.util.mapper;

import com.backend.givu.model.Enum.PaymentsStatus;
import com.backend.givu.model.Enum.PaymentsTransactionType;

public class PaymentsStatusMapper {


    /**
     *  한글 -> 영어로 번역
     *
     */
    public static PaymentsStatus fromClient(String status){

        if(status == null) return null;

        return switch (status.toLowerCase()){
            case "대기 상태" -> PaymentsStatus.PENDING;
            case "성공 상태" -> PaymentsStatus.SUCCESS;
            case "실패 상태" -> PaymentsStatus.FAIL;


            default -> null;
        };

    }


    /**
     *  영어 -> 한글로 번역
     *
     */

    public static String toClient(PaymentsStatus status){
        if (status == null) return null;

        return switch(status){
            case PENDING -> "대기 상태";
            case SUCCESS -> "성공 상태";
            case FAIL -> "실패 상태";
        };
    }
}
