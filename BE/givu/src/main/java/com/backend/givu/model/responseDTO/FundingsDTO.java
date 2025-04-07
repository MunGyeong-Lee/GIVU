package com.backend.givu.model.responseDTO;

import com.backend.givu.model.Document.FundingDocument;
import com.backend.givu.model.Enum.FundingsCategory;
import com.backend.givu.model.Enum.FundingsScope;
import com.backend.givu.model.Enum.FundingsStatus;
import com.backend.givu.model.entity.Funding;
import com.backend.givu.model.entity.Product;
import com.backend.givu.util.DateTimeUtil;
import com.backend.givu.util.mapper.CategoryMapper;
import com.backend.givu.util.mapper.ScopeMapper;
import com.backend.givu.util.mapper.StatusMapper;
import jdk.jfr.Category;
import lombok.*;

import java.time.Instant;
import java.time.LocalDateTime;
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
    private Integer  participantsNumber;
    private Integer  fundedAmount;
    private String status;
    private List<String> image;
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
//
//    public FundingsDTO(Integer fundingId, String title, String body, String description,
//                       FundingsCategory category, String categoryName, Integer participantsNumber,
//                       FundingsScope scope, FundingsStatus status, Integer fundedAmount,
//                       List<String> image, Instant createdAt, Instant updatedAt,
//                       Long userId, String nickname, String profileImage,
//                       Integer productId, String productName, Integer price, String productImage) {
//        this.fundingId = fundingId;
//        this.user = new UserSimpleInfoDTO(userId, nickname, profileImage);
//        this.product = new ProductsSimpleInfoDTO(productId, productName, price, productImage);
//        this.title = title;
//        this.body = body;
//        this.description = description;
//        this.category = CategoryMapper.toClient(category); // 영어 -> 한글
//        this.categoryName = categoryName;
//        this.scope = ScopeMapper.toClient(scope);          // 영어 -> 한글
//        this.participantsNumber = participantsNumber;
//        this.fundedAmount = fundedAmount;
//        this.status = StatusMapper.toClient(status);       // 영어 -> 한글
////        this.image = image;
//        this.createdAt = DateTimeUtil.toLocalDateTime(createdAt);
//        this.updatedAt = DateTimeUtil.toLocalDateTime(updatedAt);
//    }


    public FundingsDTO(Funding funding){
        this.fundingId = funding.getId();
        this.title = funding.getTitle();
        this.description = funding.getDescription();
        this.category = CategoryMapper.toClient(funding.getCategory());
        this.categoryName = funding.getCategoryName();
        this.scope = ScopeMapper.toClient(funding.getScope());
        this.status = StatusMapper.toClient(funding.getStatus());
        this.participantsNumber = funding.getParticipantsNumber();
        this.fundedAmount = funding.getFundedAmount();
        this.image = funding.getImage();
        this.createdAt = DateTimeUtil.toLocalDateTime(funding.getCreatedAt());
        this.updatedAt = DateTimeUtil.toLocalDateTime(funding.getUpdatedAt());
        // user 정보
        this.user = new UserSimpleInfoDTO(funding.getUser());
        // product 정보
        this.product = new ProductsSimpleInfoDTO(funding.getProduct());
    }

    public FundingsDTO(FundingDocument funding){
        this.fundingId = funding.getFundingId();
        this.title = funding.getTitle();
        this.description = funding.getDescription();
        this.category = CategoryMapper.toClient(FundingsCategory.valueOf(funding.getCategory()));
        this.categoryName = funding.getCategoryName();
        this.scope = ScopeMapper.toClient(FundingsScope.valueOf(funding.getScope()));
        this.status = StatusMapper.toClient(FundingsStatus.valueOf(funding.getStatus()));
        this.participantsNumber = funding.getParticipantsNumber();
        this.fundedAmount = funding.getFundedAmount();
        this.image = funding.getImage();
        this.createdAt = DateTimeUtil.parseIsoString(funding.getCreatedAt());
        this.updatedAt = DateTimeUtil.parseIsoString(funding.getUpdatedAt());
        // user 정보
        this.user = new UserSimpleInfoDTO(funding.getUserId(),funding.getUserNickname(),funding.getUserImage());
        // product 정보
        this.product = new ProductsSimpleInfoDTO(funding.getProductId(), funding.getProductName(), funding.getProductPrice(), funding.getProductImage());
    }

}
