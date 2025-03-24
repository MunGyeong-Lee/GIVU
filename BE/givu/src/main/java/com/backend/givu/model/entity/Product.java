package com.backend.givu.model.entity;

import com.backend.givu.model.Enum.ProductsCategory;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id", nullable = false)
    private Integer id;

    @Size(max = 100)
    @NotNull
    @Column(name = "product_name", nullable = false, length = 100)
    private String productName;

    @NotNull
    @Column(name = "price", nullable = false)
    private Integer price;

    @Size(max = 255)
    @Column(name = "image")
    private String image;

    @Column(name = "favorite")
    private Integer favorite;

    @Column(name = "star")
    private Double star;

    @Column(name = "created_at")
    private Instant createdAt;
    @OneToMany(mappedBy = "relatedProduct")
    private Set<Payment> payments = new LinkedHashSet<>();

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "category", columnDefinition = "product_category")
    private ProductsCategory category;
}