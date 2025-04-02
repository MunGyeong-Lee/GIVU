package com.backend.givu.model.requestDTO;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Random;

@Getter
@Setter
public class DepositRequestDTO {

    @JsonProperty("Header")
    private Header Header;
    private String accountNo;
    private String transactionBalance;
    private String transactionSummary;

    public DepositRequestDTO(String accountNo, String amount) {
        this.Header = new Header();
        this.accountNo = accountNo;
        this.transactionBalance = amount;
        this.transactionSummary = "(수시입출금) : 입금";
    }
    @Getter
    @Setter
    public static class Header {
        private String apiName;
        private String transmissionDate;
        private String transmissionTime;
        private String institutionCode;
        private String fintechAppNo;
        private String apiServiceCode;
        private String institutionTransactionUniqueNo;
        private String apiKey;
        private String userKey;

        public Header() {
            this.apiName = "updateDemandDepositAccountDeposit";
            this.apiServiceCode = "updateDemandDepositAccountDeposit";
            this.transmissionDate = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
            this.transmissionTime = LocalTime.now().format(DateTimeFormatter.ofPattern("HHmmss"));
            this.institutionCode = "00100";
            this.fintechAppNo = "001";
            this.apiKey = "3ff8c25e6234421591af7f0d287d8d48";
            this.userKey = "72dabe96-cc1e-4143-b283-8c599273dda3";
            this.institutionTransactionUniqueNo = generateUniqueTransactionId();
        }

        private String generateUniqueTransactionId() {
            String date = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
            String time = LocalTime.now().format(DateTimeFormatter.ofPattern("HHmmss"));
            String random = String.format("%06d", new Random().nextInt(1_000_000)); // 000000 ~ 999999
            return date + time + random;
        }

    }
}
