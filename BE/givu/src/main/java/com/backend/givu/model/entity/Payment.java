package com.backend.givu.model.entity;

import com.backend.givu.model.Enum.PaymentsStatus;
import com.backend.givu.model.Enum.PaymentsTransactionType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.hibernate.type.SqlTypes;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "payments")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "transaction_id", nullable = false)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "related_funding_id")
    private Funding relatedFunding;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "related_product_id")
    private Product relatedProduct;

    @Column(name = "amount")
    private Integer amount;

    @Column(name = "date")
    private Instant date;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "transaction_type", columnDefinition = "payment_transaction_type")
    private PaymentsTransactionType transactionType;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "status", columnDefinition = "payment_status")
    private PaymentsStatus status;

    @PrePersist
    protected void onCreate(){
        Instant now = Instant.now() ;
        this.date = now;
    }

    @PreUpdate
    protected  void onUpdate(){
        this.date = Instant.now();
    }

    public void markSuccess(){
        this.status = PaymentsStatus.SUCCESS;
    }

    public void markFailed(){
        this.status = PaymentsStatus.FAIL;
    }





}