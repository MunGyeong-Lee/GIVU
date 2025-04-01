package com.backend.givu.model.requestDTO;

import com.backend.givu.model.entity.Review;
import com.backend.givu.util.DateTimeUtil;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class ReviewCreateDTO {
    private int reviewId;
    private int fundingId;
    private long userId;
    private String comment;
    private String image;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private long visit;


}
