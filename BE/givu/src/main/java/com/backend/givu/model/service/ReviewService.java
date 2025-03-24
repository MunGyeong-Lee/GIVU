package com.backend.givu.model.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReviewService {

//    private final ReviewRepository reviewRepository;
//    private final UserRepository userRepository;

//    public Review saveReview(ReviewsDTO dto) {
        // 1. fundingId → Funding 객체 조회
//        Funding funding = fundingsRepository.findById(dto.getFundingId())
//                .orElseThrow(() -> new RuntimeException("펀딩이 존재하지 않습니다."));
//
//        User user = userRepository.findById(dto.getUserId())
//                .orElseThrow(() -> new RuntimeException("사용자가 존재하지 않습니다."));
//
//        Review review = Review.builder()
//                .image(dto.getImage())
//                .visit(dto.getVisit())
//                .comment(dto.getComment())
//                .createdAt(Instant.from(dto.getCreatedAt()))
//                .updatedAt(Instant.from(dto.getUpdatedAt()))
//                .funding(funding)       // ✅ 객체 주입
//                .user(user)             // ✅ 객체 주입
//                .build();
//
//        return reviewRepository.save(review);
//    }

}
