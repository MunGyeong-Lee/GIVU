package com.backend.givu.model.responseDTO;

import com.backend.givu.model.entity.Funding;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class FundingSuccessDTO {
    private Long userId;
    private int fundingId;
    private int amount;


    public FundingSuccessDTO (Funding funding){
        this.userId = funding.getUser().getId();
        this.fundingId = funding.getId();
        this.amount = funding.getFundedAmount();
    }

}
