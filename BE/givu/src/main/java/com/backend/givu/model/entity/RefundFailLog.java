package com.backend.givu.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "refund_fail_log")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class RefundFailLog {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "refund_fail_log_seq_gen")
    @SequenceGenerator(
            name = "refund_fail_log_seq_gen",
            sequenceName = "refund_fail_log_seq",
            allocationSize = 1  // 시퀀스 증가량을 1로 맞춤
    )
    private Integer id;
    private Long userId;
    private int fundingId;
    private int amount;
    private String reason; // Exception 메시지 or 상태 코드
    private LocalDateTime failedAt = LocalDateTime.now();

    public RefundFailLog(Long userId, int fundingId, int amount, String reason) {
        this.userId = userId;
        this.fundingId = fundingId;
        this.amount = amount;
        this.reason = reason;
        this.failedAt = LocalDateTime.now();
    }


}