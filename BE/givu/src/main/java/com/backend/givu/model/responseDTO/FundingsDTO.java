package com.backend.givu.model.responseDTO;

import com.backend.givu.model.Enum.FundingsCategory;
import com.backend.givu.model.Enum.FundingsScope;
import com.backend.givu.model.Enum.FundingsStatus;
import com.backend.givu.model.entity.Funding;
import com.backend.givu.util.DateTimeUtil;
import com.backend.givu.util.mapper.CategoryMapper;
import com.backend.givu.util.mapper.ScopeMapper;
import com.backend.givu.util.mapper.StatusMapper;
import jdk.jfr.Category;
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
    private String category;
    private String categoryName;
    private String scope;
    private int participantsNumber;
    private int fundedAmount;
    private String status;
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
        this.category = CategoryMapper.toClient(funding.getCategory()); // 한글 이름으로 변환해서 넘김
        this.categoryName = funding.getCategoryName();
        this.scope = ScopeMapper.toClient(funding.getScope());          // 한글 이름으로 변환해서 넘김
        this.participantsNumber = funding.getParticipantsNumber();
        this.fundedAmount = funding.getFundedAmount();
        this.status = StatusMapper.toClient(funding.getStatus());     // 한글 이름으로 변환해서 넘김
        this.image = funding.getImage();
        this.createdAt = DateTimeUtil.toLocalDateTime(funding.getCreatedAt());
        this.updatedAt = DateTimeUtil.toLocalDateTime(funding.getUpdatedAt());
    }

}
