package com.backend.givu.model.dto;

import com.backend.givu.model.Enum.ProductsCateogry;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
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
