package com.backend.givu.model.dto;

import com.backend.givu.model.Enum.PaymentsStatus;
import com.backend.givu.model.Enum.PaymentsTransactionType;
import lombok.*;

import java.time.LocalDateTime;

@Setter
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class PaymentsDTO {
    private int transationId;
    private long userId;
    private int relatedFundingId;
    private int relatedProductId;
    private PaymentsTransactionType transationType;
    private int amount;
    private PaymentsStatus status;
    private LocalDateTime date;
}
