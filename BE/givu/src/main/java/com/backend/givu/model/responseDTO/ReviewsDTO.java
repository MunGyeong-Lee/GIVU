package com.backend.givu.model.responseDTO;

import com.backend.givu.model.entity.Funding;
import com.backend.givu.model.entity.Review;
import com.backend.givu.util.DateTimeUtil;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class ReviewsDTO {
    private int reviewId;
    private int fundingId;
    private UserSimpleInfoDTO user;
    private String comment;
    private String image;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private long visit;

    public ReviewsDTO (Review review){
        this.reviewId = review.getId();
        this.fundingId = review.getFunding().getId();
        this.comment = review.getComment();
        this.image = review.getImage();
        this.createdAt = DateTimeUtil.toLocalDateTime(review.getCreatedAt());
        this.updatedAt = DateTimeUtil.toLocalDateTime(review.getUpdatedAt());
        this.visit = review.getVisit();

        this.user = new UserSimpleInfoDTO(
                review.getUser().getId(),
                review.getUser().getNickname(),
                review.getUser().getProfileImage()

        );

    }
}
