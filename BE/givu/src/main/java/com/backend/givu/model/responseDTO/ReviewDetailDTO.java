package com.backend.givu.model.responseDTO;

import com.backend.givu.model.entity.Review;
import com.backend.givu.util.DateTimeUtil;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReviewDetailDTO {
    private int reviewId;
    private int fundingId;
    private UserSimpleInfoDTO user;
    private String comment;
    private String image;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private long visit;
    private boolean creator;

    public ReviewDetailDTO(Review review, Boolean creator){
        this.reviewId = review.getId();
        this.fundingId = review.getFunding().getId();
        this.comment = review.getComment();
        this.image = review.getImage();
        this.createdAt= DateTimeUtil.toLocalDateTime(review.getCreatedAt());
        this.updatedAt = DateTimeUtil.toLocalDateTime(review.getUpdatedAt());
        this.visit = review.getVisit();
        this.creator = creator;

        this.user = new UserSimpleInfoDTO(
                review.getUser().getId(),
                review.getUser().getNickname(),
                review.getUser().getProfileImage()
        );
    }
}
