package com.backend.givu.model.responseDTO;

import com.backend.givu.model.Enum.FundingsCategory;
import com.backend.givu.model.Enum.FundingsScope;
import com.backend.givu.model.Enum.FundingsStatus;
import com.backend.givu.model.entity.Funding;
import com.backend.givu.util.DateTimeUtil;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
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
    private List<String> image;
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    public FundingsDTO(Funding funding) {
        this.fundingId = funding.getId();
        this.userId = funding.getUser().getId();
        this.productId = funding.getProductId();
        this.title = funding.getTitle();
        this.body = funding.getBody();
        this.description = funding.getDescription();
        this.category = funding.getCategory();
        this.categoryName = funding.getCategoryName();
        this.scope = funding.getScope();
        this.participantsNumber = funding.getParticipantsNumber();
        this.fundedAmount = funding.getFundedAmount();
        this.status = funding.getStatus();
        this.image = funding.getImage();
        this.createdAt = DateTimeUtil.toLocalDateTime(funding.getCreatedAt());
        this.updatedAt = DateTimeUtil.toLocalDateTime(funding.getUpdatedAt());
    }

}
