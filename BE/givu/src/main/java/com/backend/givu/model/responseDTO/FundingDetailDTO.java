package com.backend.givu.model.responseDTO;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;


@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class FundingDetailDTO {

    private Integer fundingId;
    private UserSimpleInfoDTO user;
    private ProductsSimpleInfoDTO product;
    private String title;
    private String description;
    private String category;
    private String categoryName;
    private String scope;
    private Integer  participantsNumber;
    private Integer  fundedAmount;
    private String status;
    private List<String> image;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;


}
