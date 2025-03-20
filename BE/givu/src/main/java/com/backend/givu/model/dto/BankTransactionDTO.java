package com.backend.givu.model.dto;

import com.backend.givu.model.Enum.BankTransactionType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BankTransactionDTO {
    private int transactionKey;
    private int userId;
    private BankTransactionType transactionType;
    private int amount;
    private String bankName;
    private LocalDateTime date;
}
