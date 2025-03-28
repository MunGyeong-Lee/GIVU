package com.backend.givu.model.repository;

import com.backend.givu.model.entity.Product;
import com.backend.givu.model.responseDTO.ProductReviewDTO;
import com.backend.givu.model.responseDTO.ProductsDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {
    @Query("""
    SELECT new com.backend.givu.model.responseDTO.ProductReviewDTO(
        r.id, r.title, r.body, r.image, r.star,
        u.id, u.nickname, u.profileImage
    )
    FROM ProductReview r
    JOIN r.user u
    WHERE r.product.id = :productId
""")
    List<ProductReviewDTO> findReviewsByProductId(@Param("productId") int productId);
}
