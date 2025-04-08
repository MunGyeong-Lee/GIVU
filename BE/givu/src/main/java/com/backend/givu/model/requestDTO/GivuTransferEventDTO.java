package com.backend.givu.model.requestDTO;

import com.backend.givu.model.entity.Payment;
import com.backend.givu.util.mapper.PaymentsStatusMapper;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.parameters.P;

@Getter
@Setter
@NoArgsConstructor //Jackson이 역직렬화할 때 사용
public class GivuTransferEventDTO {
    private Long userId;
    private int fundingId;
    private int amount;
    private int paymentId;
    private String status;
    private String reason;

    public GivuTransferEventDTO(Payment payment, String reason){
        this.userId = payment.getUser().getId();
        this.fundingId = payment.getRelatedFunding().getId();
        this.amount = payment.getAmount();
        this.paymentId = payment.getId();
        this.status = PaymentsStatusMapper.toClient(payment.getStatus());
        this.reason = reason;
    }
}
