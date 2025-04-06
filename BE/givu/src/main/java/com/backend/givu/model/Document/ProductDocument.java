package com.backend.givu.model.Document;

import com.backend.givu.model.Enum.ProductsCategory;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.elasticsearch.annotations.DateFormat;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import java.time.Instant;
import java.time.LocalDateTime;

@Document(indexName = "products")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductDocument {
    @Id
    private Integer id;
    private String productName;
    private int price;
    private String image;
    private int favorite;
    private double star;
    private String description;

    @Field(type = FieldType.Date, format = DateFormat.date_time)
    private String createdAt;
    private ProductsCategory category;
}
