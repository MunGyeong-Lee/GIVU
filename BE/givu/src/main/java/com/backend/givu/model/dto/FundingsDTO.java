package com.backend.givu.model.dto;

import com.backend.givu.model.Enum.FundingsCategory;
import com.backend.givu.model.Enum.FundingsScope;
import com.backend.givu.model.Enum.FundingsStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class FundingsDTO {
    private int fundingId;
    private long userId;
    private int productId;
    private String title;
    private String body;
    private String description;
    private FundingsCategory category;
    private String categoryName;
    private FundingsScope scope;
    private int participantsNumber;
    private int fundedAmount;
    private FundingsStatus status;
    private String image;
    private String image2;
    private String image3;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
