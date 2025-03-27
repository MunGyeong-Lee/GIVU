package com.backend.givu.model.responseDTO;

import com.backend.givu.model.entity.Product;
import com.backend.givu.model.entity.ProductReview;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductReviewDTO {
    private int reviewId;
    private String title;
    private String body;
    private String image;
    private int star;
    private UserSimpleInfoDTO user;

    public ProductReviewDTO(int reviewId, String title, String body, String image ,int star, Long userId, String nickname, String userImage){
        this.reviewId = reviewId;
        this.title = title;
        this.body = body;
        this.image = image;
        this.star = star;
        this.user = new UserSimpleInfoDTO(userId, nickname, userImage);
    }
}
