package com.backend.givu.model.repository;

import com.backend.givu.model.entity.ProductReview;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductReviewRepository extends JpaRepository<ProductReview, Integer> {

    @Query("SELECT AVG(r.star) FROM ProductReview r WHERE r.product.id = :productId")
    Double findAverageStarByProductId(@Param("productId") Integer productId);

}
