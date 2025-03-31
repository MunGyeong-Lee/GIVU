package com.backend.givu.model.responseDTO;

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
    private long userId;
    private String comment;
    private String image;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private long visit;

    public ReviewsDTO (Review review){
        this.reviewId = review.getId();
        this.fundingId = review.getFunding().getId();
        this.userId = review.getUser().getId();
        this.comment = review.getComment();
        this.image = review.getImage();
        this.createdAt = DateTimeUtil.toLocalDateTime(review.getCreatedAt());
        this.updatedAt = DateTimeUtil.toLocalDateTime(review.getUpdatedAt());
        this.visit = review.getVisit();
    }
}
