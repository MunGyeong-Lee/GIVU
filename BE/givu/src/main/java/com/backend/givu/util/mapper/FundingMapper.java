package com.backend.givu.util.mapper;

import com.backend.givu.model.Document.FundingDocument;
import com.backend.givu.model.Document.ProductDocument;
import com.backend.givu.model.Enum.FundingsCategory;
import com.backend.givu.model.Enum.FundingsScope;
import com.backend.givu.model.Enum.FundingsStatus;
import com.backend.givu.model.entity.Funding;
import com.backend.givu.model.entity.Product;

import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

public class FundingMapper {

    public static FundingDocument toDocument(Funding funding) {
        DateTimeFormatter formatter = DateTimeFormatter.ISO_INSTANT;

        String createdAt = funding.getCreatedAt()
                .atZone(ZoneId.systemDefault()) // Instant → ZonedDateTime
                .toInstant()                    // → Instant
                .toString();                    // ISO-8601 형식 문자열
        String updatedAt = funding.getUpdatedAt()
                .atZone(ZoneId.systemDefault())
                .toInstant()
                .toString();

        return new FundingDocument(
                funding.getId(),
                funding.getUser().getId(),
                funding.getUser().getNickname(),
                funding.getUser().getProfileImage(),
                funding.getProduct().getId(),
                funding.getProduct().getProductName(),
                funding.getProduct().getPrice(),
                funding.getProduct().getImage(),
                funding.getTitle(),
                funding.getDescription(),
                funding.getCategory() != null
                        ? funding.getCategory().name()
                        : FundingsCategory.ETC.name(),
                funding.getCategoryName(),
                funding.getParticipantsNumber(),
                funding.getFundedAmount(),
                funding.getScope() != null
                        ? funding.getScope().name()
                        : FundingsScope.PUBLIC.name(),
                funding.getStatus() != null
                        ? funding.getStatus().name()
                        : FundingsStatus.PENDING.name(),
                funding.getImage(),
                createdAt,
                updatedAt
        );
    }
}
