package com.backend.givu.controller;

import com.backend.givu.model.entity.Funding;
import com.backend.givu.model.entity.Product;
import com.backend.givu.model.responseDTO.FundingsDTO;
import com.backend.givu.model.responseDTO.ImageUploadResponseDTO;
import com.backend.givu.model.service.FundingService;
import com.backend.givu.model.service.S3UploadService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Tag(name = "Funding", description = "펀딩관련 API")
@RestController
@RequestMapping("/fundings")
@RequiredArgsConstructor
@Slf4j
public class FundingController {

    private final S3UploadService s3UploadService;
    private final FundingService fundingService;


    @Operation(summary = "펀딩 이미지 업로드", description = "파일과 fundingId를 받아 이미지를 업로드합니다.")
    @PutMapping(value = "/{fundingId}/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ImageUploadResponseDTO> updateProductImage(@PathVariable int fundingId,
                                                                     @Parameter(description = "업로드할 이미지 파일")
                                                                     @RequestPart("file") MultipartFile file) {
        log.info("펀딩 이미지 업로드 몇번 :" +  fundingId );
        try {
            // S3에 imageURL로 펀딩 ID 알아볼 수 있게 저장
            String imageUrl = s3UploadService.uploadFile(file, "fundings/" + fundingId);

            log.info("imageUrl {} " +  imageUrl );

            // 해당 funding 조회
            Funding fundig = fundingService.findFundingEntity(fundingId);

            // img url 바꾸기
            fundig.addImage(imageUrl); //  리스트로 저장되게!!
            fundingService.saveFundingEntity(fundig);

            return ResponseEntity.ok(new ImageUploadResponseDTO(imageUrl));
        } catch (IOException e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ImageUploadResponseDTO(null, "이미지 업로드에 실패했습니다."));
        }
    }

//
//    @Operation(summary = "펀딩 리스트 조회", description = "전체 펀딩 리스트를 조회합니다.")
//    @GetMapping(value = "/list")
//    public ResponseEntity<List<FundingsDTO>> findAll(){
//
//        List<FundingsDTO> fundingList = fundingService.findAllFunding();
//        return ResponseEntity.ok(fundingList);
//    }
//




}
