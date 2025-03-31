package com.backend.givu.controller;

import com.backend.givu.docs.ReviewControllerDocs;
import com.backend.givu.model.entity.CustomUserDetail;
import com.backend.givu.model.requestDTO.FundingCreateDTO;
import com.backend.givu.model.responseDTO.FundingsDTO;
import com.backend.givu.model.responseDTO.ImageUploadResponseDTO;
import com.backend.givu.model.responseDTO.ReviewsDTO;
import com.backend.givu.model.service.ReviewService;
import com.backend.givu.model.service.S3UploadService;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.AccessDeniedException;
import java.util.ArrayList;
import java.util.List;

@Tag(name = "Review", description = "후기 관련 API")
@RestController
@RequestMapping("/fundings/reviews")
@RequiredArgsConstructor
public class ReviewController implements ReviewControllerDocs {

    private final ReviewService reviewService;
    private final S3UploadService s3UploadService;


    /**
     *  리뷰 생성
     */
    @PostMapping(value = "/{fundingId}",  consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ReviewsDTO> saveReview(
            @AuthenticationPrincipal CustomUserDetail userDetail,
            @PathVariable int fundingId,
            @RequestPart("data") String data,
            @RequestPart(value = "image", required = false) MultipartFile imageFile,
            HttpServletRequest request) throws IOException {

        // accessToken 유저 ID
        Long userId = userDetail.getId();

        // Json 문자열 -> DTO 변환
        ObjectMapper objectMapper = new ObjectMapper();
        ReviewsDTO dto = objectMapper.readValue(data, ReviewsDTO.class);

        // 이미지가 존재하면 업로드하고 URL 전달
        if(imageFile != null && !imageFile.isEmpty()){
            String imageUrl = s3UploadService.uploadFile(imageFile, "fundingReviews");
            dto.setImage(imageUrl);
        }

        ReviewsDTO saveReview = reviewService.saveReview(userId, fundingId, dto);
        return ResponseEntity.ok(saveReview);

    }


//    @Operation(summary = "펀딩 후기 조회", description = "해당 펀딩의 후기를 조회합니다.")
//    @GetMapping(value = "/{fundingId}")
//    public ResponseEntity<ReviewsDTO>



}
