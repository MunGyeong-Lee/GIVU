package com.backend.givu.model.dto;

import com.backend.givu.model.Enum.PaymentsStatus;
import com.backend.givu.model.Enum.PaymentsTransationType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
@NoArgsConstructor
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
