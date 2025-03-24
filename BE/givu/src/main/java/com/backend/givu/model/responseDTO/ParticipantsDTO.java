package com.backend.givu.model.responseDTO;

import com.backend.givu.model.Enum.ParticipantsRefundStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ParticipantsDTO {
    private long userId;
    private int fundingId;
    private int fundingAmount;
    private LocalDateTime joinedAt;
    private ParticipantsRefundStatus refundStatus;
}
