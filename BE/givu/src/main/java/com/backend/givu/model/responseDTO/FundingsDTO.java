package com.backend.givu.model.responseDTO;

import com.backend.givu.model.Document.FundingDocument;
import com.backend.givu.model.Enum.FundingsCategory;
import com.backend.givu.model.Enum.FundingsScope;
import com.backend.givu.model.Enum.FundingsStatus;
import com.backend.givu.model.entity.Funding;
import com.backend.givu.util.DateTimeUtil;
import com.backend.givu.util.mapper.CategoryMapper;
import com.backend.givu.util.mapper.ScopeMapper;
import com.backend.givu.util.mapper.StatusMapper;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class FundingsDTO {

    private Integer fundingId;
    private UserSimpleInfoDTO user;
    private ProductsSimpleInfoDTO product;
    private String title;
    private String description;
    private String category;
    private String categoryName;
    private String scope;
    private Integer participantsNumber;
    private Integer fundedAmount;
    private String status;
    private List<String> image;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean hidden;

    // 🔹 일반 생성자 (hidden 처리 X)
    public FundingsDTO(Funding funding) {
        this(funding, false);
    }

    // 🔹 hidden 처리 포함 생성자
    public FundingsDTO(Funding funding, boolean hidden) {
        this.fundingId = funding.getId();
        this.hidden = hidden;
        this.createdAt = DateTimeUtil.toLocalDateTime(funding.getCreatedAt());
        this.updatedAt = DateTimeUtil.toLocalDateTime(funding.getUpdatedAt());
        this.scope = ScopeMapper.toClient(funding.getScope());
        this.status = StatusMapper.toClient(funding.getStatus());
        this.participantsNumber = funding.getParticipantsNumber();
        this.fundedAmount = funding.getFundedAmount();

        if (hidden) {
            this.title = "비공개 펀딩입니다.";
            this.description = null;
            this.image = Collections.emptyList();
            this.category = null;
            this.categoryName = null;
            this.product = null;
        } else {
            this.title = funding.getTitle();
            this.description = funding.getDescription();
            this.image = funding.getImage();
            this.category = CategoryMapper.toClient(funding.getCategory());
            this.categoryName = funding.getCategoryName();
            this.product = new ProductsSimpleInfoDTO(funding.getProduct());
        }

        this.user = new UserSimpleInfoDTO(funding.getUser());
    }

    // 🔹 검색 결과용 생성자 (기존 방식 유지)
    public FundingsDTO(FundingDocument funding) {
        this(funding, false);
    }

    // 🔹 검색 결과용 + hidden 처리
    public FundingsDTO(FundingDocument funding, boolean hidden) {
        this.fundingId = funding.getFundingId();
        this.hidden = hidden;
        this.createdAt = DateTimeUtil.parseIsoString(funding.getCreatedAt());
        this.updatedAt = DateTimeUtil.parseIsoString(funding.getUpdatedAt());
        this.scope = ScopeMapper.toClient(FundingsScope.valueOf(funding.getScope()));
        this.status = StatusMapper.toClient(FundingsStatus.valueOf(funding.getStatus()));
        this.participantsNumber = funding.getParticipantsNumber();
        this.fundedAmount = funding.getFundedAmount();

        if (hidden) {
            this.title = "비공개 펀딩입니다.";
            this.description = null;
            this.image = Collections.emptyList();
            this.category = null;
            this.categoryName = null;
            this.product = null;
        } else {
            this.title = funding.getTitle();
            this.description = funding.getDescription();
            this.image = funding.getImage();
            this.category = CategoryMapper.toClient(FundingsCategory.valueOf(funding.getCategory()));
            this.categoryName = funding.getCategoryName();
            this.product = new ProductsSimpleInfoDTO(
                    funding.getProductId(),
                    funding.getProductName(),
                    funding.getProductPrice(),
                    funding.getProductImage()
            );
        }

        this.user = new UserSimpleInfoDTO(
                funding.getUserId(),
                funding.getUserNickname(),
                funding.getUserImage()
        );
    }
}
