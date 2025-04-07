package com.backend.givu.util.mapper;

import com.backend.givu.model.Enum.FundingsStatus;
import com.backend.givu.model.Enum.PaymentsTransactionType;

public class TransactionTypeMapper {

    /**
     *  한글 -> 영어로 번역
     *
     */
    public static PaymentsTransactionType fromClient(String status){

        if(status == null) return null;

        return switch (status.toLowerCase()){
            case "펀딩" -> PaymentsTransactionType.FUNDING;
            case "상품 구매" -> PaymentsTransactionType.PRODUCT;
            case "환불" -> PaymentsTransactionType.REFUND;


            default -> null;
        };

    }


    /**
     *  영어 -> 한글로 번역
     *
     */

    public static String toClient(PaymentsTransactionType status){
        if (status == null) return null;

        return switch(status){
            case FUNDING -> "펀딩";
            case PRODUCT -> "상품 구매";
            case REFUND -> "환불";
        };
    }

}
