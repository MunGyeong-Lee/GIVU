package com.backend.givu.model.dto;

import com.backend.givu.model.Enum.ProductsCateogry;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class ProductsDTO {
    private int productId;
    private String productName;
    private ProductsCateogry category;
    private int price;
    private String image;
    private int favorite;
    private float star;
    private LocalDateTime createdAt;
}
