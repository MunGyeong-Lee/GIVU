package com.backend.givu.model.requestDTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class RefundResultEventDTO {
    private Long userId;
    private int fundingId;
    private int amount;
    private int paymentId;
    private boolean success;
    private String message; // 성공 메시지 or 실패 이유
}
