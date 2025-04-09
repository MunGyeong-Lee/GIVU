package com.backend.givu.model.responseDTO;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class PaymentFailedEventDTO {
    private int paymentId;
    private Long userId;
    private String reason;
    private String status; // 항상 "FAIL"
}
