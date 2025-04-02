package com.backend.givu.model.repository;

import com.backend.givu.model.entity.Funding;
import com.backend.givu.model.entity.Letter;
import com.backend.givu.model.entity.Review;
import com.backend.givu.model.responseDTO.FundingsDTO;
import com.backend.givu.model.responseDTO.ReviewsDTO;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FundingRepository extends JpaRepository<Funding, Integer> {

    @Query("""
    SELECT f
    FROM Funding f
    JOIN FETCH f.user u
    JOIN FETCH f.product p
""")
    List<Funding> findAllWithUserAndProduct();


    // Letter + User fetch join
    @Query("""
    SELECT l
    FROM    Letter l
    JOIN FETCH l.user
    WHERE l.funding.id = :fundingId
""")
    List<Letter> findLetterByFundingIdWithUser(@Param("fundingId") Integer fundingId);

    // Reiview + User fetch join
    @Query("""
    SELECT r
    FROM Review r
    JOIN FETCH r.user
    WHERE r.funding.id = :fundingId
""")
    List<Review> findReviewByFundingIdWithUser(@Param("fundingId") Integer fundingId);

}
