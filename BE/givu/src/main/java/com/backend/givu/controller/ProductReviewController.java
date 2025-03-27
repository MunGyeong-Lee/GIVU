package com.backend.givu.controller;

import com.backend.givu.model.requestDTO.ProductReviewCreateDTO;
import com.backend.givu.model.responseDTO.ProductReviewDTO;
import com.backend.givu.model.service.ProductService;
import com.backend.givu.model.service.S3UploadService;
import com.backend.givu.util.JwtUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "ProductReview", description = "상품(GIVU몰) 리뷰 관련 API")
@RestController
@RequestMapping("/products-review")
@RequiredArgsConstructor
public class ProductReviewController {

    private final ProductService productService;
    private final S3UploadService s3UploadService;
    private final JwtUtil jwtUtil;

    @Operation(summary = "댓글 등록", description = "해당 상품에 댓글을 등록합니다.")
    @PostMapping("/{productId}")
    public ResponseEntity<ProductReviewDTO> saveProductReview(@PathVariable int productId,
                                                              @RequestBody ProductReviewCreateDTO dto,
                                                              HttpServletRequest request) {
        String token = request.getHeader("Authorization"); // "Bearer ..." 형식
        Long userId = jwtUtil.getUserId(token); // JwtUtil은 DI 받아야 함
        return ResponseEntity.ok(productService.saveProductReview(userId, productId, dto));

    }
}
