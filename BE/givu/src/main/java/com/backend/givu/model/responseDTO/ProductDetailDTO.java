package com.backend.givu.model.responseDTO;

import com.backend.givu.model.Enum.ProductsCategory;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@AllArgsConstructor
@Getter
@Setter
@NoArgsConstructor
public class ProductDetailDTO {
    private ProductsDTO product;
    private List<ProductReviewDTO> reviews;
    private Integer likeCount;
    private boolean likedByUser;
    private boolean permission;
}
