package com.backend.givu.docs;

import com.backend.givu.model.entity.CustomUserDetail;
import com.backend.givu.model.responseDTO.LettersDTO;
import com.backend.givu.model.responseDTO.ReviewsDTO;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface LetterControllerDocs {

    @Operation(
            summary = "편지 생성",
            description =
                    "해당 펀딩에 대한 편지를 생성합니다.\n\n" +
                            "**요청 형식 예시 (`data` 파트):**\n\n" +
                            "```json\n" +
                            "{\n" +
                            "  \"comment\": \"선물 잘 받았으면 좋겠다~~\",\n" +
                            "  \"access\": \"공개\"\n" +

                            "}\n" +
                            "```\n\n" +
                            "이미지는 `image` 파트로 파일 첨부해주세요."
    )
    public ResponseEntity<LettersDTO> saveLetter(
            @AuthenticationPrincipal CustomUserDetail userDetail,
            @PathVariable int fundingId,
            @RequestPart("data") String data,
            @RequestPart(value = "image", required = false) MultipartFile imageFile,
            HttpServletRequest request) throws IOException;


}