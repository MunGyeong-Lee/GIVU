package com.backend.givu.model.responseDTO;

import com.backend.givu.model.entity.Payment;
import com.backend.givu.util.DateTimeUtil;
import com.backend.givu.util.mapper.PaymentsStatusMapper;
import com.backend.givu.util.mapper.TransactionTypeMapper;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class PaymentResultDTO {
    private int paymentId;
    private Long userId;
    private int fundingId;
    private int productId;
    private int amount;
    private String transactionType;
    private String status;
    private LocalDateTime date;

    public PaymentResultDTO(Payment payment){
        this.paymentId = payment.getId();
        this.userId = payment.getUser().getId();
        this.fundingId = payment.getRelatedFunding() != null ? payment.getRelatedFunding().getId() : 0;
        this.productId= payment.getRelatedProduct() != null ? payment.getRelatedProduct().getId() : 0;
        this.amount = payment.getAmount();
        this.transactionType = TransactionTypeMapper.toClient(payment.getTransactionType());
        this.status = PaymentsStatusMapper.toClient(payment.getStatus());
        this.date = DateTimeUtil.toLocalDateTime(payment.getDate());
    }



}
