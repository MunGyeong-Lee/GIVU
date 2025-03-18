package com.backend.givu.model.dto;

import com.backend.givu.model.Enum.ParticipantsRefundStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ParticipantsDTO {
    private long userId;
    private int fundingId;
    private int fundingAmount;
    private LocalDateTime joinedAt;
    private ParticipantsRefundStatus refundStatus;
}
