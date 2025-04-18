package com.backend.givu.model.repository;

import com.backend.givu.model.entity.Letter;
import com.backend.givu.model.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LetterRepository extends JpaRepository<Letter, Integer> {

//    Optional<Review> findByFundingId(Integer fundingId);
}
