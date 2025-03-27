package com.backend.givu.model.responseDTO;

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
}
