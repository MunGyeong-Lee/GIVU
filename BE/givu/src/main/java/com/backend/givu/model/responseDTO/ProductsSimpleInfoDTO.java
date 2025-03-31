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
public class ProductsSimpleInfoDTO {
    private int id;
    private String productName;
    private int price;
    private String image;


    public ProductsSimpleInfoDTO(Product product){
        this.id = product.getId();
        this.productName = product.getProductName();
        this.price = product.getPrice();
        this.image = product.getImage();

    }
}
