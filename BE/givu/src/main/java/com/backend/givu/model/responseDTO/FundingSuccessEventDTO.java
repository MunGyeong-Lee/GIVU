package com.backend.givu.model.responseDTO;

import com.backend.givu.model.Enum.PaymentsStatus;
import com.backend.givu.model.entity.Funding;
import com.backend.givu.model.entity.Payment;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class FundingSuccessEventDTO {
    private Long userId;
    private int amount;
    private int fundingId;
    private int paymentId;
    private PaymentsStatus status;


    public FundingSuccessEventDTO(Funding funding, Payment payment){
        this.userId = funding.getUser().getId();
        this.fundingId = funding.getId();
        this.amount = funding.getFundedAmount();
        this.paymentId = payment.getId();
        this.status = payment.getStatus();
    }

}
