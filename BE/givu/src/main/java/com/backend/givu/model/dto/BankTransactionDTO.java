package com.backend.givu.model.dto;

import com.backend.givu.model.Enum.BankTransactionType;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class BankTransactionDTO {
    private int transactionId;
    private int userId;
    private BankTransactionType transactionType;
    private int amount;
    private String bankName;
    private LocalDateTime date;
}
