package com.backend.givu.controller;

import com.backend.givu.kafka.payment.GivuTransferService;
import com.backend.givu.model.entity.CustomUserDetail;
import com.backend.givu.model.entity.Product;
import com.backend.givu.model.responseDTO.*;
import com.backend.givu.model.service.ProductService;
import com.backend.givu.model.service.S3UploadService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Tag(name = "Product", description = "상품(GIVU몰) 관련 API")
@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;
    private final S3UploadService s3UploadService;
    private final GivuTransferService givuTransferService;

    @Operation(summary = "상품 전체 리스트 조회", description = "상품 전체 목록을 조회합니다.")
    @GetMapping("/list")
    public ResponseEntity<List<ProductsDTO>> findAll() {
        List<ProductsDTO> productList = productService.findAllProduct();
        return ResponseEntity.ok(productList);
    }

    @Operation(summary = "검색 상품 조회", description = "해당 검색어가 이름 또는 설명에 포함된 모든 상품을 조회합니다.")
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<ProductsDTO>>> searchProducts(@RequestParam String keyword) {
        ApiResponse<List<ProductsDTO>> response = productService.findAllSearchProduct(keyword);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "내가 좋아요 한 상품 조회", description = "내가 좋아요를 누른 모든 상품을 조회합니다.")
    @GetMapping("/search/likeProduct")
    public ResponseEntity<ApiResponse<List<ProductsDTO>>> searchLikeProducts(@AuthenticationPrincipal CustomUserDetail customUserDetail) {
        long userId = customUserDetail.getId();
        ApiResponse<List<ProductsDTO>> response = productService.findAllLikeProduct(userId);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "상품 상세 조회", description = "상품 상세 정보를 조회합니다.")
    @GetMapping("/{productId}")
    public ResponseEntity<ProductDetailDTO> findProduct(
            @PathVariable int productId,
            @AuthenticationPrincipal CustomUserDetail userDetails) {

        Long userId = (userDetails != null) ? userDetails.getId() : null;

        ProductDetailDTO product = productService.findProductDetailByProductId(productId, userId);
        return ResponseEntity.ok(product);
    }


    @Operation(summary = "상품 이미지 업로드", description = "파일과 productId를 받아 이미지를 업로드합니다.")
    @PutMapping(value = "/{productId}/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ImageUploadResponseDTO> updateProductImage(@PathVariable int productId,
                                                                     @Parameter(description = "업로드할 이미지 파일")
                                                                     @RequestPart("file") MultipartFile file) {
        try {
            // S3에 imageURL로 상품 ID 알아볼 수 있게 저장
            String imageUrl = s3UploadService.uploadFile(file, "products/" + productId);

            // 해당 product 조회
            Product product = productService.findProductEntity(productId);

            // img url 바꾸기
            product.setImage(imageUrl);
            productService.saveProductEntity(product);

            return ResponseEntity.ok(new ImageUploadResponseDTO(imageUrl));
        } catch (IOException e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ImageUploadResponseDTO(null, "이미지 업로드에 실패했습니다."));
        }
    }

    @Operation(summary = "상품 좋아요", description = "해당 상품의 좋아요를 추가합니다.")
    @PatchMapping("/{productId}/like")
    public ResponseEntity<Void> increaseLike(
            @AuthenticationPrincipal CustomUserDetail userDetail, @PathVariable int productId) {
        Long userId = userDetail.getId();
        productService.likeProduct(userId, productId);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "상품 좋아요 취소", description = "해당 상품의 좋아요를 해제합니다.")
    @PatchMapping("/{productId}/like/cancel")
    public ResponseEntity<Void> decreaseLike(
            @AuthenticationPrincipal CustomUserDetail userDetail, @PathVariable int productId) {
        Long userId = userDetail.getId();
        productService.unlikeProduct(userId, productId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/products/reindex")
    public ResponseEntity<String> reindexAllProducts() {
        productService.indexAllProductsToElasticsearch();
        return ResponseEntity.ok("✅ 모든 상품을 Elasticsearch에 색인 완료!");
    }

    @Operation(summary = "상품 구매 요청", description = "기뷰페이로 상품을 구매합니다.")
    @PostMapping(value = "/purchase/{productId}")
    public ResponseEntity<ApiResponse<PaymentResultDTO>> purchaseProduct(
            @AuthenticationPrincipal CustomUserDetail userDetail,
            @PathVariable int productId,
            @RequestParam int amount,
            HttpServletRequest request) {

        Long userId = userDetail.getId();
        ApiResponse<PaymentResultDTO> result = givuTransferService.purchaseProduct(userId, productId, amount);
        return ResponseEntity.ok(result);
    }

    @Operation(summary = "상품 결제 현황 조회", description = "상품 구매 결제 상태를 조회합니다.")
    @GetMapping(value = "/{paymentId}/product")
    public ResponseEntity<ApiResponse<PaymentResultDTO>> productPaymentResult(
            @AuthenticationPrincipal CustomUserDetail userDetail,
            @PathVariable int paymentId,
            HttpServletRequest request) throws IOException {

        Long userId = userDetail.getId();
        PaymentResultDTO result = productService.paymentResult(userId, paymentId);

        return ResponseEntity.ok(ApiResponse.success(result));
    }

}
