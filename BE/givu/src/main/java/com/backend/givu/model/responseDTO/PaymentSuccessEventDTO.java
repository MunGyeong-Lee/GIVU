package com.backend.givu.model.responseDTO;

import com.backend.givu.model.entity.Payment;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentSuccessEventDTO {
    private int paymentId;
    private Long userId;
    private int amount;

    public PaymentSuccessEventDTO(Payment payment) {
        this.paymentId = payment.getId();
        this.userId = payment.getUser().getId();
        this.amount = payment.getAmount();
    }
}
