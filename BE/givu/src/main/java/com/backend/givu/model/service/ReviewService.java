package com.backend.givu.model.service;

import com.backend.givu.model.dto.ReviewsDTO;
import com.backend.givu.model.entity.Review;
import com.backend.givu.model.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;

    public Review saveReview(ReviewsDTO dto){
        Review review = Review.builder()
                .reviewId(dto.getReviewId())
                .image(dto.getImage())
                .visit(dto.getVisit())
                .comment(dto.getComment())
                .createdAt(dto.getCreatedAt())
                .fundingId(dto.getFundingId())
                .updatedAt(dto.getUpdatedAt())
                .userId(dto.getUserId())
                .build();

        return reviewRepository.save(review);
    }
}
