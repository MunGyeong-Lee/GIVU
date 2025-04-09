package com.backend.givu.model.responseDTO;


import lombok.*;

@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
public class GivuSuccessDTO {
    private Long userId;
    private int fundingId;
    private int amount;
    private int paymentId;
    private String reason;

    public GivuSuccessDTO (Long userId, int fundingId, int amount, int paymentId, String reason){
        this.userId = userId;
        this.fundingId = fundingId;
        this.amount = amount;
        this.paymentId = paymentId;
        this.reason = reason;
    }

}
