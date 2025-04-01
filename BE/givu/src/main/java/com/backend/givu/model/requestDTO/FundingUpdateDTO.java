package com.backend.givu.model.requestDTO;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class FundingUpdateDTO {
    private String title;
    private String description;
    private String category;
    private String categoryName;
    private String scope;

    private List<String> toDelete;

}
