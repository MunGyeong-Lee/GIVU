package com.backend.givu.controller;

import com.backend.givu.docs.ProductReviewControllerDocs;
import com.backend.givu.model.requestDTO.ProductReviewCreateDTO;
import com.backend.givu.model.responseDTO.ProductReviewDTO;
import com.backend.givu.model.service.ProductService;
import com.backend.givu.model.service.S3UploadService;
import com.backend.givu.util.JwtUtil;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.AccessDeniedException;

@Tag(name = "ProductReview", description = "상품(GIVU몰) 리뷰 관련 API")
@RestController
@RequestMapping("/products-review")
@RequiredArgsConstructor
public class ProductReviewController implements ProductReviewControllerDocs {

    private final ProductService productService;
    private final S3UploadService s3UploadService;
    private final JwtUtil jwtUtil;

    @PostMapping(value = "/{productId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProductReviewDTO> saveProductReview(
            @PathVariable int productId,
            @RequestPart("data") String data, // JSON 문자열로 받기
            @RequestPart(value = "image", required = false) MultipartFile imageFile,
            HttpServletRequest request) throws IOException {

        String token = request.getHeader("Authorization");
        Long userId = jwtUtil.getUserId(token);

        // JSON 문자열 → DTO 변환
        ObjectMapper objectMapper = new ObjectMapper();
        ProductReviewCreateDTO dto = objectMapper.readValue(data, ProductReviewCreateDTO.class);

        // 이미지가 있으면 S3에 업로드 후 DTO에 URL 설정
        if (imageFile != null && !imageFile.isEmpty()) {
            String imageUrl = s3UploadService.uploadFile(imageFile, "reviews");
            dto.setImage(imageUrl);  // DTO에 setImage() 메서드 필요
        }

        ProductReviewDTO savedReview = productService.saveProductReview(userId, productId, dto);
        return ResponseEntity.ok(savedReview);
    }

    @PatchMapping(value = "/{reviewId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProductReviewDTO> updateProductReview(
            @PathVariable int reviewId,
            @RequestPart("data") String data,
            @RequestPart(value = "image", required = false) MultipartFile imageFile,
            HttpServletRequest request) throws IOException {

        String token = request.getHeader("Authorization");
        Long userId = jwtUtil.getUserId(token);

        ObjectMapper objectMapper = new ObjectMapper();
        ProductReviewCreateDTO dto = objectMapper.readValue(data, ProductReviewCreateDTO.class);

        if (imageFile != null && !imageFile.isEmpty()) {
            String imageUrl = s3UploadService.uploadFile(imageFile, "reviews");
            dto.setImage(imageUrl);
        }

        ProductReviewDTO updatedReview = productService.updateProductReview(userId, reviewId, dto);
        return ResponseEntity.ok(updatedReview);
    }

    @Operation(summary = "상품 리뷰 삭제", description = "해당 상품 리뷰를 삭제합니다.")
    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Void> deleteReview(@PathVariable int reviewId, HttpServletRequest request) throws AccessDeniedException {
        String token = request.getHeader("Authorization");
        Long userId = jwtUtil.getUserId(token);

        productService.deleteReview(userId, reviewId);

        return ResponseEntity.noContent().build(); // 204
    }






}
