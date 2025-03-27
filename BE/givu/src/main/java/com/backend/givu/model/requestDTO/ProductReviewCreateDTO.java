package com.backend.givu.model.requestDTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductReviewCreateDTO {
    private String title;
    private String body;
    private String image;
    private int star;
}
