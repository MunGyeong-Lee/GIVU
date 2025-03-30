package com.backend.givu.controller;

import com.backend.givu.model.entity.CustomUserDetail;
import com.backend.givu.model.entity.Funding;
import com.backend.givu.model.entity.Product;
import com.backend.givu.model.repository.ProductRepository;
import com.backend.givu.model.requestDTO.FundingCreateDTO;
import com.backend.givu.model.requestDTO.FundingUpdateDTO;
import com.backend.givu.model.responseDTO.FundingsDTO;
import com.backend.givu.model.responseDTO.ImageUploadResponseDTO;
import com.backend.givu.model.service.FundingService;
import com.backend.givu.model.service.S3UploadService;
import com.backend.givu.util.JwtUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Tag(name = "Funding", description = "펀딩관련 API")
@RestController
@RequestMapping("/fundings")
@RequiredArgsConstructor
@Slf4j
public class FundingController {
    private final ProductRepository productRepository;

    private final S3UploadService s3UploadService;
    private final FundingService fundingService;
    private final JwtUtil jwtUtil;


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


    @Operation(summary = "펀딩 리스트 조회", description = "전체 펀딩 리스트를 조회합니다.")
    @GetMapping(value = "/list")
    public ResponseEntity<List<FundingsDTO>> findAll(){

        List<FundingsDTO> fundingList = fundingService.findAllFunding();
        return ResponseEntity.ok(fundingList);
    }

    @Operation(summary = "펀딩 생성", description = "펀딩을 생성 합니다.")
    @PostMapping(value = "",  consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<FundingsDTO> saveFunding(
            @AuthenticationPrincipal CustomUserDetail userDetail,
            @RequestPart("data") String data,
            @RequestPart(value = "image", required = false) List<MultipartFile> imageFiles,
            HttpServletRequest request) throws IOException{

        // accessToken 유저 ID
        Long userId = userDetail.getId();

        // Json 문자열 -> DTO 변환
        ObjectMapper objectMapper = new ObjectMapper();
        FundingCreateDTO dto = objectMapper.readValue(data, FundingCreateDTO.class);

        List<String> imageUrls  = new ArrayList<>();
        // 이미지가 존재하면 업로드하고 URL 전달
        if(imageFiles != null && !imageFiles.isEmpty()){
            for(MultipartFile file : imageFiles){
                if(!file.isEmpty()){
                    String imageUrl = s3UploadService.uploadFile(file, "fundings");
                    imageUrls.add(imageUrl);
                }
            }
        }

        FundingsDTO saveFunding = fundingService.saveFunding(userId, dto, imageUrls);
        return ResponseEntity.ok(saveFunding);
    }


    @Operation(summary = "펀딩 수정", description = "펀딩을 수정 합니다.")
    @PostMapping(value = "/{fundingId}",  consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<FundingsDTO> updateFunding (
            @AuthenticationPrincipal CustomUserDetail userDetail,
            @PathVariable int fundingId,
            @RequestPart("data") String data,
            @RequestPart(value = "image", required = false) List<MultipartFile> imageFiles,
            HttpServletRequest request) throws IOException {

        // accessToken 유저 ID
        Long userId = userDetail.getId();

        //Json 문자열 ->DTO 변환
        ObjectMapper objectMapper = new ObjectMapper();
        FundingUpdateDTO dto = objectMapper.readValue(data, FundingUpdateDTO.class);
        List<String> imageUrls = new ArrayList<>();
        // 이미지가 존재하면 업로드하고 URL 전달
        if(imageFiles != null && !imageFiles.isEmpty()){
            for(MultipartFile imageFile : imageFiles) {
                if (imageFile != null && !imageFile.isEmpty()) {
                    String imageUrl = s3UploadService.uploadFile(imageFile, "fundings");
                    imageUrls.add(imageUrl);
                }
            }
        }

        FundingsDTO updateFunding = fundingService.updateFunding(userId, fundingId, dto, imageUrls);
        return ResponseEntity.ok(updateFunding);


    }






}
