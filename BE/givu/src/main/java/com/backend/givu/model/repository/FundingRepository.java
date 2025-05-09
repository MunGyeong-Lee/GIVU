package com.backend.givu.model.repository;

import com.backend.givu.model.entity.Funding;
import com.backend.givu.model.entity.Letter;
import com.backend.givu.model.entity.Review;
import com.backend.givu.model.responseDTO.FundingsDTO;
import com.backend.givu.model.responseDTO.ReviewsDTO;
import io.lettuce.core.dynamic.annotation.Param;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FundingRepository extends JpaRepository<Funding, Integer> {

    @Query("""
    SELECT f
    FROM Funding f
    JOIN FETCH f.user u
    JOIN FETCH f.product p
""")
    List<Funding> findAllWithUserAndProduct();

    @Query("""
    SELECT f FROM Funding f
    JOIN FETCH f.user u
    JOIN FETCH f.product p
    WHERE f.scope = 'PUBLIC'
       OR (f.scope = 'PRIVATE' AND u.id IN :friendIds)
""")
    List<Funding> findAllVisibleFundings(@Param("friendIds") List<Long> friendIds);

    @Query("""
    SELECT f FROM Funding f
    JOIN FETCH f.user u
    JOIN FETCH f.product p
    WHERE f.scope = 'PUBLIC'
""")
    List<Funding> findAllPublicWithUserAndProduct();




    @Query("""
    SELECT f
    FROM Funding f
    JOIN FETCH f.user u
    JOIN FETCH f.product p
    WHERE f.id = :fundingId
""")
    Optional<Funding> findByIdWithUserAndProduct (@Param("fundingId") Integer fundingId);


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


    @Query("""
    SELECT  distinct f
    FROM Funding f
    JOIN FETCH f.user u
    JOIN FETCH f.product p
    WHERE u.id = :userId
""")
    List<Funding> findAllMyFundingWithUserAndProduct(@Param("userId") long userId);

    @Query("""
    SELECT DISTINCT f
    FROM Participant p
    JOIN p.funding f
    JOIN FETCH f.user
    JOIN FETCH f.product
    WHERE p.user.id = :userId
""")
    List<Funding> findMyParticipantFunding(@Param("userId") Long userId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT f FROM Funding f WHERE f.id = :fundingId")
    Optional<Funding> findByIdForUpdate(@Param("fundingId") int fundingId);

}
