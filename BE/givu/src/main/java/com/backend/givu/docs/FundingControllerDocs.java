package com.backend.givu.docs;

import com.backend.givu.model.entity.CustomUserDetail;
import com.backend.givu.model.responseDTO.FundingsDTO;
import com.backend.givu.model.responseDTO.ProductReviewDTO;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface FundingControllerDocs {

    @Operation(
            summary = "펀딩 생성",
            description =
                    "해당 펀딩을 수정 합니다.\n\n" +
                            "**요청 형식 예시 (`data` 파트):**\n\n" +
                            "```json\n" +
                            "{\n" +
                            "  \"title\": \"얘들아 펀딩해줘~!\",\n" +
                            "  \"productId\": \"3\",\n" +
                            "  \"body\": \"test1\",\n" +
                            "  \"description\": \"test2\",\n" +
                            "  \"category\": \"집들이\",\n" +
                            "  \"categoryName\": null,\n" +
                            "  \"scope\": \"공개\"\n" +
                            "}\n" +
                            "```\n\n" +
                            "이미지는 `image` 파트로 파일 첨부해주세요."
    )

    public ResponseEntity<FundingsDTO> saveFunding(
            @AuthenticationPrincipal CustomUserDetail userDetail,
            @RequestPart("data") String data,
            @RequestPart(value = "image", required = false) List<MultipartFile> imageFiles,
            HttpServletRequest request) throws IOException;




    @Operation(
            summary = "펀딩 수정",
            description =
                    "펀딩을 생성합니다.\n\n" +
                            "**요청 형식 예시 (`data` 파트):**\n\n" +
                            "```json\n" +
                            "{\n" +
                            "  \"title\": \"얘들아 펀딩해줘~!\",\n" +
                            "  \"body\": \"test1\",\n" +
                            "  \"description\": \"test2\",\n" +
                            "  \"category\": \"집들이\",\n" +
                            "  \"categoryName\": null,\n" +
                            "  \"scope\": \"공개\",\n" +
                            "  \"toDelete\": [\n" +
                            "    \"https://givuproject-images.s3.ap-northeast-2.amazonaws.com/...\"\n" +
                            "  ]\n" +
                            "}\n" +
                            "```\n\n" +
                            "이미지는 `image` 파트로 파일 첨부해주세요."
    )
    public ResponseEntity<FundingsDTO> updateFunding (
            @AuthenticationPrincipal CustomUserDetail userDetail,
            @PathVariable int fundingId,
            @RequestPart("data") String data,
            @RequestPart(value = "image", required = false) List<MultipartFile> imageFiles,
            HttpServletRequest request) throws IOException;



}

