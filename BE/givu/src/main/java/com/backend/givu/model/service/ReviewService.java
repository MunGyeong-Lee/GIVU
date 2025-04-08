package com.backend.givu.model.service;

import com.backend.givu.model.entity.Funding;
import com.backend.givu.model.entity.Review;
import com.backend.givu.model.entity.User;
import com.backend.givu.model.repository.FundingRepository;
import com.backend.givu.model.repository.ReviewRepository;
import com.backend.givu.model.repository.UserRepository;
import com.backend.givu.model.requestDTO.ReviewCreateDTO;
import com.backend.givu.model.responseDTO.ReviewDetailDTO;
import com.backend.givu.model.responseDTO.ReviewsDTO;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final FundingRepository fundingRepository;
    private final S3UploadService s3UploadService;


    /**
     *  후기 생성
     */
    public ReviewsDTO saveReview (Long userId, Integer fundingId, ReviewCreateDTO reviewdto) throws AccessDeniedException{
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

        Review saveReview = reviewRepository.save(Review.from(user,funding, reviewdto));
        return Review.toDTO(saveReview);
    }

    /**
     * 후기 리스트
     */
    public List<ReviewsDTO> reviewList(){
        List<Review> reviews = reviewRepository.findAllWithUser();
        return reviews.stream()
                .map(ReviewsDTO::new) // 생성자로 매핑
                .collect(Collectors.toList());
    }

    /**
     * 후기 상세
     */
    public ReviewDetailDTO revieDetail(Long userId, int reviewId){

        Review review = reviewRepository.findByIdWithUser(reviewId)
                .orElseThrow(()-> new EntityNotFoundException("후기를 찾을 수 없습니다."));
        boolean creator = userId.equals(review.getUser().getId());
        return new ReviewDetailDTO(review, creator);
    }


    /**
     *  후기 삭제
     */
    public void deleteReview(Long userId, int reviewId) throws AccessDeniedException {

        // 존재하는 펀딩인지 확인
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(()-> new EntityNotFoundException("펀딩을 찾을 수 없습니다."));

        // 본인 후기인지 확인
        if(!review.getUser().getId().equals(userId)){
            throw new AccessDeniedException("후기 삭제 권한이 없습니다.");
        }

        // 후기에 등록된 이미지가 있다면 S3에서 이미지 삭제
        if(review.getImage() != null && !review.getImage().isEmpty()){
            List<String> imageUrl =  new ArrayList<>();
            imageUrl.add(review.getImage());
            s3UploadService.deleteFile(imageUrl);
        }

        reviewRepository.deleteById(reviewId);
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
