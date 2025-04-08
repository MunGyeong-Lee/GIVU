package com.backend.givu.model.requestDTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RefundEventDTO {
    private Long userId;
    private int fundingId;
    private int paymenetId;
    private int amount;

}