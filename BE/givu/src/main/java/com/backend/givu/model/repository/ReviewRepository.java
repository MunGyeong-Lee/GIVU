package com.backend.givu.model.repository;

import com.backend.givu.model.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Integer> {

    Optional<Review> findByFundingId(Integer fundingId);

    // Reiview + User fetch join
    @Query("""  
    SELECT r
    FROM Review r
    JOIN FETCH r.user
    """)
    List<Review> findAllWithUser();

}
