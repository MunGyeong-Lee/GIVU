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
    private boolean creator; // 작성자면 true, 작성자 아니면 false
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

    private List<LetterDetailDTO> letters;
    private List<ReviewsDTO> reviews;

    private List<UserSimpleInfoDTO> participants;
    private int participantsCount;



    public static FundingDetailDTO of(
            Funding f, boolean creator, User writer, Product p, List<Letter> letters,
            List<Review> reviews, Long currentUserId, List<User> participants){
        return new FundingDetailDTO(
                f.getId(),
                creator,
                f.getTitle(),
                f.getDescription(),
                CategoryMapper.toClient(f.getCategory()),
                f.getCategoryName(),
                ScopeMapper.toClient(f.getScope()),
                participants.size(),
                f.getFundedAmount(),
                StatusMapper.toClient(f.getStatus()),
                f.getImage(),
                DateTimeUtil.toLocalDateTime(f.getCreatedAt()),
                DateTimeUtil.toLocalDateTime(f.getUpdatedAt()),

                new UserSimpleInfoDTO(writer.getId(), writer.getNickname(), writer.getProfileImage()),
                new ProductsSimpleInfoDTO(p),

                letters.stream().map(letter -> new LetterDetailDTO(letter, currentUserId)).toList(),
                reviews.stream().map(ReviewsDTO::new).toList(),

                participants.stream()
                        .map(u -> new UserSimpleInfoDTO(u.getId(), u.getNickname(), u.getProfileImage()))
                        .toList(),

                participants.size()
        );
    }


}
