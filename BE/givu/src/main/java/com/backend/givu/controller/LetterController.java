package com.backend.givu.controller;

import com.amazonaws.Response;
import com.backend.givu.docs.LetterControllerDocs;
import com.backend.givu.model.entity.CustomUserDetail;
import com.backend.givu.model.entity.User;
import com.backend.givu.model.requestDTO.LetterCreateDTO;
import com.backend.givu.model.responseDTO.LettersDTO;
import com.backend.givu.model.responseDTO.ReviewsDTO;
import com.backend.givu.model.service.LetterService;
import com.backend.givu.model.service.S3UploadService;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Tag(name = "Letter", description = "펀딩 편지 관련 API")
@RestController
@RequestMapping("/fundings/letters")
@RequiredArgsConstructor
@Slf4j
public class LetterController implements LetterControllerDocs {

    public final S3UploadService s3UploadService;
    public final LetterService letterService;


    /**
     * 편지 생성
     */
    @PostMapping(value = "/{fundingId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<LettersDTO> saveLetter(
            @AuthenticationPrincipal CustomUserDetail userDetail,
            @PathVariable int fundingId,
            @RequestPart("data") String data,
            @RequestPart(value = "image", required = false) MultipartFile imageFile,
            HttpServletRequest request) throws IOException {

        User user = userDetail.getUser();

        // Json 문자열 -> DTO 변환
        ObjectMapper objectMapper = new ObjectMapper();
        LetterCreateDTO dto = objectMapper.readValue(data, LetterCreateDTO.class);


        // 이미지가 존재하면 업로드하고 URL 전달
        if(imageFile != null && !imageFile.isEmpty()){
            String imageUrl = s3UploadService.uploadFile(imageFile, "fundingReviews");
            dto.setImage(imageUrl);
        }

        LettersDTO saveLetter = letterService.saveLetter(user, fundingId, dto);
        return ResponseEntity.ok(saveLetter);




    }

}
