package com.backend.givu.model.responseDTO;

import com.backend.givu.model.entity.Funding;
import com.backend.givu.model.entity.Payment;
import com.backend.givu.util.DateTimeUtil;
import com.backend.givu.util.mapper.TransactionTypeMapper;
import lombok.*;
import org.joda.time.DateTime;

import java.time.Instant;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class PaymentHistoryDTO {

    private int paymentId;
    private Long userId;
    private String fundingTitle;
    private String productName;
    private int amount;
    private String transactionType;
    private LocalDateTime date;

    public PaymentHistoryDTO(Payment payment){
        this.paymentId = payment.getId();
        this.userId = payment.getUser().getId();
        this.fundingTitle = payment.getRelatedFunding()!= null ? payment.getRelatedFunding().getTitle() :null;
        this.productName = payment.getRelatedProduct() != null ? payment.getRelatedProduct().getProductName() : null;
        this.amount = payment.getAmount();
        this.transactionType = TransactionTypeMapper.toClient(payment.getTransactionType());
        this.date = DateTimeUtil.toLocalDateTime(payment.getDate());
    }


}
