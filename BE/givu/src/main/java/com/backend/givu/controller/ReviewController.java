package com.backend.givu.controller;

import com.backend.givu.model.dto.ReviewsDTO;
import com.backend.givu.model.entity.Review;
import com.backend.givu.model.service.ReviewService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Review", description = "후기 관련 API")
@RestController
@RequestMapping("/fundings/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    public ResponseEntity<Review> saveReview(@RequestBody ReviewsDTO dto){
        Review savedRievew = reviewService.saveReview(dto);
        return ResponseEntity.ok(savedRievew);
    }
}
