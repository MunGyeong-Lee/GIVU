package com.backend.givu.controller;

import com.backend.givu.docs.FundingControllerDocs;
import com.backend.givu.kafka.transferController;
import com.backend.givu.model.entity.CustomUserDetail;
import com.backend.givu.model.entity.Funding;
import com.backend.givu.model.repository.ProductRepository;
import com.backend.givu.model.requestDTO.FundingCreateDTO;
import com.backend.givu.model.requestDTO.FundingUpdateDTO;
import com.backend.givu.model.responseDTO.*;
import com.backend.givu.model.service.FundingService;
import com.backend.givu.model.service.S3UploadService;
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
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import org.springframework.security.access.AccessDeniedException;
import java.util.ArrayList;
import java.util.List;

@Tag(name = "Funding", description = "펀딩관련 API")
@RestController
@RequestMapping("/fundings")
@RequiredArgsConstructor
@Slf4j
public class FundingController implements FundingControllerDocs {
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


    @Operation(summary = "펀딩 리스트 조회", description = "전체 펀딩 리스트를 조회합니다.")
    @GetMapping(value = "/list")
    public ResponseEntity<List<FundingsDTO>> findAll(@AuthenticationPrincipal CustomUserDetail customUserDetail){
        Long userId = customUserDetail != null ? customUserDetail.getId() : null;
        List<FundingsDTO> fundingList = fundingService.findAllFunding(userId);
        return ResponseEntity.ok(fundingList);
    }

    @Operation(summary = "검색한 펀딩 리스트 조회", description = "검색한 펀딩 리스트를 조회합니다.")
    @GetMapping("/search")
    public ApiResponse<List<FundingsDTO>> searchFundings(
            @RequestParam String title,
            @AuthenticationPrincipal CustomUserDetail userDetail) {

        Long userId = userDetail != null ? userDetail.getId() : null;
        return fundingService.findAllSearchFunding(title, userId);
    }

    @PostMapping("/reindex")
    public ResponseEntity<String> reindexAllProducts() {
        fundingService.indexAllFundingsToElasticsearch();
        return ResponseEntity.ok("✅ 모든 상품을 Elasticsearch에 색인 완료!");
    }


    /**
     * 펀딩생성
     */
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


    /**
     * 펀딩 수정
     */
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

    @Operation(summary = "펀딩 삭제", description = "펀딩을 수정 합니다.")
    @DeleteMapping(value = "/{fundingId}")
    public ResponseEntity<Void> deleteFunding (
            @AuthenticationPrincipal CustomUserDetail userDetail,
            @PathVariable int fundingId,
            HttpServletRequest request) throws AccessDeniedException {

        // accessToken 유저 ID
        Long userId = userDetail.getId();
        log.info("펀딩 삭제 요청: userId={}, fundingId={}", userId, fundingId);

        fundingService.deleteFunding(userId, fundingId);
        return ResponseEntity.noContent().build(); //204 No Content
    }

//    @Operation(summary = "펀딩 완료", description = "해당 펀딩을 완료시킵니다.")
//    @PutMapping(value = "/{fundingId}/complete")
//    public ResponseEntity<FundingsDTO> completeFunding(
//            @AuthenticationPrincipal CustomUserDetail userDetail,
//            @PathVariable int fundingId,
//            HttpServletRequest request) throws AccessDeniedException{
//
//        Long userId = userDetail.getId();
//        log.info("펀딩 완료 요청: userId={}, fundingId={}", userId, fundingId);
//
//        FundingsDTO completeFunding = fundingService.completeFunding(userId, fundingId);
//        return ResponseEntity.ok(completeFunding);
//
//    }


    @Operation(summary = "펀딩 상세보기", description = "해당 펀딩 상세를 보여줍니다.")
    @GetMapping(value = "/{fundingId}")
    public ResponseEntity<ApiResponse<FundingDetailDTO>> fundingDetail(
            @AuthenticationPrincipal CustomUserDetail userDetail,
            @PathVariable int fundingId,
            HttpServletRequest request) throws IOException {

        Long userId = (userDetail != null) ? userDetail.getId() : null;

        ApiResponse<FundingDetailDTO> fundingDetail = fundingService.fundingDetail(userId, fundingId);
        return ResponseEntity.ok(fundingDetail);
    }




    @Operation(summary = "펀딩결제 현황 조회", description = "해당 펀딩 결제 현황을 조회합니다.")
    @GetMapping(value="/{paymentId}/transfer")
    public ResponseEntity<ApiResponse<PaymentResultDTO>> paymentResult(
            @AuthenticationPrincipal CustomUserDetail userDetail,
            @PathVariable int paymentId,
            HttpServletRequest request)throws IOException {

        Long userId = userDetail.getId();
        PaymentResultDTO fundingTransfer = fundingService.paymentResult(userId, paymentId);
        return ResponseEntity.ok(ApiResponse.success(fundingTransfer));
    }





}
