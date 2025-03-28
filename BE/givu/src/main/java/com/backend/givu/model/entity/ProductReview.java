package com.backend.givu.model.entity;

import com.backend.givu.model.requestDTO.ProductReviewCreateDTO;
import com.backend.givu.model.responseDTO.ProductReviewDTO;
import com.backend.givu.model.responseDTO.UserSimpleInfoDTO;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "product_review")
@AllArgsConstructor
public class ProductReview {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_review_id", nullable = false)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Size(max = 255)
    @NotNull
    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "body", length = Integer.MAX_VALUE)
    private String body;

    @Column(name = "star")
    private Integer star;

    @Size(max = 1024)
    @Column(name = "image", length = 1024)
    private String image;

    public static ProductReview from(User user, Product product, ProductReviewCreateDTO dto){
        return new ProductReview(user,product,dto);
    }

    private ProductReview(User user , Product product, ProductReviewCreateDTO reviewdto){
        this.body = reviewdto.getBody();
        this.image = reviewdto.getImage();
        this.star = reviewdto.getStar();
        this.title = reviewdto.getTitle();
        this.user = user;
        this.product = product;
    }

    public static ProductReviewDTO toDTO(ProductReview productReview){
        return ProductReviewDTO.builder()
                .reviewId(productReview.getId())
                .title(productReview.getTitle())
                .body(productReview.getBody())
                .image(productReview.getImage())
                .star(productReview.getStar())
                .user(new UserSimpleInfoDTO(productReview.getUser()))
                .build();

    }
}