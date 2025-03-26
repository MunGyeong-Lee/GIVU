package com.backend.givu.model.repository;

import com.backend.givu.model.entity.ProductReview;
import com.backend.givu.model.responseDTO.ProductReviewSimpleDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductReviewRepository extends JpaRepository<ProductReview, Integer> {
    @Query("SELECT new com.backend.givu.model.responseDTO.ProductReviewSimpleDTO(r.id, r.title, r.star, r.user.id) " +
            "FROM ProductReview r WHERE r.product.id = :productId")
    List<ProductReviewSimpleDTO> findReviewsByProductId(@Param("productId") Integer productId);
}
