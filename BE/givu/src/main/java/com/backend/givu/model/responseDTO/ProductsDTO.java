package com.backend.givu.model.responseDTO;

import com.backend.givu.model.Enum.ProductsCategory;
import com.backend.givu.model.entity.Product;
import com.backend.givu.util.DateTimeUtil;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class ProductsDTO {
    private int id;
    private String productName;
    private ProductsCategory category;
    private int price;
    private String image;
    private int favorite;
    private double star;
    private LocalDateTime createdAt;
    private String description;

    public ProductsDTO(Product product){
        this.id = product.getId();
        this.productName = product.getProductName();
        this.category = product.getCategory();
        this.price = product.getPrice();
        this.image = product.getImage();
        this.favorite = product.getFavorite();
        this.star = product.getStar();
        this.createdAt = DateTimeUtil.toLocalDateTime(product.getCreatedAt());
        this.description = product.getDescription();
    }
}
