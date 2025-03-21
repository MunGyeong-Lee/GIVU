package com.backend.givu.model.dto;

import com.backend.givu.model.Enum.PaymentsStatus;
import com.backend.givu.model.Enum.PaymentsTransationType;
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
    private PaymentsTransationType transationType;
    private int amount;
    private PaymentsStatus status;
    private LocalDateTime date;
}
