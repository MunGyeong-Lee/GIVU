package com.backend.givu.docs;

import com.backend.givu.model.responseDTO.ProductReviewDTO;
import com.fasterxml.jackson.core.JsonProcessingException;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface ProductReviewControllerDocs {

    @Operation(
            summary = "해당 상품 댓글 등록",
            description =
                    "해당 상품에 댓글(글 + 이미지)을 등록합니다.\n\n" +
                            "**요청 형식 예시 (`data` 파트):**\n\n" +
                            "```json\n" +
                            "{\n" +
                            "  \"title\": \"정말 좋아요!\",\n" +
                            "  \"body\": \"배송도 빠르고 퀄리티도 좋습니다.\",\n" +
                            "  \"star\": 5\n" +
                            "}\n" +
                            "```\n\n" +
                            "이미지는 `image` 파트로 파일 첨부해주세요."
    )
    public ResponseEntity<ProductReviewDTO> saveProductReview(
            @PathVariable int productId,
            @RequestPart("data") String data, // JSON 문자열로 받기
            @RequestPart(value = "image", required = false) MultipartFile imageFile,
            HttpServletRequest request) throws IOException;

    @Operation(
            summary = "해당 상품 댓글 수정",
            description =
                    "해당 상품에 댓글(글 + 이미지)을 수정합니다.\n\n" +
                            "**요청 형식 예시 (`data` 파트):**\n\n" +
                            "```json\n" +
                            "{\n" +
                            "  \"title\": \"정말 좋아요!\",\n" +
                            "  \"body\": \"배송도 빠르고 퀄리티도 좋습니다.\",\n" +
                            "  \"star\": 5\n" +
                            "}\n" +
                            "```\n\n" +
                            "이미지는 `image` 파트로 파일 첨부해주세요."
    )
    public ResponseEntity<ProductReviewDTO> updateProductReview(
            @PathVariable int reviewId,
            @RequestPart("data") String data,
            @RequestPart(value = "image", required = false) MultipartFile imageFile,
            HttpServletRequest request) throws IOException;
}