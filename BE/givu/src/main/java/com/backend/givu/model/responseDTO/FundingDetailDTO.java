package com.backend.givu.model.responseDTO;

import com.backend.givu.model.entity.*;
import com.backend.givu.util.DateTimeUtil;
import com.backend.givu.util.mapper.CategoryMapper;
import com.backend.givu.util.mapper.ScopeMapper;
import com.backend.givu.util.mapper.StatusMapper;
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

    private UserSimpleInfoDTO writer;
    private ProductsSimpleInfoDTO product;

    private List<LettersDTO> letters;
    private List<ReviewsDTO> reviews;

    public static FundingDetailDTO of(Funding f, User writer, Product p, List<Letter> letters, List<Review> reviews){
        return new FundingDetailDTO(
                f.getId(),
                f.getTitle(),
                f.getDescription(),
                CategoryMapper.toClient(f.getCategory()),
                f.getCategoryName(),
                ScopeMapper.toClient(f.getScope()),
                f.getParticipantsNumber(),
                f.getFundedAmount(),
                StatusMapper.toClient(f.getStatus()),
                f.getImage(),
                DateTimeUtil.toLocalDateTime(f.getCreatedAt()),
                DateTimeUtil.toLocalDateTime(f.getUpdatedAt()),

                new UserSimpleInfoDTO(writer.getId(), writer.getNickname(), writer.getProfileImage()),
                new ProductsSimpleInfoDTO(p),

                letters.stream().map(LettersDTO::new).toList(),
                reviews.stream().map(ReviewsDTO::new).toList()
        );
    }


}
