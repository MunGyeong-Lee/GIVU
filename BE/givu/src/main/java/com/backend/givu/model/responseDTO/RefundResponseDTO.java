package com.backend.givu.model.responseDTO;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class RefundResponseDTO {

    private Long userId;
    private int fundingId;
//    private int amount;

}
