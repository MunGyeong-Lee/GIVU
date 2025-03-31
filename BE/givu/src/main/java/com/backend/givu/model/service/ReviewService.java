package com.backend.givu.model.service;

import com.backend.givu.model.entity.Funding;
import com.backend.givu.model.entity.Review;
import com.backend.givu.model.entity.User;
import com.backend.givu.model.repository.FundingRepository;
import com.backend.givu.model.repository.ReviewRepository;
import com.backend.givu.model.repository.UserRepository;
import com.backend.givu.model.responseDTO.ReviewsDTO;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final FundingRepository fundingRepository;


    /**
     *  리뷰 생성
     */
    public ReviewsDTO saveReview (Long userId, Integer fundingId, ReviewsDTO reviewsdto) throws AccessDeniedException{
        // 펀딩있는지
        Funding funding = fundingRepository.findById(fundingId)
                .orElseThrow(() -> new EntityNotFoundException("펀딩을 찾을 수 없습니다."));
        // 유저 있는지
        User user = userRepository.findById(userId)
                .orElseThrow(()-> new EntityNotFoundException("유저를 찾을 수 없습니다."));
        // 해당 유저가 만든 펀딩인 건지
        if(!funding.getUser().getId().equals(userId)){
            throw new AccessDeniedException("펀딩 리뷰 작성 권한이 없습니다.");
        }

        Review saveReview = reviewRepository.save(Review.from(user,funding, reviewsdto));
        return Review.toDTO(saveReview);
    }




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
