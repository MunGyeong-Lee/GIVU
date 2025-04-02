package com.backend.givu.model.responseDTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ChargeResultDTO {
    private long userId;
    private int givupayBalance;
    private int accountBalance;
}
