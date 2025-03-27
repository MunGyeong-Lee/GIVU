package com.backend.givu.model.requestDTO;

import com.backend.givu.model.Enum.FundingsCategory;
import com.backend.givu.model.Enum.FundingsScope;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class FundingCreateDTO {
    private String title;
    private int productId;
    private String body;
    private String description;
    private String category;
    private String categoryName;
    private FundingsScope scope;

}
