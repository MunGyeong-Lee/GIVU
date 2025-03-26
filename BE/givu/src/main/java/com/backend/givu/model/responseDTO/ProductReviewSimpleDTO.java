package com.backend.givu.model.responseDTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
public class ProductReviewSimpleDTO {
    private int reviewId;
    private String title;
    private int star;
    private long userId;
}
