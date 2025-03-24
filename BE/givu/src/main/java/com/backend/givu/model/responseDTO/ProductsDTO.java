package com.backend.givu.model.responseDTO;

import com.backend.givu.model.Enum.ProductsCategory;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class ProductsDTO {
    private int productId;
    private String productName;
    private ProductsCategory category;
    private int price;
    private String image;
    private int favorite;
    private float star;
    private LocalDateTime createdAt;
}
