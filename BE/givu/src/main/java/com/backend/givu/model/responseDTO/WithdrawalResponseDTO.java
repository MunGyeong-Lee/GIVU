package com.backend.givu.model.responseDTO;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
public class WithdrawalResponseDTO {
    @JsonProperty("Header")
    private Header Header;

    @JsonProperty("REC")
    private Rec REC;

    @Getter
    @Setter
    @NoArgsConstructor
    public static class Header {
        private String responseCode;
        private String responseMessage;
        private String apiName;
        private String transmissionDate;
        private String transmissionTime;
        private String institutionCode;
        private String apiKey;
        private String apiServiceCode;
        private String institutionTransactionUniqueNo;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    public static class Rec {
        private String transactionUniqueNo;
        private String transactionDate;
    }
}
