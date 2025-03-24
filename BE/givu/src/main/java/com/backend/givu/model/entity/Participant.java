package com.backend.givu.model.entity;

import com.backend.givu.model.Enum.ParticipantsRefundStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.hibernate.type.SqlTypes;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "participants")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Participant {
    @EmbeddedId
    private ParticipantId id;

    @MapsId("userId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @MapsId("fundingId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "funding_id", nullable = false)
    private Funding funding;

    @Column(name = "funding_amount")
    private Integer fundingAmount;

    @Column(name = "joined_at")
    private Instant joinedAt;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "refund_status", columnDefinition = "participant_refund_status")
    private ParticipantsRefundStatus refundStatus;
}