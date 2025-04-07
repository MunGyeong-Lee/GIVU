package com.backend.givu.model.requestDTO;

import com.backend.givu.model.entity.Payment;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor //Jackson이 역직렬화할 때 사용
public class GivuTransferEventDTO {
    private Long userId;
    private int fundingId;
    private int amount;
    private int paymentId;

    public GivuTransferEventDTO(Payment payment){
        this.userId = payment.getUser().getId();
        this.fundingId = payment.getRelatedFunding().getId();
        this.amount = payment.getAmount();
        this.paymentId = payment.getId();
    }
}
